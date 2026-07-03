import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type AppearancePreferences,
  type ThemeMode,
  defaultAppearancePreferences,
} from "@/shared/types";

/**
 * Resolve a `ThemeMode` to a concrete `'light' | 'dark'` value.
 *
 * `"system"` is resolved via `matchMedia` when called on the client; on the
 * server (or when `matchMedia` is unavailable) it defaults to `"light"`.
 */
function resolveAppliedTheme(theme: ThemeMode): "light" | "dark" {
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

/**
 * Noop storage for SSR environments where `localStorage` is unavailable.
 * Satisfies the `StateStorage` interface without throwing.
 */
const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  // Both are required by Storage but never called by createJSONStorage.
  get length() {
    return 0;
  },
  key: () => null,
  clear: () => {},
};

type AppearanceStore = {
  preferences: AppearancePreferences;
  updatePreferences: (partial: Partial<AppearancePreferences>) => void;
  resetPreferences: () => void;
};

export const useAppearanceStore = create<AppearanceStore>()(
  persist(
    (set) => ({
      preferences: { ...defaultAppearancePreferences },
      updatePreferences: (partial) =>
        set((state) => ({
          preferences: { ...state.preferences, ...partial },
        })),
      resetPreferences: () =>
        set({ preferences: { ...defaultAppearancePreferences } }),
    }),
    {
      // Must match the key used by the inline script in layout.tsx:44-77
      // so the flash-prevention script can read the persisted value.
      name: "english-os:appearance-preferences",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage,
      ),
      version: 1,
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);

/* ── Side effects: sync store → DOM ────────────────────── */

if (typeof window !== "undefined") {
  const applyToHtml = (prefs: AppearancePreferences) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolveAppliedTheme(prefs.theme));
    root.setAttribute("data-text-size", prefs.textSize);
    root.setAttribute("data-density", prefs.density);
    root.setAttribute("data-motion", prefs.motion);
  };

  applyToHtml(useAppearanceStore.getState().preferences);
  useAppearanceStore.subscribe((state) => applyToHtml(state.preferences));

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemThemeChange = () => {
    const prefs = useAppearanceStore.getState().preferences;
    if (prefs.theme === "system") applyToHtml(prefs);
  };
  mql.addEventListener("change", onSystemThemeChange);
}
