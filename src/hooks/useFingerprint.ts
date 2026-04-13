"use client";

import { useEffect, useRef, useState } from "react";

// Lazy-loads FingerprintJS Open Source and returns a stable visitorId.
//
// The library is ~25KB gzipped and loaded dynamically (not in the main bundle)
// so it doesn't affect initial page load. The fingerprint is generated once
// on mount and cached in state for the lifetime of the component.
//
// Usage in auth pages:
//   const fingerprint = useFingerprint();
//   // Pass as header on login/signup:
//   headers: { "x-fingerprint": fingerprint ?? "" }

export function useFingerprint(): string | null {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        // Dynamic import keeps FingerprintJS out of the main bundle.
        // The library generates a fingerprint from ~30 browser signals
        // (canvas, WebGL, fonts, audio context, screen, timezone, etc.)
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const agent = await FingerprintJS.load();
        const result = await agent.get();
        setVisitorId(result.visitorId);
      } catch (err) {
        // Non-critical: if fingerprinting fails (e.g., blocked by a browser
        // extension), we just don't have this signal. Other fraud detection
        // layers (IP intel, rate limits, status checks) still function.
        console.warn("[fingerprint] Failed to generate visitor ID:", err);
      }
    })();
  }, []);

  return visitorId;
}
