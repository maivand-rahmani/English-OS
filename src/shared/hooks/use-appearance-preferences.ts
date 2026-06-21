"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAppearancePreferences,
  setAppearancePreferences,
  resetAppearancePreferences,
  preferencesToHtmlAttrs,
} from "@/shared/persistence";
import type { AppearancePreferences } from "@/shared/types";
import { defaultAppearancePreferences } from "@/shared/types";

/**
 * Reads and writes learner appearance preferences from localStorage,
 * and syncs them to data-* attributes on <html> for CSS-driven theming.
 */
export function useAppearancePreferences() {
  const [preferences, setPreferences] = useState<AppearancePreferences>(
    defaultAppearancePreferences
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const stored = getAppearancePreferences();
      setPreferences(stored);
      applyAttrs(stored);
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (preferences.theme !== "system" || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyAttrs(preferences);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [preferences]);

  const updatePreferences = useCallback(
    (partial: Partial<AppearancePreferences>) => {
      try {
        setPreferences((prev) => {
          const next = { ...prev, ...partial };
          setAppearancePreferences(next);
          applyAttrs(next);
          return next;
        });
        setError(null);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to save preference";
        setError(message);
      }
    },
    []
  );

  const resetPreferences = useCallback(() => {
    try {
      resetAppearancePreferences();
      setPreferences(defaultAppearancePreferences);
      applyAttrs(defaultAppearancePreferences);
      setError(null);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to reset preferences";
      setError(message);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoaded,
    error,
    clearError,
  } as const;
}

function applyAttrs(prefs: AppearancePreferences): void {
  if (typeof document === "undefined") return;

  const attrs = preferencesToHtmlAttrs(prefs);
  for (const [key, value] of Object.entries(attrs)) {
    document.documentElement.setAttribute(key, value);
  }
}
