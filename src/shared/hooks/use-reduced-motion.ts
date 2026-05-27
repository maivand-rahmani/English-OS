"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dataMotion = document.documentElement.getAttribute("data-motion");

    setReduced(mediaQuery.matches || dataMotion === "reduced");

    const handler = (e: MediaQueryListEvent) =>
      setReduced(e.matches || dataMotion === "reduced");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reduced;
}
