import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { useOnboardingState } from "./use-onboarding-state";

describe("useOnboardingState", () => {
  test("initial state is step 0 with canGoBack false and canGoNext false (no level)", () => {
    const { result } = renderHook(() => useOnboardingState());
    expect(result.current.state.step).toBe(0);
    expect(result.current.canGoBack).toBe(false);
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.progress).toEqual({ current: 1, total: 5 });
  });

  test("setting level makes canGoNext true on step 0", () => {
    const { result } = renderHook(() => useOnboardingState());
    act(() => result.current.setLevel("A2"));
    expect(result.current.state.data.currentLevel).toBe("A2");
    expect(result.current.canGoNext).toBe(true);
  });

  test("GO_NEXT advances step, canGoBack becomes true", () => {
    const { result } = renderHook(() => useOnboardingState());
    act(() => result.current.setLevel("B1"));
    act(() => result.current.goNext());
    expect(result.current.state.step).toBe(1);
    expect(result.current.canGoBack).toBe(true);
  });

  test("GO_BACK on step 0 stays at 0", () => {
    const { result } = renderHook(() => useOnboardingState());
    act(() => result.current.goBack());
    expect(result.current.state.step).toBe(0);
  });

  test("step 3 requires strongest, weakest, pain point, and at least one format", () => {
    const { result } = renderHook(() => useOnboardingState());
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
    const { result } = renderHook(() => useOnboardingState());
    act(() => result.current.goToStep(4));
    expect(result.current.isLastStep).toBe(true);
  });

  test("canSubmit is true on the summary when prior step data is valid", () => {
    const { result } = renderHook(() => useOnboardingState());
    act(() => result.current.setStrongestSkill("vocabulary"));
    act(() => result.current.setWeakestSkill("speaking"));
    act(() => result.current.setPainPoint("NO_STRUCTURE"));
    act(() => result.current.setPreferredFormats(["video"]));
    act(() => result.current.goToStep(4));
    expect(result.current.canSubmit).toBe(true);
  });

  test("canSubmit is false on the summary when prior step data is missing", () => {
    const { result } = renderHook(() => useOnboardingState());
    act(() => result.current.goToStep(4));
    expect(result.current.canSubmit).toBe(false);
  });

  test("HYDRATE prefills existing data", () => {
    const { result } = renderHook(() => useOnboardingState());
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
    const { result } = renderHook(() => useOnboardingState());
    act(() => result.current.setLevel("A2"));
    act(() => result.current.goNext());
    act(() => result.current.reset());
    expect(result.current.state.step).toBe(0);
    expect(result.current.state.data.currentLevel).toBeUndefined();
  });

  test("currentStep exposes the step definition", () => {
    const { result } = renderHook(() => useOnboardingState());
    expect(result.current.currentStep.key).toBe("level");
    expect(result.current.currentStep.title).toBe("Where are you now?");
  });
});
