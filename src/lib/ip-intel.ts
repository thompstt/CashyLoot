import "server-only";
import { prisma } from "./db";

// Cached IP intelligence via proxycheck.io free tier (1,000 lookups/day).
//
// The cache uses a 24-hour TTL — IP classifications (VPN, proxy, datacenter)
// change slowly, so re-checking daily is sufficient. With aggressive caching,
// even 1,000 unique users per day stays well under the free-tier limit because
// most users revisit from the same IP.
//
// The lookup is called from the session.create.after hook in auth.ts on every
// login. It is NOT called on every request — only on session creation events.
//
// Failure mode: if proxycheck.io is unreachable or returns an error, we return
// a safe default (all flags false, riskLevel "unknown"). Detection degrades
// gracefully — no login is blocked because of a proxycheck.io outage.

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface IpIntelResult {
  ip: string;
  isVpn: boolean;
  isProxy: boolean;
  type: string | null;
  provider: string | null;
  country: string | null;
  riskLevel: string;
}

/**
 * Look up IP intelligence with caching. Returns cached result if fresh,
 * otherwise calls proxycheck.io and caches the response.
 *
 * Safe to call on every login — the cache ensures at most 1 API call per
 * unique IP per 24 hours.
 */
export async function getIpIntelligence(ip: string): Promise<IpIntelResult> {
  // Skip for local/reserved IPs
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "unknown" || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return { ip, isVpn: false, isProxy: false, type: null, provider: null, country: null, riskLevel: "low" };
  }

  // Check cache
  const cached = await prisma.ipIntelCache.findUnique({ where: { ip } });
  if (cached && Date.now() - cached.checkedAt.getTime() < CACHE_TTL_MS) {
    return {
      ip: cached.ip,
      isVpn: cached.isVpn,
      isProxy: cached.isProxy,
      type: cached.type,
      provider: cached.provider,
      country: cached.country,
      riskLevel: cached.riskLevel,
    };
  }

  // Call proxycheck.io (free tier, no API key required)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `https://proxycheck.io/v2/${ip}?vpn=1&asn=1`,
      { signal: controller.signal },
    );
    clearTimeout(timeout);

    if (!res.ok) {
      console.error("[ip-intel] proxycheck.io error:", { status: res.status, ip });
      return fallback(ip);
    }

    const data = await res.json();
    const info = data[ip] || {};

    const isProxy = info.proxy === "yes";
    const isVpn = info.type === "VPN";
    const type: string | null = info.type || null;
    const provider: string | null = info.provider || null;
    const country: string | null = info.isocode || null;

    // Risk classification:
    //   high     — confirmed VPN, proxy, or hosting/datacenter IP
    //   medium   — proxycheck says proxy=yes but type is ambiguous
    //   low      — clean residential IP
    const riskLevel = isVpn || type === "Hosting"
      ? "high"
      : isProxy
        ? "medium"
        : "low";

    const result: IpIntelResult = { ip, isVpn, isProxy, type, provider, country, riskLevel };

    // Cache the result (upsert handles both first-time and refresh)
    await prisma.ipIntelCache.upsert({
      where: { ip },
      create: {
        ip,
        isVpn,
        isProxy,
        type,
        provider,
        country,
        riskLevel,
        checkedAt: new Date(),
      },
      update: {
        isVpn,
        isProxy,
        type,
        provider,
        country,
        riskLevel,
        checkedAt: new Date(),
      },
    });

    return result;
  } catch (err) {
    console.error("[ip-intel] proxycheck.io lookup failed:", err);
    return fallback(ip);
  }
}

function fallback(ip: string): IpIntelResult {
  return { ip, isVpn: false, isProxy: false, type: null, provider: null, country: null, riskLevel: "unknown" };
}
