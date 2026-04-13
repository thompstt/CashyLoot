import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  AYET_IP_WHITELIST,
  MAX_CURRENCY_AMOUNT,
  convertToPoints,
  verifyAyetHmac,
} from "@/lib/ayet";

// ---------------------------------------------------------------------------
// Zod schema for ayeT callback query params
// ---------------------------------------------------------------------------

const ayetCallbackSchema = z.object({
  external_identifier: z.string().min(1),
  transaction_id: z.string().min(1),
  currency_amount: z.coerce
    .number()
    .refine((v) => Math.abs(v) <= MAX_CURRENCY_AMOUNT, {
      message: `currency_amount exceeds max of ${MAX_CURRENCY_AMOUNT}`,
    }),
  is_chargeback: z.coerce.number().int().min(0).max(1).default(0),
  payout_usd: z.coerce.number().optional(),
  survey_id: z.string().optional(),
  offer_name: z.string().optional(),
  chargeback_reason: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Rate limit constants
// ---------------------------------------------------------------------------

const PER_USER_MAX = 50;
const PER_USER_WINDOW_SEC = 3600; // 1 hour
const GLOBAL_MAX = 1000;
const GLOBAL_WINDOW_SEC = 3600; // 1 hour

// ---------------------------------------------------------------------------
// Velocity detection thresholds
// ---------------------------------------------------------------------------

const VELOCITY_THRESHOLD = 20; // postbacks per hour per user
const EXCESSIVE_CHARGEBACK_THRESHOLD = -10_000; // points

// ---------------------------------------------------------------------------
// GET /api/postback/ayet
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);

  // ── Step 1-2: IP whitelist ──────────────────────────────────────────────
  if (!AYET_IP_WHITELIST.has(ip)) {
    prisma.fraudEvent
      .create({
        data: {
          eventType: "postback_ip_rejected",
          details: JSON.stringify({
            provider: "ayet",
            ip,
            endpoint: "/api/postback/ayet",
          }),
        },
      })
      .catch((err) =>
        console.error("[postback/ayet] failed to log IP rejection", err),
      );
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Step 3: HMAC-SHA256 verification ────────────────────────────────────
  const securityHash = request.headers.get("x-ayetstudios-security-hash");
  const rawParams: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    rawParams[key] = value;
  });

  if (!securityHash || !verifyAyetHmac(rawParams, securityHash)) {
    prisma.fraudEvent
      .create({
        data: {
          eventType: "postback_hmac_failed",
          details: JSON.stringify({
            provider: "ayet",
            ip,
            hasHeader: !!securityHash,
          }),
        },
      })
      .catch((err) =>
        console.error("[postback/ayet] failed to log HMAC failure", err),
      );
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Step 4: Parse & validate query params ───────────────────────────────
  const parseResult = ayetCallbackSchema.safeParse(rawParams);

  if (!parseResult.success) {
    // Validation failed after IP+HMAC passed — log but return 200 to stop
    // ayeT retries. This could be a schema mismatch or amount bounds breach.
    const isBoundsViolation = parseResult.error.issues.some((i) =>
      i.message.includes("currency_amount exceeds"),
    );

    if (isBoundsViolation) {
      prisma.fraudEvent
        .create({
          data: {
            eventType: "suspicious_postback_amount",
            details: JSON.stringify({
              provider: "ayet",
              ip,
              rawAmount: rawParams.currency_amount,
              max: MAX_CURRENCY_AMOUNT,
            }),
          },
        })
        .catch((err) =>
          console.error("[postback/ayet] failed to log amount violation", err),
        );
    }

    console.warn(
      "[postback/ayet] validation failed:",
      parseResult.error.flatten(),
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const {
    external_identifier: userId,
    transaction_id: transactionId,
    currency_amount: currencyAmount,
    is_chargeback: isChargeback,
    payout_usd: payoutUsd,
    survey_id: surveyId,
    offer_name: offerName,
    chargeback_reason: chargebackReason,
  } = parseResult.data;

  // ── Step 5: Rate limiting ───────────────────────────────────────────────
  const [userLimit, globalLimit] = await Promise.all([
    checkRateLimit(`postback:ayet:user:${userId}`, PER_USER_MAX, PER_USER_WINDOW_SEC),
    checkRateLimit("postback:ayet:global", GLOBAL_MAX, GLOBAL_WINDOW_SEC),
  ]);

  if (!userLimit.allowed || !globalLimit.allowed) {
    const limitType = !userLimit.allowed ? "per_user" : "global";
    prisma.fraudEvent
      .create({
        data: {
          userId,
          eventType: "postback_rate_limited",
          details: JSON.stringify({
            provider: "ayet",
            limitType,
            transactionId,
          }),
        },
      })
      .catch((err) =>
        console.error("[postback/ayet] failed to log rate limit event", err),
      );
    // Return 200 to stop ayeT retries — we're dropping this on purpose
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // ── Step 6: User lookup + status check ──────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true, balance: true },
  });

  if (!user) {
    console.warn(
      `[postback/ayet] user not found: ${userId}, txn: ${transactionId}`,
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (user.status === "banned" || user.status === "suspended") {
    // Log the postback for audit trail but don't credit
    await prisma.postbackLog
      .create({
        data: {
          rawPayload: JSON.stringify(rawParams),
          provider: "ayet",
          playerId: userId,
          requestId: transactionId,
          verified: true,
          processed: false, // Not processed — user is banned/suspended
          ipAddress: ip,
        },
      })
      .catch((err) =>
        console.error("[postback/ayet] failed to log banned user postback", err),
      );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // ── Step 7: Convert currency to points ──────────────────────────────────
  const points = convertToPoints(currencyAmount);
  const isReversal = isChargeback === 1;

  // ── Step 8: Atomic transaction — dedup + credit + log ───────────────────
  try {
    await prisma.$transaction(async (tx) => {
      // 8a. Create PostbackLog — unique constraint on requestId provides dedup.
      //     If this throws (duplicate), the entire transaction rolls back.
      await tx.postbackLog.create({
        data: {
          rawPayload: JSON.stringify(rawParams),
          provider: "ayet",
          playerId: userId,
          requestId: transactionId,
          verified: true,
          processed: true,
          ipAddress: ip,
        },
      });

      // 8b. Update user balance — increment (positive for earn, negative for
      //     chargeback since currencyAmount is already negative from ayeT).
      //     Negative balances are allowed per design decision.
      await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: points } },
      });

      // 8c. Create Transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: "earn",
          amount: points,
          provider: "ayet",
          campaignId: surveyId ?? null,
          status: isReversal ? "reversed" : "completed",
        },
      });
    });
  } catch (err) {
    // Check if this is a unique constraint violation (duplicate requestId)
    if (
      err instanceof Error &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      // Idempotent — this postback was already processed
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    // Unexpected DB error — log and return 500 so ayeT retries later
    console.error("[postback/ayet] transaction failed:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }

  // ── Step 9: Async velocity detection (fire-and-forget) ─────────────────
  // Count this user's postback transactions in the last hour. If above
  // threshold, log a fraud signal. Same pattern as vault velocity detection.
  prisma.transaction
    .count({
      where: {
        userId,
        provider: "ayet",
        createdAt: { gte: new Date(Date.now() - 3_600_000) },
      },
    })
    .then((hourlyCount) => {
      if (hourlyCount >= VELOCITY_THRESHOLD) {
        prisma.fraudEvent
          .create({
            data: {
              userId,
              eventType: "high_velocity_postback",
              details: JSON.stringify({
                provider: "ayet",
                count: hourlyCount,
                window: "1h",
                threshold: VELOCITY_THRESHOLD,
              }),
            },
          })
          .catch(() => {});
      }
    })
    .catch(() => {});

  // Check for excessive chargebacks
  if (isReversal) {
    prisma.user
      .findUnique({ where: { id: userId }, select: { balance: true } })
      .then((u) => {
        if (u && u.balance < EXCESSIVE_CHARGEBACK_THRESHOLD) {
          prisma.fraudEvent
            .create({
              data: {
                userId,
                eventType: "excessive_chargeback",
                details: JSON.stringify({
                  provider: "ayet",
                  balance: u.balance,
                  threshold: EXCESSIVE_CHARGEBACK_THRESHOLD,
                  transactionId,
                }),
              },
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }

  // ── Step 10: Always return 200 ──────────────────────────────────────────
  return NextResponse.json({ ok: true }, { status: 200 });
}
