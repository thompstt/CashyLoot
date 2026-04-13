# ayeT-Studios Surveywall Integration Design

**Date:** 2026-04-13
**Author:** Person A (backend)
**Status:** Approved

## Overview

First provider integration for CashyLoot. ayeT-Studios Surveywall provides surveys that users complete for points. Integration is server-to-server postback based — ayeT calls our callback URL when a user completes (or reverses) a survey.

This is a direct, minimal implementation with no provider abstraction layer. Abstractions will be extracted when provider #2 is added.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| User identifier (`external_identifier`) | Raw CashyLoot user ID (cuid) | Simplest. Security gap analysis later. |
| Points conversion | Server-side (`convertToPoints()`) | Keeps control on our side; no dashboard reconfiguration needed to adjust rates. |
| Negative balance on chargeback | Allowed | User must earn their way back before withdrawing. Clean and honest. |
| Provider abstraction | None — direct implementation | YAGNI. Extract when provider #2 arrives. |
| Callback security | IP whitelist + HMAC-SHA256 | Belt and suspenders. HMAC is cheap insurance. |

## Files

| File | Action | Purpose |
|---|---|---|
| `src/lib/ayet.ts` | Create | HMAC verification, IP whitelist, points conversion |
| `src/app/api/postback/ayet/route.ts` | Create | GET handler — validate, dedup, credit/debit, log |
| `src/env.ts` | Update | Add `AYET_API_KEY` |
| `src/types/api.ts` | Update | Add `"ayet"` to provider union and offerwall URLs |

No Prisma schema changes. `PostbackLog.provider` and `Transaction.provider` are plain strings. `PostbackLog.requestId` already has a unique constraint for deduplication.

## Postback Route Flow

`GET /api/postback/ayet/route.ts`:

```
1. Extract caller IP
2. IP whitelist check (6 ayeT IPs) → 403 + FraudEvent if rejected
3. HMAC-SHA256 verify (X-Ayetstudios-Security-Hash header vs sorted params + AYET_API_KEY) → 403 + FraudEvent if invalid
4. Parse & validate query params via Zod:
   - external_identifier (string, required)
   - transaction_id (string, required)
   - currency_amount (number, required, abs value ≤ MAX_CURRENCY_AMOUNT)
   - is_chargeback (number, 0 or 1, default 0)
   - payout_usd (number, optional)
   - survey_id (string, optional)
   - offer_name (string, optional)
5. Rate limit check:
   - Per-user: `postback:ayet:user:${userId}` — 50/hour
   - Global: `postback:ayet:global` — 1000/hour
   - If exceeded → return 200 (don't trigger retries) + FraudEvent
6. Look up user by external_identifier (raw user ID)
   - If not found → return 200 (don't trigger ayeT retries), log warning
   - If user.status is "banned" or "suspended" → log PostbackLog for audit, skip credit, return 200
7. Convert currency_amount to points via convertToPoints()
8. Atomic $transaction:
   a. Create PostbackLog (requestId = transaction_id, rawPayload, provider: "ayet", verified: true, processed: true)
      - Unique constraint on requestId provides dedup — if violation, catch and return 200 (idempotent)
   b. Update user balance (increment — negative for chargebacks, allowing negative balances)
   c. Create Transaction (type: "earn", provider: "ayet", status: "completed" or "reversed")
9. Async velocity detection (fire-and-forget, same pattern as vault):
   - Count user's postback Transactions in last hour
   - If ≥ 20 → FraudEvent("high_velocity_postback")
   - If chargeback and newBalance < -10000 → FraudEvent("excessive_chargeback")
10. Return 200 (always — ayeT retries 12x over 1 hour on non-200)
```

### Key behaviors

- **Chargebacks**: `is_chargeback === 1`. `currency_amount` is already negative from ayeT. Transaction ID prefixed with `r-`. Stored as Transaction with `status: "reversed"`.
- **Dedup**: `PostbackLog.requestId` unique constraint inside the atomic transaction. On conflict, catch the error and return 200 immediately — nothing else in the transaction commits.
- **No auth session**: Server-to-server. IP + HMAC replaces user authentication.
- **Always 200**: Even on user-not-found or validation errors post-security-check. Stops retries. Errors logged internally.

## `src/lib/ayet.ts` Helper

Five exports:

### `AYET_IP_WHITELIST: Set<string>`

