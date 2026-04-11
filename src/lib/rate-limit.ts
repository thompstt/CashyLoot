import "server-only";
import { prisma } from "./db";

// Application-level rate limiter backed by the AppRateLimit Prisma model.
//
// This is deliberately separate from Better Auth's built-in rate limiter.
// Better Auth handles its own auth endpoints via its own `rate_limit` table
// and config (see src/lib/auth.ts). This helper handles everything else —
// business-logic limits that Better Auth doesn't know how to express.
//
// Design notes:
//
// 1. Fixed-window counter, not sliding window. Simple, correct under
//    concurrency via Postgres row locking, easy to reason about. The
//    trade-off is bursty behavior right after a window resets (a user can
//    hit `max` requests right before reset and `max` more right after,
//    effectively getting 2*max in a brief window). For the per-user /
//    per-endpoint limits we use this for, that's acceptable.
//
// 2. Atomic upsert via `INSERT ... ON CONFLICT`. A single SQL statement
//    per check means zero TOCTOU on the counter, no race conditions, no
//    retry logic needed. Concurrent requests to the same key serialize on
//    the row lock and see consistent state.
//
// 3. Fail CLOSED on DB errors. If Postgres is unreachable, `checkRateLimit`
//    throws, `assertRateLimit` re-throws, and the route handler sees the
//    exception and returns 500. This is safer than fail-open (which would
//    disable rate limiting during outages — an attacker who can induce DB
//    unreachability could bypass limits). In practice, if Postgres is
//    unreachable the whole app is broken anyway, so this isn't a new
//    failure mode.
//
// 4. Cleanup is a separate concern. Rows accumulate over time. The
//    `updated_at` index supports a future cron job / scheduled lambda to
//    delete rows older than some threshold (e.g., 24h). Not implemented
//    here — out of scope for the immediate rate-limit fix.

export interface RateLimitResult {
  /** Whether the request is allowed. */
  allowed: boolean;
  /** Remaining budget in the current window (clamped to >= 0). */
  remaining: number;
  /** Unix ms timestamp when the current window resets. */
  resetAt: Date;
}

export class RateLimitError extends Error {
  constructor(public readonly resetAt: Date) {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

/**
 * Check and atomically increment a rate limit counter.
 *
 * Returns `{ allowed: false }` if the request exceeds `max` in the current
 * window. Does NOT throw for rate-limited requests — throws only on DB
 * errors. Callers should check `result.allowed` and respond with 429 when
 * it's false.
 *
 * For the common case where you want to throw a typed error and handle it
 * at a single catch site, use `assertRateLimit` instead.
 *
 * @param key        Caller-chosen key, e.g. "vault-open:user:${userId}".
 *                   Keep format consistent per call site to avoid
 *                   accidental bucket splitting.
 * @param max        Maximum allowed requests in the window.
 * @param windowSec  Window length in seconds.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSec: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStartCutoff = now - windowSec * 1000;

  // Atomic upsert:
  //   - If no row exists for this key → INSERT with count=1
  //   - If a row exists AND its window_start is older than the cutoff
  //     (window expired) → UPDATE count=1, window_start=now
  //   - If a row exists AND its window is still active →
  //     UPDATE count=count+1
  //
  // Postgres executes the ON CONFLICT branch under a row-level lock, so
  // two concurrent increments serialize correctly. The CASE expressions
  // reference `app_rate_limit.*` (the EXCLUDED row from the pre-conflict
  // state) which Postgres holds consistent for the duration of the update.
  const rows = await prisma.$queryRaw<Array<{ count: number; window_start: bigint }>>`
    INSERT INTO app_rate_limit (key, count, window_start, updated_at)
    VALUES (${key}, 1, ${now}, ${now})
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN app_rate_limit.window_start < ${windowStartCutoff} THEN 1
        ELSE app_rate_limit.count + 1
      END,
      window_start = CASE
        WHEN app_rate_limit.window_start < ${windowStartCutoff} THEN ${now}
        ELSE app_rate_limit.window_start
      END,
      updated_at = ${now}
    RETURNING count, window_start
  `;

  const row = rows[0]!;
  const count = Number(row.count);
  const windowStart = Number(row.window_start);
  const resetAt = new Date(windowStart + windowSec * 1000);

  return {
    allowed: count <= max,
    remaining: Math.max(0, max - count),
    resetAt,
  };
}

/**
 * Check a rate limit and throw `RateLimitError` if exceeded.
 *
 * Intended for use at the top of route handlers:
 *
 *   try {
 *     await assertRateLimit(`vault-open:user:${userId}`, 20, 60);
 *   } catch (e) {
 *     if (e instanceof RateLimitError) {
 *       return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 *     }
 *     throw e;
 *   }
 *
 * Returns the result on success so callers can use `.remaining` for
 * X-RateLimit-Remaining response headers if desired.
 */
export async function assertRateLimit(
  key: string,
  max: number,
  windowSec: number,
): Promise<RateLimitResult> {
  const result = await checkRateLimit(key, max, windowSec);
  if (!result.allowed) {
    throw new RateLimitError(result.resetAt);
  }
  return result;
}

/**
 * Extract the client IP from request headers.
 *
 * Prefers the standard `x-forwarded-for` header (which Amplify's CloudFront
 * populates with the real client IP as the leftmost entry), falling back to
 * `x-real-ip` and finally a sentinel "unknown" value that at least groups
 * unresolvable traffic into one bucket instead of silently disabling the
 * limit.
 *
 * If you need stricter IP validation (e.g., reject private ranges), layer
 * it on top of this — this function is the raw extractor, not a validator.
 */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0];
    if (first) return first.trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
