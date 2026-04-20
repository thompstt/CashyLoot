import "server-only";
import { auth } from "./auth";
import { prisma } from "./db";
import { logFraudEvent } from "./fraud";

interface ActiveSessionResult {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  error?: never;
}

interface ActiveSessionError {
  session: null;
  error: "unauthenticated" | "banned" | "suspended";
}

export type GetActiveSessionResult = ActiveSessionResult | ActiveSessionError;

export async function getActiveSession(
  headers: Headers,
): Promise<GetActiveSessionResult> {
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return { session: null, error: "unauthenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  });

  const status = user?.status;
  if (!user || status === "banned" || status === "suspended") {
    logFraudEvent(session.user.id, `${status ?? "deleted"}_access_attempt`, {
      status: status ?? "deleted",
      sessionId: session.session.id,
    });
    return { session: null, error: (status as "banned" | "suspended") ?? "banned" };
  }

  return { session };
}
