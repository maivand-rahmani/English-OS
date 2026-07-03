import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Settings section identifier for the shell-level settings overlay.
 *
 * This is a **simplified** section list scoped to the shell overlay, not a
 * 1:1 mapping of `SettingsSectionId` from `@/widgets/settings-center`. The
 * two types may be reconciled in a future migration (T25).
 */
export type SettingsSection =
  | "appearance"
  | "profile"
  | "notifications"
  | "data"
  | "about";

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

type AppShellStore = {
  /** Whether the settings overlay is open. */
  settingsOpen: boolean;
  /** The active settings section (null = no section selected). */
  settingsSection: SettingsSection | null;
  /** Whether the activity panel is open. */
  activityOpen: boolean;

  /** Open the settings overlay, optionally jumping to a specific section. */
  openSettings: (section?: SettingsSection) => void;
  /** Close the settings overlay and clear the active section. */
  closeSettings: () => void;
  /** Switch the active settings section without toggling the overlay. */
  setSettingsSection: (section: SettingsSection | null) => void;

  /** Open the activity panel. */
  openActivity: () => void;
  /** Close the activity panel. */
  closeActivity: () => void;
  /** Toggle the activity panel open/closed. */
  toggleActivity: () => void;
};

/**
 * Ephemeral Zustand store for shell-level overlay state.
 *
 * Owns three toggles that were previously managed as local `useState` calls
 * in `app-shell.tsx`:
 *
 * - **Settings overlay** — open/closed + active section
 * - **Activity panel** — open/closed
 *
 * This store intentionally **excludes**:
 * - Persistence (overlays are ephemeral — they should never survive a refresh)
 * - Navigation state (handled by the router)
 * - Filters / feature-level state (owned by dedicated stores)
 *
 * @example
 * ```ts
 * import { useAppShellStore, selectSettingsOpen } from '../model/app-shell-store';
 *
 * const open = useAppShellStore(selectSettingsOpen);
 * const { openSettings } = useAppShellStore();
 * ```
 */
export const useAppShellStore = create<AppShellStore>()((set) => ({
  // ----------------------------------------------------------------------- //
  // Initial state                                                           //
  // ----------------------------------------------------------------------- //

  settingsOpen: false,
  settingsSection: null,
  activityOpen: false,

  // ----------------------------------------------------------------------- //
  // Actions                                                                 //
  // ----------------------------------------------------------------------- //

  openSettings: (section) =>
    set({
      settingsOpen: true,
      settingsSection: section ?? null,
    }),

  closeSettings: () =>
    set({ settingsOpen: false, settingsSection: null }),

  setSettingsSection: (section) =>
    set({ settingsSection: section }),

  openActivity: () => set({ activityOpen: true }),

  closeActivity: () => set({ activityOpen: false }),

  toggleActivity: () =>
    set((s) => ({ activityOpen: !s.activityOpen })),
}));

// ---------------------------------------------------------------------------
// Selectors (stable references — safe to pass to useAppShellStore())
// ---------------------------------------------------------------------------

export const selectSettingsOpen = (s: AppShellStore) => s.settingsOpen;
export const selectSettingsSection = (s: AppShellStore) => s.settingsSection;
export const selectActivityOpen = (s: AppShellStore) => s.activityOpen;
