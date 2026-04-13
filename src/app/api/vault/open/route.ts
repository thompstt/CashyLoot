import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rollPrize, getVaultConfig, VALID_TIERS } from "@/lib/vault";
import { assertRateLimit, RateLimitError } from "@/lib/rate-limit";
import { getActiveSession } from "@/lib/session";
import type { VaultOpenResponse, VaultTier } from "@/types/api";

const vaultOpenSchema = z.object({
  tier: z.enum(["bronze", "silver", "gold"]),
});

// Per-user rate limit for vault opens. 20 per minute is generous for any
// legitimate human interaction (the UI has an animation between opens so
// even a spammer clicking as fast as possible wouldn't hit this naturally)
// and tight enough to stop automation. The goal isn't to block abusive use
// of a user's own balance — the TOCTOU fix already prevents the race — but
// to cap the DB write rate from any single session.
const VAULT_RATE_LIMIT_MAX = 20;
const VAULT_RATE_LIMIT_WINDOW_SEC = 60;

export async function POST(request: NextRequest) {
  const { session, error } = await getActiveSession(request.headers);

  if (!session) {
    const status = error === "unauthenticated" ? 401 : 403;
    const message =
      error === "banned" ? "Account suspended" :
      error === "suspended" ? "Account temporarily suspended" :
      "Unauthorized";
    return NextResponse.json(
      { success: false, prize: 0, cost: 0, newBalance: 0, error: message } satisfies VaultOpenResponse,
      { status },
    );
  }

  // Rate limit per authenticated user. Run BEFORE parsing the body so a
  // spammer can't DoS by sending valid JSON at high rate — we reject them
  // at the rate-limit check with zero extra work.
  try {
    await assertRateLimit(
      `vault-open:user:${session.user.id}`,
      VAULT_RATE_LIMIT_MAX,
      VAULT_RATE_LIMIT_WINDOW_SEC,
    );
  } catch (e) {
    if (e instanceof RateLimitError) {
      // Log to FraudEvent so abuse shows up in audit queries. The insert is
      // fire-and-forget — if it fails we still want to return the 429 to
      // the client, not crash the request.
      await prisma.fraudEvent.create({
        data: {
          userId: session.user.id,
          eventType: "rate_limit",
          details: JSON.stringify({
            endpoint: "/api/vault/open",
            max: VAULT_RATE_LIMIT_MAX,
            windowSec: VAULT_RATE_LIMIT_WINDOW_SEC,
            resetAt: e.resetAt.toISOString(),
          }),
        },
      }).catch((err) => {
        console.error("[vault-open] failed to log rate limit event", err);
      });

      const retryAfterSec = Math.max(
        1,
        Math.ceil((e.resetAt.getTime() - Date.now()) / 1000),
      );
      return NextResponse.json(
        {
          success: false,
          prize: 0,
          cost: 0,
          newBalance: 0,
          error: "Too many requests — please slow down",
        } satisfies VaultOpenResponse,
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        },
      );
    }
    throw e;
  }

  const parseResult = vaultOpenSchema.safeParse(await request.json().catch(() => null));

  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, prize: 0, cost: 0, newBalance: 0, error: "Invalid request body" } satisfies VaultOpenResponse,
      { status: 400 },
    );
  }

  const { tier } = parseResult.data;
  const config = getVaultConfig(tier);
  const prize = rollPrize(tier);
  const netChange = prize - config.cost;

  // Atomic debit: `updateMany` with `balance: { gte: cost }` compiles to a
  // single UPDATE ... WHERE ... statement. Under Postgres READ COMMITTED,
  // concurrent updates acquire a row-level lock and re-evaluate the WHERE
  // predicate after the lock is acquired, so two requests reading the same
  // starting balance cannot both debit it. The check and the write are one
  // operation — no TOCTOU window.
  //
  // The vault_opening + transaction records must be created only when the
  // debit succeeded, and atomically with it. We wrap everything in an
  // interactive $transaction so if any step fails the debit rolls back.
  const result = await prisma.$transaction(async (tx) => {
    const debit = await tx.user.updateMany({
      where: { id: session.user.id, balance: { gte: config.cost } },
      data: { balance: { increment: netChange } },
    });

    if (debit.count === 0) {
      return { ok: false as const };
    }

    await tx.vaultOpening.create({
      data: {
        userId: session.user.id,
        tier,
        cost: config.cost,
        prize,
      },
    });

    await tx.transaction.create({
      data: {
        userId: session.user.id,
        type: "vault",
        amount: netChange,
        status: "completed",
      },
    });

    const updated = await tx.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { balance: true },
    });

    return { ok: true as const, newBalance: updated.balance };
  });

  if (!result.ok) {
    const current = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    });
    return NextResponse.json(
      {
        success: false,
        prize: 0,
        cost: config.cost,
        newBalance: current?.balance ?? 0,
        error: "Insufficient balance",
      } satisfies VaultOpenResponse,
      { status: 400 },
    );
  }

  // ── Hourly velocity detection (non-blocking, runs after success) ──
  // If the user has opened >100 vaults in the past hour, log a FraudEvent.
  // This doesn't block the request — the per-minute rate limit already caps
  // automation. This catches sustained high-frequency abuse that stays under
  // the per-minute limit (e.g., 19 opens every minute for an hour = 1140).
  // Fire-and-forget: don't delay the response for detection logic.
  prisma.vaultOpening.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: new Date(Date.now() - 3600_000) },
    },
  }).then((hourlyCount) => {
    if (hourlyCount >= 100) {
      prisma.fraudEvent.create({
        data: {
          userId: session.user.id,
          eventType: "high_velocity_vault",
          details: JSON.stringify({
            count: hourlyCount,
            window: "1h",
            threshold: 100,
          }),
        },
      }).catch(() => {});
    }
  }).catch(() => {});

  return NextResponse.json({
    success: true,
    prize,
    cost: config.cost,
    newBalance: result.newBalance,
  } satisfies VaultOpenResponse);
}
