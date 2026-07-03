import {
  type AppearancePreferences,
  type ThemeMode,
  defaultAppearancePreferences,
} from "@/shared/types";

// ── Shared parser ──────────────────────────────────────────

/**
 * Parse raw JSON from localStorage into validated `AppearancePreferences`.
 *
 * This is the **canonical** parser. Both the inline flash-prevention script
 * (`src/app/layout.tsx:49-76`) and the React-side store **must** produce the
 * same result for the same input.
 *
 * The inline script is a self-contained string literal that cannot import this
 * module, so its logic is duplicated by hand.  Keep them in sync.
 *
 * @param raw - The raw string from localStorage (may be `null`).
 * @returns Validated preferences, falling back to `defaultAppearancePreferences`
 *          when the value is missing or corrupt.
 */
export function parseAppearancePreferences(
  raw: string | null,
): AppearancePreferences {
  if (!raw) return { ...defaultAppearancePreferences };

  try {
    const parsed = JSON.parse(raw) as Partial<AppearancePreferences>;

    return {
      theme: parsed.theme ?? defaultAppearancePreferences.theme,
      textSize: parsed.textSize ?? defaultAppearancePreferences.textSize,
      density: parsed.density ?? defaultAppearancePreferences.density,
      motion: parsed.motion ?? defaultAppearancePreferences.motion,
    };
  } catch {
    return { ...defaultAppearancePreferences };
  }
}

// ── Resolvers ──────────────────────────────────────────────

/**
 * Resolve a `ThemeMode` to a concrete `'light' | 'dark'` value.
 *
 * `"system"` is resolved via `matchMedia` when called on the client; on the
 * server (or when `matchMedia` is unavailable) it defaults to `"light"`.
 */
export function resolveAppliedTheme(theme: ThemeMode): "light" | "dark" {
  if (theme === "light" || theme === "dark") {
    return theme;
  }

  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

// ── DOM attribute mapping ──────────────────────────────────

/**
 * Map appearance preferences to the `data-*` attributes applied on `<html>`.
 *
 * Returns an object that can be spread onto the document element.
 */
export function preferencesToHtmlAttrs(
  prefs: AppearancePreferences,
): Record<string, string> {
  return {
    "data-theme": resolveAppliedTheme(prefs.theme),
    "data-text-size": prefs.textSize,
    "data-density": prefs.density,
    "data-motion": prefs.motion,
  };
}
