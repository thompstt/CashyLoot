"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error" | "rate-limited">("idle");
  const [cooldown, setCooldown] = useState(0);

  async function handleResend() {
    if (cooldown > 0) return;

    setResendStatus("sending");

    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
      });

      if (error) {
        if (error.status === 429) {
          setResendStatus("rate-limited");
        } else {
          setResendStatus("error");
        }
        return;
      }

      setResendStatus("sent");
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendStatus("idle");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setResendStatus("error");
    }
  }

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-display tracking-tight">Check Your Email</CardTitle>
        <CardDescription>
          We sent a verification link to <strong className="text-foreground">{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click the link in the email to activate your account. If you don&apos;t see it, check your spam folder.
        </p>

        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resendStatus === "sending" || cooldown > 0}
            className="w-full"
          >
            {resendStatus === "sending"
              ? "Sending..."
              : resendStatus === "sent"
                ? `Resent! Wait ${cooldown}s`
                : cooldown > 0
                  ? `Wait ${cooldown}s`
                  : "Resend Verification Email"}
          </Button>

          {resendStatus === "error" && (
            <p className="text-sm text-destructive">Failed to resend. Please try again.</p>
          )}
          {resendStatus === "rate-limited" && (
            <p className="text-sm text-destructive">Too many requests. Please try again in 15 minutes.</p>
          )}
        </div>

        <p className="text-sm text-muted-foreground pt-2">
          <Link href="/login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
