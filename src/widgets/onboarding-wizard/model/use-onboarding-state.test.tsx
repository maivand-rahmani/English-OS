import { act, renderHook } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { createQueryClient } from "@/shared/api/queryClient";
import { useOnboardingState } from "./use-onboarding-state";

/**
 * Vitest 4 + jsdom in this repo currently ships a stubbed `localStorage`
 * without the standard `getItem`/`setItem`/`clear` methods. We provide a
 * minimal in-memory polyfill here so the hook's localStorage contract is
 * exercisable until the global test environment is repaired.
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
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  storage.clear();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    writable: true,
    value: storage,
  });
});

function createWrapper() {
  const queryClient = createQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useOnboardingState", () => {
  test("initial state is step 0 with canGoBack false and canGoNext false (no level)", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    expect(result.current.state.step).toBe(0);
    expect(result.current.canGoBack).toBe(false);
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.progress).toEqual({ current: 1, total: 5 });
  });

  test("setting level makes canGoNext true on step 0", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setLevel("A2"));
    expect(result.current.state.data.currentLevel).toBe("A2");
    expect(result.current.canGoNext).toBe(true);
  });

  test("GO_NEXT advances step, canGoBack becomes true", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setLevel("B1"));
    act(() => result.current.goNext());
    expect(result.current.state.step).toBe(1);
    expect(result.current.canGoBack).toBe(true);
  });

  test("GO_BACK on step 0 stays at 0", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.goBack());
    expect(result.current.state.step).toBe(0);
  });

  test("step 3 requires strongest, weakest, pain point, and at least one format", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setStrongestSkill("vocabulary"));
    act(() => result.current.goToStep(3));
    expect(result.current.canGoNext).toBe(false);
    act(() => result.current.setWeakestSkill("speaking"));
    expect(result.current.canGoNext).toBe(false);
    act(() => result.current.setPainPoint("NO_STRUCTURE"));
    expect(result.current.canGoNext).toBe(false);
    act(() => result.current.setPreferredFormats(["video"]));
    expect(result.current.canGoNext).toBe(true);
  });

  test("isLastStep is true at the summary screen (step 4)", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.goToStep(4));
    expect(result.current.isLastStep).toBe(true);
  });

  test("canSubmit is true on the summary when prior step data is valid", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setStrongestSkill("vocabulary"));
    act(() => result.current.setWeakestSkill("speaking"));
    act(() => result.current.setPainPoint("NO_STRUCTURE"));
    act(() => result.current.setPreferredFormats(["video"]));
    act(() => result.current.goToStep(4));
    expect(result.current.canSubmit).toBe(true);
  });

  test("canSubmit is false on the summary when prior step data is missing", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.goToStep(4));
    expect(result.current.canSubmit).toBe(false);
  });

  test("HYDRATE prefills existing data", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() =>
      result.current.hydrate({
        currentLevel: "C1",
        mainGoal: "SPEAK_MORE_CONFIDENTLY",
      }),
    );
    expect(result.current.state.data.currentLevel).toBe("C1");
    expect(result.current.state.data.mainGoal).toBe("SPEAK_MORE_CONFIDENTLY");
  });

  test("RESET returns to initial state", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setLevel("A2"));
    act(() => result.current.goNext());
    act(() => result.current.reset());
    expect(result.current.state.step).toBe(0);
    expect(result.current.state.data.currentLevel).toBeUndefined();
  });

  test("currentStep exposes the step definition", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    expect(result.current.currentStep.key).toBe("level");
    expect(result.current.currentStep.title).toBe("Where are you now?");
  });

  test("isSubmitting is wired to the complete mutation pending state", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  test("profileQuery, updateProfileMutation, and completeMutation are exposed", () => {
    const { result } = renderHook(() => useOnboardingState(), {
      wrapper: createWrapper(),
    });
    expect(result.current.profileQuery).toBeDefined();
    expect(result.current.updateProfileMutation).toBeDefined();
    expect(result.current.completeMutation).toBeDefined();
  });
});
