import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { verifyTurnstileToken } from "@/lib/turnstile";

const handler = toNextJsHandler(auth);

export const GET = handler.GET;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Client-side defense-in-depth: require a Turnstile challenge on all three
  // abuse-prone entry points. Better Auth's built-in rate limiter (configured
  // in src/lib/auth.ts with database-backed storage) handles throttling on
  // the server side. Turnstile adds a bot barrier so limits are less
  // trivially exhausted by automation.
  if (
    path.endsWith("/sign-in/email") ||
    path.endsWith("/sign-up/email") ||
    path.endsWith("/send-verification-email")
  ) {
    const token = request.headers.get("x-turnstile-token");
    const result = await verifyTurnstileToken(token);
    if (!result.success) {
      return Response.json(
        { message: result.error || "Bot verification failed" },
        { status: 403 },
      );
    }
  }

  return handler.POST(request);
}
