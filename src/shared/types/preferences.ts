export type ThemeMode = "system" | "light" | "dark";

export type TextSize = "small" | "default" | "large";

export type InterfaceDensity = "comfortable" | "compact";

export type MotionIntensity = "full" | "reduced";

/**
 * Learner-controlled appearance settings.
 *
 * Persisted to localStorage because these are tiny preference values
 * that need to be available before React hydrates (applied via data-*
 * attributes on <html>).
 */
export type AppearancePreferences = {
  theme: ThemeMode;
  textSize: TextSize;
  density: InterfaceDensity;
  motion: MotionIntensity;
};

export const defaultAppearancePreferences: AppearancePreferences = {
  theme: "system",
  textSize: "default",
  density: "comfortable",
  motion: "full",
};
