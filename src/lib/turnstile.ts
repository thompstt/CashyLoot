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
    // Fail CLOSED: if Cloudflare is unreachable, reject the request. Failing
    // open would let an attacker who can block outbound HTTPS (e.g., DNS
    // poisoning on the server side, or a compromised proxy) bypass bot
    // protection entirely. Rejecting is the safer default — a Cloudflare
    // outage is rare and short-lived; a bypass exploit is permanent damage.
    console.error("[Turnstile] Verification failed, rejecting request:", error);
    return { success: false, error: "Bot verification unavailable — please try again" };
  }
}
