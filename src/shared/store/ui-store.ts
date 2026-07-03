import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

/**
 * A single toast notification.
 *
 * @property id - Unique identifier (auto-generated via `addToast`).
 * @property type - Visual variant: info, error, or success.
 * @property message - The toast body text.
 * @property durationMs - Optional auto-dismiss duration in ms.
 */
export type Toast = {
  id: string;
  type: 'info' | 'error' | 'success';
  message: string;
  durationMs?: number;
};

/**
 * Input shape for `addToast` — same as `Toast` but without the auto-generated `id`.
 */
export type ToastInput = Omit<Toast, 'id'>;

/** @internal */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ---------------------------------------------------------------------------
// Slices
// ---------------------------------------------------------------------------

type ToastSlice = {
  toasts: Toast[];
  /** Append a toast. Returns the auto-generated id. */
  addToast: (input: ToastInput) => string;
  /** Remove a toast by id. */
  dismissToast: (id: string) => void;
  /** Remove all toasts. */
  clearToasts: () => void;
};

type NavigationSlice = {
  activeSection: 'dashboard' | 'roadmap' | 'resources' | 'practice' | null;
  setActiveSection: (s: NavigationSlice['activeSection']) => void;
};

type UIStore = ToastSlice & NavigationSlice;

/**
 * Shared Zustand store for ephemeral UI state that needs to be accessible
 * across the app shell:
 *
 * - **Toast slice** — a stack of transient notifications (info / error / success).
 * - **Navigation slice** — the currently active top-level section (used by the
 *   sidebar / nav bar to highlight the active link).
 *
 * This store is intentionally **small**. Non-ephemeral state (appearance prefs,
 * progress, drafts, filters) lives in dedicated feature-level stores.
 *
 * @example
 * ```ts
 * import { useUIStore, selectToasts } from '@/shared/store/ui-store';
 *
 * const toasts = useUIStore(selectToasts);
 * const addToast = useUIStore((s) => s.addToast);
 *
 * addToast({ type: 'success', message: 'Saved!' });
 * ```
 */
export const useUIStore = create<UIStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      // ------------------------------------------------------------------ //
      // ToastSlice                                                         //
      // ------------------------------------------------------------------ //

      toasts: [],

      addToast: (input) => {
        const id = generateId();
        set((s) => ({ toasts: [...s.toasts, { ...input, id }] }));
        return id;
      },

      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      clearToasts: () => set({ toasts: [] }),

      // ------------------------------------------------------------------ //
      // NavigationSlice                                                    //
      // ------------------------------------------------------------------ //

      activeSection: null,

      setActiveSection: (s) => set({ activeSection: s }),
    })),
    { name: 'UIStore', enabled: process.env.NODE_ENV === 'development' },
  ),
);

// ---------------------------------------------------------------------------
// Selectors (stable references — safe to pass to useUIStore())
// ---------------------------------------------------------------------------

export const selectToasts = (s: UIStore) => s.toasts;
export const selectActiveSection = (s: UIStore) => s.activeSection;
