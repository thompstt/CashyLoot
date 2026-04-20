"use client";

import { useEffect, useRef, useState } from "react";

// Lazy-loads FingerprintJS (~25KB gzipped, dynamic import) and returns a stable visitorId.

export function useFingerprint(): string | null {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const agent = await FingerprintJS.load();
        const result = await agent.get();
        setVisitorId(result.visitorId);
      } catch (err) {
        console.warn("[fingerprint] Failed to generate visitor ID:", err);
      }
    })();
  }, []);

  return visitorId;
}
