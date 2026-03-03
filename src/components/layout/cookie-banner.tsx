"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-[rgba(8,8,15,0.95)] backdrop-blur-[16px] border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            <p>
              We use essential cookies to operate our website and optional cookies to improve your experience.{" "}
              <Link
                href="/cookies"
                className="text-primary hover:underline underline-offset-2"
              >
                Cookie Policy
              </Link>
              {" | "}
              <Link
                href="/privacy"
                className="text-primary hover:underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </p>
            <p className="mt-1 text-xs">
              California residents:{" "}
              <Link
                href="/privacy#do-not-sell"
                className="text-primary hover:underline underline-offset-2"
              >
                Do Not Sell or Share My Personal Information
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" size="sm" onClick={handleDecline}>
              Decline
            </Button>
            <Button className="btn-gradient" size="sm" onClick={handleAccept}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
