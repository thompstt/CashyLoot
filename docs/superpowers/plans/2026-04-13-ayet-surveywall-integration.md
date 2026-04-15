# ayeT-Studios Surveywall Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate ayeT-Studios Surveywall as the first provider — a postback route that validates, deduplicates, and credits/debits user balances when ayeT calls back.

**Architecture:** A single GET route at `/api/postback/ayet` handles server-to-server callbacks. Security is IP whitelist + HMAC-SHA256. A helper module in `src/lib/ayet.ts` provides verification, conversion, and constants. No provider abstraction — direct implementation.

**Tech Stack:** Next.js 16 (App Router), Prisma 7, Zod, Node.js `crypto` (HMAC-SHA256)

**Spec:** `docs/superpowers/specs/2026-04-13-ayet-surveywall-integration-design.md`

**Testing:** No test framework is configured in this project. Verification is done via `curl` commands against the dev server and `npx tsc --noEmit` for type checking.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/env.ts` | Modify | Add `AYET_API_KEY` to Zod server schema |
| `.env.example` | Modify | Add `AYET_API_KEY` placeholder |
| `src/types/api.ts` | Modify | Add `"ayet"` to provider union types and offerwall URLs |
| `src/lib/ayet.ts` | Create | IP whitelist, HMAC verification, conversion rate, constants |
| `src/app/api/postback/ayet/route.ts` | Create | GET handler — full postback flow |

---

### Task 1: Update Env Config and Types

**Files:**
- Modify: `src/env.ts`
- Modify: `.env.example`
- Modify: `src/types/api.ts`

- [ ] **Step 1: Add `AYET_API_KEY` to `src/env.ts`**

Add the new field to the `serverSchema` object, after `SES_FROM_EMAIL`:

```typescript
AYET_API_KEY: z.string().min(1),
```

- [ ] **Step 2: Add placeholder to `.env.example`**

Add at the end of the file (or after the existing offerwall provider comments):

```bash
# ayeT-Studios Surveywall
# Publisher API Key from ayeT dashboard (Settings page) — used for HMAC-SHA256 callback verification
AYET_API_KEY=""
```

- [ ] **Step 3: Add your real key to local `.env`**

Copy your Publisher API Key from the ayeT-Studios dashboard into your local `.env` file:

```bash
AYET_API_KEY="your-real-key-here"
```

- [ ] **Step 4: Update `src/types/api.ts` — provider union**

In the `PostbackData` interface, change the `provider` field:

```typescript
// Before:
provider: "adgem" | "lootably" | "bitlabs";

// After:
provider: "adgem" | "lootably" | "bitlabs" | "ayet";
```

- [ ] **Step 5: Update `src/types/api.ts` — offerwall URLs**

In the `OfferwallUrlsResponse` interface, add the `ayet` field:

```typescript
// Before:
export interface OfferwallUrlsResponse {
  adgem: string | null;
  lootably: string | null;
  bitlabs: string | null;
}

// After:
export interface OfferwallUrlsResponse {
  adgem: string | null;
  lootably: string | null;
  bitlabs: string | null;
  ayet: string | null;
}
```

- [ ] **Step 6: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors (the new env var will fail at runtime without the `.env` value, but types compile).

- [ ] **Step 7: Commit**

```bash
git add src/env.ts .env.example src/types/api.ts
git commit -m "feat: add ayet provider to env config and API types"
```

---

### Task 2: Create `src/lib/ayet.ts` Helper Module

**Files:**
- Create: `src/lib/ayet.ts`

This module exports: `AYET_IP_WHITELIST`, `verifyAyetHmac`, `MAX_CURRENCY_AMOUNT`, `AYET_POINTS_PER_CURRENCY`, `convertToPoints`.

- [ ] **Step 1: Create `src/lib/ayet.ts`**

```typescript
import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/env";

// ---------------------------------------------------------------------------
// IP Whitelist
// ---------------------------------------------------------------------------
// ayeT-Studios callback server IPs. Last updated by ayeT: 2025-01-30.
// https://docs.ayetstudios.com/v/product-docs/callbacks-and-testing/callbacks/ip-whitelist
export const AYET_IP_WHITELIST = new Set([
  "51.79.101.241",
  "158.69.185.134",
  "158.69.185.154",
  "35.165.166.40",
  "35.166.159.131",
  "52.40.3.140",
]);

