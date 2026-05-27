"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
      const handleChange = () => onStoreChange();
      const observer = new MutationObserver(handleChange);

      mediaQuery.addEventListener("change", handleChange);
      observer.observe(document.documentElement, {
        attributeFilter: ["data-motion"],
        attributes: true,
      });

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
        observer.disconnect();
      };
    },
    () =>
      window.matchMedia(REDUCED_MOTION_QUERY).matches ||
      document.documentElement.getAttribute("data-motion") === "reduced",
    () => false,
  );
}
