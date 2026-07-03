import { act } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

/**
 * Vitest 4 + jsdom in this repo currently ships a stubbed `localStorage`
 * without the standard `getItem`/`setItem`/`clear` methods. The polyfill
 * MUST be installed before the appearance store module is evaluated,
 * because `createJSONStorage` captures the storage object at store
 * creation time. We use `vi.hoisted` to run the install during the
 * hoisted setup phase — before any test file imports run.
 */

const { storage, STORAGE_KEY } = vi.hoisted(() => {
  class MemoryStorage implements Storage {
    private store = new Map<string, string>();

    get length(): number {
      return this.store.size;
    }

    clear(): void {
      this.store.clear();
    }

    getItem(key: string): string | null {
      return this.store.has(key) ? (this.store.get(key) as string) : null;
    }

    key(index: number): string | null {
      return Array.from(this.store.keys())[index] ?? null;
    }

    removeItem(key: string): void {
      this.store.delete(key);
    }

    setItem(key: string, value: string): void {
      this.store.set(key, value);
    }
  }

  const s = new MemoryStorage();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    writable: true,
    value: s,
  });
  return { storage: s, STORAGE_KEY: "english-os:appearance-preferences" };
});

import { useAppearanceStore } from "../appearance-store";
import { defaultAppearancePreferences } from "@/shared/types";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  storage.clear();
  act(() => {
    useAppearanceStore.setState({
      preferences: { ...defaultAppearancePreferences },
    });
  });
});

describe("useAppearanceStore", () => {
  test("starts with the default preferences (theme=system, textSize=default, density=comfortable, motion=full)", () => {
    const { preferences } = useAppearanceStore.getState();
    expect(preferences).toEqual(defaultAppearancePreferences);
  });

  test("updatePreferences merges the partial into the existing preferences", () => {
    act(() => {
      useAppearanceStore.getState().updatePreferences({ theme: "dark" });
    });
    let prefs = useAppearanceStore.getState().preferences;
    expect(prefs.theme).toBe("dark");
    // Other fields are preserved
    expect(prefs.textSize).toBe("default");
    expect(prefs.density).toBe("comfortable");
    expect(prefs.motion).toBe("full");

    act(() => {
      useAppearanceStore.getState().updatePreferences({ textSize: "large" });
    });
    prefs = useAppearanceStore.getState().preferences;
    expect(prefs.theme).toBe("dark");
    expect(prefs.textSize).toBe("large");
  });

  test("resetPreferences returns the store to the default values", () => {
    act(() => {
      useAppearanceStore.getState().updatePreferences({
        theme: "dark",
        textSize: "large",
        density: "compact",
        motion: "reduced",
      });
    });
    expect(useAppearanceStore.getState().preferences.theme).toBe("dark");

    act(() => {
      useAppearanceStore.getState().resetPreferences();
    });
    expect(useAppearanceStore.getState().preferences).toEqual(
      defaultAppearancePreferences,
    );
  });

  test("preferences are persisted to localStorage under the expected key", async () => {
    act(() => {
      useAppearanceStore.getState().updatePreferences({ theme: "dark" });
    });

    // Zustand's persist middleware writes asynchronously; wait a microtask.
    await act(async () => {
      await Promise.resolve();
    });

    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed.state.preferences.theme).toBe("dark");
  });
});
