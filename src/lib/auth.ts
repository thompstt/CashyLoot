import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";
import { sendVerificationEmail } from "./ses";

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
        // ── Block banned/suspended users at sign-in ──
        //
        // Better Auth authenticates the password but doesn't know about our
        // custom `status` field. Without this hook, a banned user could
        // create a valid session — they'd be blocked at each endpoint by
        // `getActiveSession()`, but the session itself would exist.
        //
        // Returning `false` aborts the session insert (see
        // better-auth/dist/db/with-hooks.mjs:17) so the login flow fails
        // before a session token is ever issued.
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
        // These are detection-only (no blocking). Each check logs a
        // FraudEvent row for review. All DB operations are fire-and-forget
        // so a failure in detection never breaks the login flow.
        //
        // Signals detected:
        //   1. new_ip_login     — IP not seen in this user's session history
        //   2. new_device_login — User-Agent not seen before
        //   3. shared_ip_detected — another user logged in from same IP
        //                           within the last 7 days (multi-account)
        after: async (session) => {
          if (!session) return;

          try {
            const ip = session.ipAddress;
            const agent = session.userAgent;

            // Skip for local/unknown IPs — they're uninformative for fraud
            // detection and would cause false positives in dev (all test
            // users share 127.0.0.1).
            const skipIp = !ip || ip === "127.0.0.1" || ip === "::1" || ip === "unknown";

            // Fetch recent sessions for this user (excluding the one just created)
            const previousSessions = await prisma.session.findMany({
              where: {
                userId: session.userId,
                id: { not: session.id },
              },
              select: { ipAddress: true, userAgent: true },
              orderBy: { createdAt: "desc" },
              take: 50,
            });

            // Only run new-IP/device checks if the user has prior sessions
            // (first login is not "new" — it's just "first")
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
            // Check if any OTHER user has logged in from this IP in the last
            // 7 days. Skip for localhost / uninformative IPs.
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
          } catch (err) {
            // Never break the login flow for a detection failure
            console.error("[auth hook] post-login fraud detection error:", err);
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});