```
51.79.101.241
158.69.185.134
158.69.185.154
35.165.166.40
35.166.159.131
52.40.3.140
```

Last updated by ayeT: 2025-01-30. Should be checked periodically.

### `verifyAyetHmac(params: Record<string, string>, headerHash: string): boolean`

1. Strip the security hash param from params (if present)
2. Sort remaining params alphabetically by key
3. Build URL-encoded query string
4. Compute HMAC-SHA256 using `AYET_API_KEY` from env
5. Timing-safe comparison (`crypto.timingSafeEqual`) against header value

### `MAX_CURRENCY_AMOUNT = 50`

Upper bound for a single callback's `currency_amount` (absolute value). No single survey pays more than this. If exceeded, reject the callback and log `FraudEvent("suspicious_postback_amount")`. Applies to both credits and chargebacks.

### `AYET_POINTS_PER_CURRENCY = 100`

Conversion rate constant. Easy to make env-driven later.

### `convertToPoints(currencyAmount: number): number`

- Applies `AYET_POINTS_PER_CURRENCY` rate
- Returns `Math.round(currencyAmount * rate)`
- Preserves sign (negative for chargebacks)

## Type & Env Updates

### `src/types/api.ts`

- `PostbackData.provider`: add `"ayet"` to union
- `OfferwallUrlsResponse`: add `ayet: string | null`

### `src/env.ts`

- Add `AYET_API_KEY: z.string().min(1)` to `serverSchema`

## ayeT-Studios Configuration (Dashboard Side)

These must be configured in the ayeT publisher dashboard:

1. Create a **Website** placement with **Web Surveywall** adslot type
2. Set callback URL to: `https://<domain>/api/postback/ayet?transaction_id={transaction_id}&external_identifier={external_identifier}&currency_amount={currency_amount}&payout_usd={payout_usd}&is_chargeback={is_chargeback}&survey_id={survey_id}&offer_name={offer_name}&chargeback_reason={chargeback_reason}`
3. Enable "Reversal Callbacks" checkbox
4. Note the adslot ID for frontend iframe URL construction
5. Copy Publisher API Key for `AYET_API_KEY` env var

## Frontend Embed (Person B's Scope)

The surveywall is loaded via iframe:

```
https://surveys.ayet.io/surveys?adSlot={ADSLOT_ID}&external_identifier={USER_ID}
```

Person B will integrate this into the offers page, replacing mock data for the ayeT provider. The `GET /api/user/offerwall-urls` endpoint (not yet built) will serve this URL with the user's ID substituted.

## Security Gap Analysis (2026-04-13)

Gaps identified and addressed in this revision:

| Gap | Severity | Resolution |
|---|---|---|
| No user status check before crediting | HIGH | Added status check at step 6 — banned/suspended users get logged but not credited |
| No rate limiting on postback endpoint | MEDIUM | Added per-user (50/hr) and global (1000/hr) rate limits at step 5 |
| No postback velocity fraud detection | MEDIUM | Added async velocity check at step 9 — `high_velocity_postback` FraudEvent at ≥20/hr |
| No currency amount bounds checking | MEDIUM | Added `MAX_CURRENCY_AMOUNT = 50` validation in Zod schema |

Gaps noted for follow-up (not blocking this implementation):

| Gap | Severity | Notes |
|---|---|---|
| No chargeback accumulation auto-suspend | LOW | `excessive_chargeback` FraudEvent logged at -10000 points; auto-suspend deferred to Playbook integration |
| IP extraction reliability for S2S requests | LOW | `getClientIp()` reads `x-forwarded-for`; verify in testing that Amplify populates this correctly for direct server-to-server requests. Fall back to `x-real-ip` or socket address if needed. |
| CSP header for surveywall iframe | LOW | Person B will need `frame-src https://surveys.ayet.io` — pre-existing gap tracked in security audit |
| Raw user ID as external_identifier | LOW | Exposes cuid in iframe URL. Acceptable per decision; revisit if user enumeration becomes a concern. |

## What This Design Does NOT Cover

- Provider abstraction layer (deferred to provider #2)
- Offerwall URL endpoint (`GET /api/user/offerwall-urls`) — separate spec
- Offers page frontend changes (Person B)
- Pre-existing infra issues (public RDS, missing CSP — tracked in security audit)
