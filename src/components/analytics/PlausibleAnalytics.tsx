"use client";

import { useEffect } from "react";

/** Lightweight Plausible loader — no-op when domain env is missing. */
export function PlausibleAnalytics() {
  useEffect(() => {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!domain || document.querySelector("script[data-holive-plausible]")) return;

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = domain;
    script.dataset.holivePlausible = "1";
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }, []);

  return null;
}
