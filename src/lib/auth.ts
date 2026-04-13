import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";
import { sendVerificationEmail } from "./ses";
import { getIpIntelligence } from "./ip-intel";

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
            await prisma.fraudEvent.create({
              data: {
                userId: session.userId,
                eventType: "banned_login_attempt",
                details: JSON.stringify({
                  status: user?.status ?? "deleted",
                }),
              },
            }).catch((err) => {
              console.error("[auth hook] failed to log banned login attempt:", err);
            });
            return false;
          }

          return { data: session };
        },

        // ── Post-login fraud signals ──
        //
        // Detection-only (no blocking). Logs FraudEvent rows for review.
        // All operations are wrapped in try/catch so detection failures
        // never break the login flow.
        //
        // Signals (Tier 2):
        //   1. new_ip_login        — IP not in user's session history
        //   2. new_device_login    — User-Agent not seen before
        //   3. shared_ip_detected  — another user from same IP (multi-account)
        //
        // Signals (Tier 3):
        //   4. vpn_detected        — proxycheck.io flags IP as VPN/proxy
        //   5. datacenter_ip       — IP belongs to a hosting provider
        //   6. multi_account_fingerprint — browser fingerprint matches another user
        after: async (session, ctx) => {
          if (!session) return;

          try {
            const ip = session.ipAddress;
            const agent = session.userAgent;
            const skipIp = !ip || ip === "127.0.0.1" || ip === "::1" || ip === "unknown";

            // Read the fingerprint header from the request context.
            // The client sends this as `x-fingerprint` on login/signup.
            // ctx is the auth context — may be null if getCurrentAuthContext()
            // failed (rare, defensive).
            const fingerprint = ctx?.headers?.get?.("x-fingerprint") || null;

            // ── Store fingerprint on user record ──
            // Updates user.deviceFingerprint to the latest visitorId.
            // This field was in the schema since Phase 0 but never populated.
            if (fingerprint) {
              await prisma.user.update({
                where: { id: session.userId },
                data: { deviceFingerprint: fingerprint },
              });
            }

            const previousSessions = await prisma.session.findMany({
              where: {
                userId: session.userId,
                id: { not: session.id },
              },
              select: { ipAddress: true, userAgent: true },
              orderBy: { createdAt: "desc" },
              take: 50,
            });

            if (previousSessions.length > 0) {
              // 1. New IP detection
              if (!skipIp) {
                const knownIPs = new Set(
                  previousSessions.map((s) => s.ipAddress).filter(Boolean),
                );
                if (!knownIPs.has(ip)) {
                  await prisma.fraudEvent.create({
                    data: {
                      userId: session.userId,
                      eventType: "new_ip_login",
                      details: JSON.stringify({
                        newIp: ip,
                        previousIps: [...knownIPs].slice(0, 5),
                      }),
                    },
                  });
                }
              }

              // 2. New device detection
              if (agent) {
                const knownAgents = new Set(
                  previousSessions.map((s) => s.userAgent).filter(Boolean),
                );
                if (!knownAgents.has(agent)) {
                  await prisma.fraudEvent.create({
                    data: {
                      userId: session.userId,
                      eventType: "new_device_login",
                      details: JSON.stringify({
                        newUserAgent: agent.slice(0, 200),
                      }),
                    },
                  });
                }
              }
            }

            // 3. Multi-account detection: shared IP
            if (!skipIp) {
              const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              const otherUsers = await prisma.session.findMany({
                where: {
                  ipAddress: ip,
                  userId: { not: session.userId },
                  createdAt: { gte: sevenDaysAgo },
                },
                select: { userId: true },
                distinct: ["userId"],
                take: 10,
              });

              if (otherUsers.length > 0) {
                await prisma.fraudEvent.create({
                  data: {
                    userId: session.userId,
                    eventType: "shared_ip_detected",
                    details: JSON.stringify({
                      ip,
                      otherUserIds: otherUsers.map((u) => u.userId),
                      window: "7d",
                    }),
                  },
                });
              }
            }

            // 4 + 5. IP intelligence: VPN / proxy / datacenter detection
            // Uses proxycheck.io free tier with 24h caching.
            if (!skipIp) {
              const intel = await getIpIntelligence(ip);

              if (intel.isVpn || (intel.type === "Hosting")) {
                await prisma.fraudEvent.create({
                  data: {
                    userId: session.userId,
                    eventType: intel.type === "Hosting" ? "datacenter_ip" : "vpn_detected",
                    details: JSON.stringify({
                      ip,
                      type: intel.type,
                      provider: intel.provider,
                      country: intel.country,
                      riskLevel: intel.riskLevel,
                    }),
                  },
                });
              } else if (intel.isProxy) {
                await prisma.fraudEvent.create({
                  data: {
                    userId: session.userId,
                    eventType: "vpn_detected",
                    details: JSON.stringify({
                      ip,
                      type: intel.type,
                      provider: intel.provider,
                      country: intel.country,
                      riskLevel: intel.riskLevel,
                    }),
                  },
                });
              }
            }

            // 6. Multi-account fingerprint detection
            // Check if any OTHER user has the same browser fingerprint.
            if (fingerprint) {
              const otherFingerprints = await prisma.user.findMany({
                where: {
                  deviceFingerprint: fingerprint,
                  id: { not: session.userId },
                },
                select: { id: true, email: true },
                take: 10,
              });

              if (otherFingerprints.length > 0) {
                await prisma.fraudEvent.create({
                  data: {
                    userId: session.userId,
                    eventType: "multi_account_fingerprint",
                    details: JSON.stringify({
                      fingerprint: fingerprint.slice(0, 32),
                      otherUserIds: otherFingerprints.map((u) => u.id),
                      otherEmails: otherFingerprints.map((u) => u.email),
                    }),
                  },
                });
              }
            }
          } catch (err) {
            console.error("[auth hook] post-login fraud detection error:", err);
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});
