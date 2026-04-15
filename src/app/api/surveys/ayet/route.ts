import { NextRequest, NextResponse } from "next/server";
import { getActiveSession } from "@/lib/session";
import { assertRateLimit, RateLimitError } from "@/lib/rate-limit";
import { buildSurveywallUrl } from "@/lib/ayet";
import type {
  AyetSurveyOffer,
  AyetSurveysApiResponse,
  AyetSurveywallResponse,
} from "@/types/ayet";

export async function GET(request: NextRequest) {
  const { session } = await getActiveSession(request.headers);
  if (!session) {
    return NextResponse.json<AyetSurveysApiResponse>(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await assertRateLimit(`surveys:ayet:user:${session.user.id}`, 30, 60);
  } catch (e) {
    if (e instanceof RateLimitError) {
      return NextResponse.json<AyetSurveysApiResponse>(
        { success: false, error: "Too many requests" },
        { status: 429 },
      );
    }
    throw e;
  }

  const upstreamUrl = buildSurveywallUrl(session.user.id);
  const userAgent = request.headers.get("user-agent") ?? "";
  const acceptLanguage =
    request.headers.get("accept-language") ?? "en-US,en;q=0.9";

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": userAgent,
        "Accept-Language": acceptLanguage,
      },
      cache: "no-store",
    });
  } catch (err) {
    console.error("[api/surveys/ayet] upstream fetch failed:", err);
    return NextResponse.json<AyetSurveysApiResponse>(
      { success: false, error: "Upstream unreachable" },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    console.warn(
      `[api/surveys/ayet] upstream ${upstream.status} for user ${session.user.id}`,
    );
    return NextResponse.json<AyetSurveysApiResponse>(
      { success: false, error: "Upstream error" },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as AyetSurveywallResponse;

  const surveys: AyetSurveyOffer[] = (data.surveys ?? []).map((s) => ({
    id: `ayet-${s.id}`,
    surveyId: s.id,
    title: `${s.category} Survey`,
    description: `~${s.loi} min · ${s.remaining_completes} spots left`,
    category: "surveys",
    provider: "ayeT",
    points: s.cpi,
    minutes: s.loi,
    isNew: s.is_new,
    startUrl: s.url,
    iconSlug: s.category.toLowerCase(),
  }));

  return NextResponse.json<AyetSurveysApiResponse>({
    success: true,
    surveys,
    profiler: data.profiler,
    surveywall: data.surveywall,
  });
}
