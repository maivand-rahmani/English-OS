import {
  type AppearancePreferences,
  defaultAppearancePreferences,
} from "@/shared/types";

const STORAGE_KEY = "english-os:appearance-preferences";

/**
 * Read appearance preferences from localStorage.
 *
 * Returns defaults if nothing has been saved yet.
 */
export function getAppearancePreferences(): AppearancePreferences {
  if (typeof window === "undefined") {
    return defaultAppearancePreferences;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAppearancePreferences;

    const parsed = JSON.parse(raw) as Partial<AppearancePreferences>;

    return {
      theme: parsed.theme ?? defaultAppearancePreferences.theme,
      textSize: parsed.textSize ?? defaultAppearancePreferences.textSize,
      density: parsed.density ?? defaultAppearancePreferences.density,
      motion: parsed.motion ?? defaultAppearancePreferences.motion,
    };
  } catch {
    return defaultAppearancePreferences;
  }
}

/**
 * Persist appearance preferences to localStorage.
 */
export function setAppearancePreferences(
  prefs: AppearancePreferences
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage may be full or unavailable — silently ignore
  }
}

/**
 * Reset appearance preferences to defaults, removing the stored value.
 */
export function resetAppearancePreferences(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}

/**
 * Map appearance preferences to the data-* attributes applied on <html>.
 *
 * Returns an object that can be spread onto the document element.
 */
export function preferencesToHtmlAttrs(
  prefs: AppearancePreferences
): Record<string, string> {
  return {
    "data-theme": prefs.theme,
    "data-text-size": prefs.textSize,
    "data-density": prefs.density,
    "data-motion": prefs.motion,
  };
}
