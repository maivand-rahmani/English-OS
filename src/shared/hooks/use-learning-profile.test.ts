import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { useLearningProfile, type LearningProfileSnapshot } from "./use-learning-profile";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

/**
 * Vitest 4 + jsdom in this repo currently ships a stubbed `localStorage`
 * without the standard `getItem`/`setItem`/`clear` methods (see pre-existing
 * failures in `settings-center.test.tsx`). We provide a minimal in-memory
 * polyfill here so the hook's localStorage contract is exercisable until the
 * global test environment is repaired.
 */
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

const storage = new MemoryStorage();

beforeEach(() => {
  storage.clear();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    writable: true,
    value: storage,
  });
});

const CACHE_KEY = "english-os:learner-profile";

const sampleProfile: LearningProfileSnapshot = {
  id: "learner-1",
  userId: "user-1",
  guestId: null,
  displayName: "Mae",
  currentLevel: "B1",
  mainGoal: "fluency",
  studyMinutesPerDay: 20,
  strongestSkill: "reading",
  weakestSkill: "speaking",
  preferredFormats: ["articles", "podcasts"],
  mainPainPoint: "speaking anxiety",
  completedOnboardingAt: "2025-01-15T12:00:00.000Z",
  updatedAt: "2025-01-15T12:00:00.000Z",
};

describe("useLearningProfile", () => {
  test("starts with profile=null and ends the load cycle with isLoading=false", async () => {
    const { result } = renderHook(() => useLearningProfile());

    // SSR-safe defaults: no profile, no error
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeNull();

    // The hydration effect runs and clears the loading flag (no cached data,
    // so profile stays null)
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toBeNull();
  });

  test("hydrates from localStorage on mount when a cached snapshot exists", async () => {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(sampleProfile));

    const { result } = renderHook(() => useLearningProfile());

    // Wait for mount effect to run
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toEqual(sampleProfile);
  });

  test("updateLocal writes the new snapshot to localStorage and updates state", async () => {
    const { result } = renderHook(() => useLearningProfile());

    await act(async () => {
      await Promise.resolve();
    });

    const next: LearningProfileSnapshot = {
      ...sampleProfile,
      displayName: "Mae Updated",
      updatedAt: "2025-02-01T00:00:00.000Z",
    };

    act(() => {
      result.current.updateLocal(next);
    });

    expect(result.current.profile).toEqual(next);
    const stored = window.localStorage.getItem(CACHE_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored as string)).toEqual(next);
  });

  test("ignores corrupt localStorage payloads without throwing", async () => {
    window.localStorage.setItem(CACHE_KEY, "{not valid json");

    const { result } = renderHook(() => useLearningProfile());

    await act(async () => {
      await Promise.resolve();
    });

    // Effect catches the parse error and leaves profile null
    expect(result.current.isLoading).toBe(false);
    expect(result.current.profile).toBeNull();
  });
});
