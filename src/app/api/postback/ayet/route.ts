import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logFraudEvent } from "@/lib/fraud";
import {
  MAX_CURRENCY_AMOUNT,
  convertToPoints,
  isAllowedAyetIp,
  verifyAyetHmac,
} from "@/lib/ayet";

// ---------------------------------------------------------------------------
// Zod schema for ayeT callback query params
// ---------------------------------------------------------------------------

// Surveywall API sends external_identifier; Static API placement sends uid.
// Either one is our publisher-side user ID.
const ayetCallbackSchema = z
  .object({
    external_identifier: z.string().min(1).optional(),
    uid: z.string().min(1).optional(),
    transaction_id: z.string().min(1),
    currency_amount: z.coerce
      .number()
      .refine((v) => Math.abs(v) <= MAX_CURRENCY_AMOUNT, {
        message: `currency_amount exceeds max of ${MAX_CURRENCY_AMOUNT}`,
      }),
    is_chargeback: z.coerce.number().int().min(0).max(1).default(0),
    payout_usd: z.coerce.number().optional(),
    survey_id: z.string().optional(),
    offer_id: z.string().optional(),
    offer_name: z.string().optional(),
    chargeback_reason: z.string().optional(),
  })
  .refine((d) => d.external_identifier || d.uid, {
    message: "Missing user identifier (expected external_identifier or uid)",
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

  // ── IP whitelist ────────────────────────────────────────────────────────
  if (!isAllowedAyetIp(ip)) {
    console.warn("[postback/ayet] IP rejected:", { ip });
    logFraudEvent(null, "postback_ip_rejected", { provider: "ayet", ip, endpoint: "/api/postback/ayet" });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Step 3: HMAC-SHA256 verification ────────────────────────────────────
  const securityHash = request.headers.get("x-ayetstudios-security-hash");
  // Preserve all entries (including duplicates like payout_usd=0&payout_usd=0)
  // for HMAC computation. The schema parse below uses the de-duplicated view.
  const entries: Array<[string, string]> = [];
  const rawParams: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    entries.push([key, value]);
    rawParams[key] = value;
  });

  if (!securityHash || !verifyAyetHmac(entries, securityHash)) {
    console.warn("[postback/ayet] HMAC failed:", { ip, hasHeader: !!securityHash, txn: rawParams.transaction_id });
    logFraudEvent(null, "postback_hmac_failed", { provider: "ayet", ip, hasHeader: !!securityHash });
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
      logFraudEvent(null, "suspicious_postback_amount", {
        provider: "ayet", ip, rawAmount: rawParams.currency_amount, max: MAX_CURRENCY_AMOUNT,
      });
    }

    console.warn(
      "[postback/ayet] validation failed:",
      parseResult.error.flatten(),
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const {
    external_identifier,
    uid,
    transaction_id: transactionId,
    currency_amount: currencyAmount,
    is_chargeback: isChargeback,
    survey_id: surveyId,
  } = parseResult.data;
  const userId = external_identifier ?? uid!;

  // ── Step 5: Rate limiting ───────────────────────────────────────────────
  const [userLimit, globalLimit] = await Promise.all([
    checkRateLimit(`postback:ayet:user:${userId}`, PER_USER_MAX, PER_USER_WINDOW_SEC),
    checkRateLimit("postback:ayet:global", GLOBAL_MAX, GLOBAL_WINDOW_SEC),
  ]);

  if (!userLimit.allowed || !globalLimit.allowed) {
    const limitType = !userLimit.allowed ? "per_user" : "global";
    logFraudEvent(userId, "postback_rate_limited", { provider: "ayet", limitType, transactionId });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // ── Step 6: User lookup + status check ──────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true, balance: true },
  });

  if (!user) {
    console.warn("[postback/ayet] user not found:", { userId, transactionId });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (user.status === "banned" || user.status === "suspended") {
    // Log the postback for audit trail but don't credit
    prisma.postbackLog
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
        logFraudEvent(userId, "high_velocity_postback", {
          provider: "ayet", count: hourlyCount, window: "1h", threshold: VELOCITY_THRESHOLD,
        });
      }
    })
    .catch(() => {});

  if (isReversal) {
    prisma.user
      .findUnique({ where: { id: userId }, select: { balance: true } })
      .then((u) => {
        if (u && u.balance < EXCESSIVE_CHARGEBACK_THRESHOLD) {
          logFraudEvent(userId, "excessive_chargeback", {
            provider: "ayet", balance: u.balance, threshold: EXCESSIVE_CHARGEBACK_THRESHOLD, transactionId,
          });
        }
      })
      .catch(() => {});
  }

  // ── Step 10: Always return 200 ──────────────────────────────────────────
  return NextResponse.json({ ok: true }, { status: 200 });
}
