import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";
import { sendVerificationEmail } from "./ses";
import { getIpIntelligence } from "./ip-intel";
import { logFraudEvent } from "./fraud";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, user.name, url);
    },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email":            { window: 60,  max: 10 },
      "/sign-up/email":            { window: 3600, max: 5 },
      "/send-verification-email":  { window: 900, max: 3 },
      "/request-password-reset":   { window: 900, max: 3 },
      "/forget-password":          { window: 900, max: 3 },
      "/change-password":          { window: 900, max: 5 },
      "/change-email":             { window: 900, max: 5 },
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"],
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { status: true },
          });

          if (!user || user.status === "banned" || user.status === "suspended") {
            logFraudEvent(session.userId, "banned_login_attempt", {
              status: user?.status ?? "deleted",
            });
            return false;
          }

          return { data: session };
        },

        // Detection-only, fire-and-forget — never blocks the login response.
        after: async (session, ctx) => {
          if (!session) return;

          void (async () => {
            try {
              const ip = session.ipAddress;
              const agent = session.userAgent;
              const skipIp = !ip || ip === "127.0.0.1" || ip === "::1" || ip === "unknown";
              const fingerprint = ctx?.headers?.get("x-fingerprint") || null;

              // Parallel: independent reads + fingerprint store
              const [previousSessions, sharedIpUsers, intel, fingerprintMatches] =
                await Promise.all([
                  prisma.session.findMany({
                    where: { userId: session.userId, id: { not: session.id } },
                    select: { ipAddress: true, userAgent: true },
                    orderBy: { createdAt: "desc" },
                    take: 50,
                  }),
                  !skipIp
                    ? prisma.session.findMany({
                        where: {
                          ipAddress: ip,
                          userId: { not: session.userId },
                          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                        },
                        select: { userId: true },
                        distinct: ["userId"],
                        take: 10,
                      })
                    : Promise.resolve([]),
                  !skipIp ? getIpIntelligence(ip) : Promise.resolve(null),
                  fingerprint
                    ? prisma.user.findMany({
                        where: { deviceFingerprint: fingerprint, id: { not: session.userId } },
                        select: { id: true, email: true },
                        take: 10,
                      })
                    : Promise.resolve([]),
                ]);

              if (fingerprint) {
                await prisma.user.update({
                  where: { id: session.userId },
                  data: { deviceFingerprint: fingerprint },
                });
              }

              // New IP / new device detection
              if (previousSessions.length > 0) {
                if (!skipIp) {
                  const knownIPs = new Set(previousSessions.map((s) => s.ipAddress).filter(Boolean));
                  if (!knownIPs.has(ip)) {
                    logFraudEvent(session.userId, "new_ip_login", {
                      newIp: ip,
                      previousIps: [...knownIPs].slice(0, 5),
                    });
                  }
                }
                if (agent) {
                  const knownAgents = new Set(previousSessions.map((s) => s.userAgent).filter(Boolean));
                  if (!knownAgents.has(agent)) {
                    logFraudEvent(session.userId, "new_device_login", {
                      newUserAgent: agent.slice(0, 200),
                    });
                  }
                }
              }

              // Shared IP (multi-account)
              if (sharedIpUsers.length > 0) {
                logFraudEvent(session.userId, "shared_ip_detected", {
                  ip,
                  otherUserIds: sharedIpUsers.map((u) => u.userId),
                  window: "7d",
                });
              }

              // IP intelligence
              if (intel) {
                if (intel.isVpn || intel.type === "Hosting") {
                  logFraudEvent(session.userId, intel.type === "Hosting" ? "datacenter_ip" : "vpn_detected", {
                    ip, type: intel.type, provider: intel.provider, country: intel.country, riskLevel: intel.riskLevel,
                  });
                } else if (intel.isProxy) {
                  logFraudEvent(session.userId, "vpn_detected", {
                    ip, type: intel.type, provider: intel.provider, country: intel.country, riskLevel: intel.riskLevel,
                  });
                }
              }

              // Multi-account fingerprint
              if (fingerprintMatches.length > 0) {
                logFraudEvent(session.userId, "multi_account_fingerprint", {
                  fingerprint: fingerprint!.slice(0, 32),
                  otherUserIds: fingerprintMatches.map((u) => u.id),
                  otherEmails: fingerprintMatches.map((u) => u.email),
                });
              }
            } catch (err) {
              console.error("[auth hook] post-login fraud detection error:", err);
            }
          })();
        },
      },
    },
  },
  plugins: [nextCookies()],
});