// ---------------------------------------------------------------------------
// HMAC-SHA256 Verification
// ---------------------------------------------------------------------------
// ayeT sends an HMAC in the `X-Ayetstudios-Security-Hash` header.
// Algorithm: sort all query params alphabetically, URL-encode into a query
// string, HMAC-SHA256 with the Publisher API Key.
// https://docs.ayetstudios.com/v/product-docs/callbacks-and-testing/callback-verification/hmac-security-hash-optional

export function verifyAyetHmac(
  params: Record<string, string>,
  headerHash: string,
): boolean {
  // Build the canonical string: sort keys alphabetically, URL-encode values
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");

  const computed = createHmac("sha256", env.AYET_API_KEY)
    .update(sorted)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(computed, "utf8"),
      Buffer.from(headerHash, "utf8"),
    );
  } catch {
    // timingSafeEqual throws if lengths differ — that means mismatch
    return false;
  }
}

// ---------------------------------------------------------------------------
// Currency Conversion
// ---------------------------------------------------------------------------

/** No single survey callback should exceed this amount (absolute value). */
export const MAX_CURRENCY_AMOUNT = 50;

/** Points credited per 1.0 unit of ayeT currency. */
export const AYET_POINTS_PER_CURRENCY = 100;

/** Convert ayeT currency_amount to CashyLoot points. Preserves sign. */
export function convertToPoints(currencyAmount: number): number {
  return Math.round(currencyAmount * AYET_POINTS_PER_CURRENCY);
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ayet.ts
git commit -m "feat: add ayet helper — IP whitelist, HMAC verification, points conversion"
```

---

### Task 3: Create the Postback Route

**Files:**
- Create: `src/app/api/postback/ayet/route.ts`

This is the main handler. It follows the flow from the spec (steps 1-10). Read through the full file before implementing — every section maps to a spec step.

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p src/app/api/postback/ayet
```

- [ ] **Step 2: Create `src/app/api/postback/ayet/route.ts`**

```typescript
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
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/postback/ayet/route.ts
git commit -m "feat: add ayet postback route — IP whitelist, HMAC, dedup, credit/chargeback"
```

---

### Task 4: Manual Integration Testing

**Files:** None (testing only)

Start the dev server and verify the route works with `curl`. You'll need to compute HMAC hashes to test the HMAC verification. These tests use the local dev server.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Make sure it starts without errors (the `AYET_API_KEY` env var must be set in `.env`).

- [ ] **Step 2: Test — rejected IP (non-whitelisted)**

The dev server runs locally, so requests come from `127.0.0.1` or `::1`, which are NOT in the whitelist. This means every local curl will be rejected by the IP check. To test the full flow, temporarily add `"127.0.0.1"` and `"::1"` to `AYET_IP_WHITELIST` in `src/lib/ayet.ts` during testing only.

After adding the test IPs:

```bash
curl -s "http://localhost:3000/api/postback/ayet?external_identifier=test&transaction_id=t1&currency_amount=1.5" | jq
```

Expected: `403` with `{"error":"Forbidden"}` — no HMAC header provided.

- [ ] **Step 3: Test — valid HMAC, user not found**

Generate the HMAC for your test params. In a Node.js REPL or one-liner:

```bash
node -e "
const crypto = require('crypto');
const key = process.env.AYET_API_KEY || 'test-key';
const params = 'currency_amount=1.5&external_identifier=nonexistent-user&is_chargeback=0&transaction_id=test-txn-1';
const hash = crypto.createHmac('sha256', key).update(params).digest('hex');
console.log(hash);
"
```

Then curl with the computed hash:

```bash
curl -s -H "X-Ayetstudios-Security-Hash: <hash-from-above>" \
  "http://localhost:3000/api/postback/ayet?currency_amount=1.5&external_identifier=nonexistent-user&is_chargeback=0&transaction_id=test-txn-1" | jq
```

Expected: `200` with `{"ok":true}` — user not found, but returns 200 to stop retries. Check server logs for the warning.

- [ ] **Step 4: Test — valid HMAC, real user, successful credit**

Use a real user ID from your dev database. Compute HMAC with the correct params:

```bash
node -e "
const crypto = require('crypto');
const key = process.env.AYET_API_KEY || 'test-key';
const params = 'currency_amount=5.0&external_identifier=<REAL_USER_ID>&is_chargeback=0&survey_id=12345&transaction_id=test-txn-2';
const hash = crypto.createHmac('sha256', key).update(params).digest('hex');
console.log(hash);
"
```

```bash
curl -s -H "X-Ayetstudios-Security-Hash: <hash-from-above>" \
  "http://localhost:3000/api/postback/ayet?currency_amount=5.0&external_identifier=<REAL_USER_ID>&is_chargeback=0&survey_id=12345&transaction_id=test-txn-2" | jq
```

Expected: `200` with `{"ok":true}`. Verify in the database:
- `postback_log` has a row with `request_id = 'test-txn-2'`, `verified = true`, `processed = true`
- `user` balance increased by 500 points (5.0 * 100)
- `transaction` has a row with `provider = 'ayet'`, `amount = 500`, `status = 'completed'`

- [ ] **Step 5: Test — duplicate postback (dedup)**

Repeat the exact same curl from Step 4 (same `transaction_id`):

Expected: `200` with `{"ok":true}`. User balance should NOT change (still the same as after Step 4). The unique constraint on `requestId` prevented double-crediting.

- [ ] **Step 6: Test — chargeback**

Compute HMAC for a chargeback:

```bash
node -e "
const crypto = require('crypto');
const key = process.env.AYET_API_KEY || 'test-key';
const params = 'chargeback_reason=fraud&currency_amount=-5.0&external_identifier=<REAL_USER_ID>&is_chargeback=1&transaction_id=r-test-txn-2';
const hash = crypto.createHmac('sha256', key).update(params).digest('hex');
console.log(hash);
"
```

```bash
curl -s -H "X-Ayetstudios-Security-Hash: <hash-from-above>" \
  "http://localhost:3000/api/postback/ayet?currency_amount=-5.0&external_identifier=<REAL_USER_ID>&is_chargeback=1&transaction_id=r-test-txn-2&chargeback_reason=fraud" | jq
```

Expected: `200`. User balance decreased by 500 points. Transaction row with `status = 'reversed'`, `amount = -500`.

- [ ] **Step 7: Test — amount bounds violation**

```bash
node -e "
const crypto = require('crypto');
const key = process.env.AYET_API_KEY || 'test-key';
const params = 'currency_amount=999&external_identifier=<REAL_USER_ID>&is_chargeback=0&transaction_id=test-txn-bounds';
const hash = crypto.createHmac('sha256', key).update(params).digest('hex');
console.log(hash);
"
```

```bash
curl -s -H "X-Ayetstudios-Security-Hash: <hash-from-above>" \
  "http://localhost:3000/api/postback/ayet?currency_amount=999&external_identifier=<REAL_USER_ID>&is_chargeback=0&transaction_id=test-txn-bounds" | jq
```

Expected: `200` (stops retries), but NO balance change. Check server logs for validation failure. Check `fraud_event` table for `suspicious_postback_amount` event.

- [ ] **Step 8: Remove test IPs and commit**

Remove `"127.0.0.1"` and `"::1"` from `AYET_IP_WHITELIST` in `src/lib/ayet.ts`. The whitelist should be back to only the 6 ayeT IPs.

```bash
npx tsc --noEmit
git add -A
git commit -m "test: verify ayet postback route — IP, HMAC, credit, dedup, chargeback, bounds"
```

Note: This commit should have zero code changes if you cleaned up the test IPs correctly. If you modified code during testing (bug fixes), include those changes and adjust the commit message.

---

### Task 5: Final Type Check and Clean-up

**Files:**
- Verify: all files from Tasks 1-4

- [ ] **Step 1: Full type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Lint check**

```bash
npm run lint
```

Fix any lint errors in the new files. Common ones: unused imports, missing semicolons (depends on project eslint config).

- [ ] **Step 3: Verify no leftover test artifacts**

Check that `AYET_IP_WHITELIST` in `src/lib/ayet.ts` contains exactly 6 IPs (no `127.0.0.1` or `::1`).

Check that no `console.log` debugging was left in (the `console.warn` and `console.error` calls in the route are intentional — those stay).

- [ ] **Step 4: Commit any lint/cleanup fixes**

```bash
git add -A
git commit -m "chore: lint and cleanup ayet integration"
```

Skip this commit if there were no changes.

---

## Summary

After all 5 tasks, the codebase will have:

| What | Where |
|------|-------|
| Env config for ayeT API key | `src/env.ts`, `.env.example` |
| `"ayet"` in provider types | `src/types/api.ts` |
| IP whitelist + HMAC + conversion helper | `src/lib/ayet.ts` |
| Postback route with full security + fraud detection | `src/app/api/postback/ayet/route.ts` |

**What remains after this plan (separate work):**
- Configure ayeT dashboard (callback URL, reversal callbacks, adslot)
- Person B: embed surveywall iframe on offers page
- Build `GET /api/user/offerwall-urls` endpoint (separate spec)
- Playbook integration for postback fraud signals
