import "server-only";
import { prisma } from "./db";

export function logFraudEvent(
  userId: string | null,
  eventType: string,
  details: Record<string, unknown>,
) {
  prisma.fraudEvent
    .create({
      data: {
        ...(userId && { userId }),
        eventType,
        details: JSON.stringify(details),
      },
    })
    .catch((err) =>
      console.error(`[fraud] failed to log ${eventType}:`, err),
    );
}
