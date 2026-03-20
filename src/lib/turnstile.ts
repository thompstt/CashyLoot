import "server-only";
import { env } from "@/env";

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstileToken(token: string | null): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return { success: false, error: "Missing Turnstile token" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data: TurnstileResponse = await response.json();

    if (!data.success) {
      return { success: false, error: "Bot verification failed" };
    }

    return { success: true };
  } catch (error) {
    // Fail open: if Cloudflare is unreachable, allow the request but log it
    console.error("[Turnstile] Verification failed, allowing request:", error);
    return { success: true };
  }
}
