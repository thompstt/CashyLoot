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

// Additional IPs allowed only when AYET_TEST_IPS is set (dev/staging).
// Intended for ayeT's "Send Test Callback" dashboard tool, which sends from
// a different IP than production callback servers.
export function isAllowedAyetIp(ip: string): boolean {
  if (AYET_IP_WHITELIST.has(ip)) return true;
  const extra = env.AYET_TEST_IPS;
  if (!extra) return false;
  return extra
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(ip);
}

// ---------------------------------------------------------------------------
// HMAC-SHA256 Verification
// ---------------------------------------------------------------------------
// ayeT sends an HMAC in the `X-Ayetstudios-Security-Hash` header.
// Algorithm: sort all query params alphabetically, URL-encode into a query
// string, HMAC-SHA256 with the Publisher API Key.
// https://docs.ayetstudios.com/v/product-docs/callbacks-and-testing/callback-verification/hmac-security-hash-optional

// URL-form-encode a value per ayeT spec (spaces → "+", not "%20").
function formEncodeValue(v: string): string {
  return encodeURIComponent(v).replace(/%20/g, "+");
}

export function verifyAyetHmac(
  entries: Array<[string, string]>,
  headerHash: string,
): boolean {
  // Sort alphabetically by key (stable — ties preserve insertion order so
  // duplicate params like payout_usd=0&payout_usd=0 stay in original order).
  const sorted = [...entries].sort((a, b) => {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });

  // Keys are sent raw (ayeT keys are snake_case, no special chars); only
  // values are URL-form-encoded.
  const canonical = sorted.map(([k, v]) => `${k}=${formEncodeValue(v)}`).join("&");

  const computed = createHmac("sha256", env.AYET_API_KEY)
    .update(canonical)
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

// ayeT adslot currency is configured as 1 Point = our 1 point (100 Points = $1 USD,
// 0 decimals). currency_amount arrives as an integer point count; we credit 1:1.

/** No single survey callback should exceed this amount (absolute value). 5000 pts = $50. */
export const MAX_CURRENCY_AMOUNT = 5000;

/** Points credited per 1.0 unit of ayeT currency (1:1 since ayeT currency = our points). */
export const AYET_POINTS_PER_CURRENCY = 1;

/** Convert ayeT currency_amount to CashyLoot points. Preserves sign. */
export function convertToPoints(currencyAmount: number): number {
  return Math.round(currencyAmount * AYET_POINTS_PER_CURRENCY);
}
