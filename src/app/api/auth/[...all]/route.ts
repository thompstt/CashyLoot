import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { prisma } from "@/lib/db";

const handler = toNextJsHandler(auth);

// Simple database-backed rate limiting for verification email resend
// Returns true if the request should be allowed
async function checkResendRateLimit(email: string): Promise<boolean> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  // Count recent verification records for this email
  // Better Auth creates verification records when sending emails
  const recentCount = await prisma.verification.count({
    where: {
      identifier: email,
      createdAt: { gte: fifteenMinutesAgo },
    },
  });

  return recentCount < 3;
}

export const GET = handler.GET;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Verify Turnstile on sign-in and sign-up requests
  if (path.endsWith("/sign-in/email") || path.endsWith("/sign-up/email")) {
    const token = request.headers.get("x-turnstile-token");
    const result = await verifyTurnstileToken(token);
    if (!result.success) {
      return Response.json(
        { message: result.error || "Bot verification failed" },
        { status: 403 }
      );
    }
  }

  // Rate limit verification email resend
  if (path.endsWith("/send-verification-email")) {
    try {
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      if (body.email) {
        const allowed = await checkResendRateLimit(body.email);
        if (!allowed) {
          return Response.json(
            { message: "Too many verification emails. Please try again in 15 minutes." },
            { status: 429 }
          );
        }
      }
    } catch {
      // If we can't parse the body, let Better Auth handle the error
    }
  }

  return handler.POST(request);
}
