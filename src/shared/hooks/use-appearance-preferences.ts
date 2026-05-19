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

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getAppearancePreferences();
    setPreferences(stored);
    applyAttrs(stored);
    setIsLoaded(true);
  }, []);

  const updatePreferences = useCallback(
    (partial: Partial<AppearancePreferences>) => {
      setPreferences((prev) => {
        const next = { ...prev, ...partial };
        setAppearancePreferences(next);
        applyAttrs(next);
        return next;
      });
    },
    []
  );

  const resetPreferences = useCallback(() => {
    resetAppearancePreferences();
    setPreferences(defaultAppearancePreferences);
    applyAttrs(defaultAppearancePreferences);
  }, []);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoaded,
  } as const;
}

function applyAttrs(prefs: AppearancePreferences): void {
  if (typeof document === "undefined") return;

  const attrs = preferencesToHtmlAttrs(prefs);
  for (const [key, value] of Object.entries(attrs)) {
    document.documentElement.setAttribute(key, value);
  }
}
