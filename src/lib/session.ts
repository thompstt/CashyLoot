import "server-only";
import { auth } from "./auth";
import { prisma } from "./db";

// Wraps Better Auth's getSession() with an additional user.status check.
//
// Better Auth authenticates the session cookie and returns the session + user
// data, but it doesn't know about our custom `status` field. A banned or
// suspended user's session token is still technically valid — Better Auth
// would happily return it. This helper catches that gap.
//
// Use this everywhere we currently call auth.api.getSession() in our own
// route handlers. Better Auth's internal routes (/sign-in, /sign-up, etc.)
// are NOT covered by this — a banned user can still "create a session" via
// the auth framework. But they can't DO anything useful with it because
// every business endpoint rejects them here.
//
// To block banned users at the login step itself, a Better Auth `before`
// hook on the sign-in route would be needed (Tier 2 fraud work).

interface ActiveSessionResult {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  error?: never;
}

interface ActiveSessionError {
  session: null;
  error: "unauthenticated" | "banned" | "suspended";
}

export type GetActiveSessionResult = ActiveSessionResult | ActiveSessionError;

/**
 * Get the authenticated session and verify the user's status is "active".
 *
 * Returns `{ session, error: undefined }` on success, or
 * `{ session: null, error }` with a reason string on failure.
 *
 * On banned/suspended, logs a FraudEvent (fire-and-forget) for audit.
 */
export async function getActiveSession(
  headers: Headers,
): Promise<GetActiveSessionResult> {
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return { session: null, error: "unauthenticated" };
  }

  // Better Auth's session response includes the user, but the `status` field
  // might not be in the type (it's our custom addition). Query the DB to be
  // certain we have the current status, not a stale session cache.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  });

  if (!user || user.status === "banned") {
    // Fire-and-forget audit log
    await prisma.fraudEvent.create({
      data: {
        userId: session.user.id,
        eventType: "banned_access_attempt",
        details: JSON.stringify({
          status: user?.status ?? "deleted",
          sessionId: session.session.id,
          timestamp: new Date().toISOString(),
        }),
      },
    }).catch((err) => {
      console.error("[session] failed to log banned access FraudEvent:", err);
    });

    return { session: null, error: "banned" };
  }

  if (user.status === "suspended") {
    await prisma.fraudEvent.create({
      data: {
        userId: session.user.id,
        eventType: "suspended_access_attempt",
        details: JSON.stringify({
          status: user.status,
          sessionId: session.session.id,
          timestamp: new Date().toISOString(),
        }),
      },
    }).catch((err) => {
      console.error("[session] failed to log suspended access FraudEvent:", err);
    });

    return { session: null, error: "suspended" };
  }

  return { session };
}
