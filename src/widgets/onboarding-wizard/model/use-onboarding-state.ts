"use client";

import { useCallback, useMemo, useReducer } from "react";

import {
  ONBOARDING_STEPS,
  type OnboardingFormData,
  type OnboardingStep,
} from "@/shared/constants/onboarding";

type OnboardingFormDraft = Partial<OnboardingFormData>;

type OnboardingState = {
  step: number;
  data: OnboardingFormDraft;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
};

type Action =
  | { type: "SET_LEVEL"; payload: OnboardingFormData["currentLevel"] }
  | { type: "SET_GOAL"; payload: OnboardingFormData["mainGoal"] }
  | { type: "SET_RHYTHM"; payload: number }
  | { type: "SET_STRONGEST_SKILL"; payload: OnboardingFormData["strongestSkill"] }
  | { type: "SET_WEAKEST_SKILL"; payload: OnboardingFormData["weakestSkill"] }
  | { type: "SET_PREFERRED_FORMATS"; payload: OnboardingFormData["preferredFormats"] }
  | { type: "SET_PAIN_POINT"; payload: OnboardingFormData["mainPainPoint"] }
  | { type: "SET_DISPLAY_NAME"; payload: string }
  | { type: "GO_NEXT" }
  | { type: "GO_BACK" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; payload: string }
  | { type: "SET_FIELD_ERRORS"; payload: Record<string, string> }
  | { type: "RESET" }
  | { type: "HYDRATE"; payload: OnboardingFormDraft };

const INITIAL_STATE: OnboardingState = {
  step: 0,
  data: {},
  isSubmitting: false,
  error: null,
  fieldErrors: {},
};

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "SET_LEVEL":
      return {
        ...state,
        data: { ...state.data, currentLevel: action.payload },
        fieldErrors: { ...state.fieldErrors, currentLevel: "" },
      };
    case "SET_GOAL":
      return {
        ...state,
        data: { ...state.data, mainGoal: action.payload },
        fieldErrors: { ...state.fieldErrors, mainGoal: "" },
      };
    case "SET_RHYTHM":
      return {
        ...state,
        data: { ...state.data, studyMinutesPerDay: action.payload },
        fieldErrors: { ...state.fieldErrors, studyMinutesPerDay: "" },
      };
    case "SET_STRONGEST_SKILL":
      return { ...state, data: { ...state.data, strongestSkill: action.payload } };
    case "SET_WEAKEST_SKILL":
      return { ...state, data: { ...state.data, weakestSkill: action.payload } };
    case "SET_PREFERRED_FORMATS":
      return { ...state, data: { ...state.data, preferredFormats: action.payload } };
    case "SET_PAIN_POINT":
      return { ...state, data: { ...state.data, mainPainPoint: action.payload } };
    case "SET_DISPLAY_NAME":
      return { ...state, data: { ...state.data, displayName: action.payload } };
    case "GO_NEXT":
      return { ...state, step: Math.min(state.step + 1, ONBOARDING_STEPS.length - 1) };
    case "GO_BACK":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "GO_TO_STEP":
      return {
        ...state,
        step: Math.max(0, Math.min(action.payload, ONBOARDING_STEPS.length - 1)),
      };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, error: null, fieldErrors: {} };
    case "SUBMIT_SUCCESS":
      return { ...INITIAL_STATE };
    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, error: action.payload };
    case "SET_FIELD_ERRORS":
      return { ...state, isSubmitting: false, fieldErrors: action.payload };
    case "RESET":
      return { ...INITIAL_STATE };
    case "HYDRATE":
      return { ...state, data: { ...state.data, ...action.payload } };
    default:
      return state;
  }
}

function isStepValid(step: number, data: OnboardingFormDraft): boolean {
  switch (step) {
    case 0:
      return Boolean(data.currentLevel);
    case 1:
      return Boolean(data.mainGoal);
    case 2:
      return typeof data.studyMinutesPerDay === "number" && data.studyMinutesPerDay > 0;
    case 3:
      return (
        Boolean(data.strongestSkill) &&
        Boolean(data.weakestSkill) &&
        Boolean(data.mainPainPoint) &&
        Array.isArray(data.preferredFormats) &&
        data.preferredFormats.length > 0
      );
    case 4:
      return true;
    default:
      return false;
  }
}

export function useOnboardingState(initialData?: OnboardingFormDraft) {
  const [state, dispatch] = useReducer(
    reducer,
    initialData ? { ...INITIAL_STATE, data: initialData } : INITIAL_STATE,
  );

  const canGoBack = state.step > 0;
  const canGoNext =
    isStepValid(state.step, state.data) && state.step < ONBOARDING_STEPS.length - 1;
  const isLastStep = state.step === ONBOARDING_STEPS.length - 1;
  const progress = useMemo(
    () => ({ current: state.step + 1, total: ONBOARDING_STEPS.length }),
    [state.step],
  );
  const currentStep: OnboardingStep = useMemo(
    () => ONBOARDING_STEPS[state.step],
    [state.step],
  );

  const setLevel = useCallback(
    (level: OnboardingFormData["currentLevel"]) =>
      dispatch({ type: "SET_LEVEL", payload: level }),
    [],
  );
  const setGoal = useCallback(
    (goal: OnboardingFormData["mainGoal"]) =>
      dispatch({ type: "SET_GOAL", payload: goal }),
    [],
  );
  const setRhythm = useCallback(
    (minutes: number) => dispatch({ type: "SET_RHYTHM", payload: minutes }),
    [],
  );
  const setStrongestSkill = useCallback(
    (skill: OnboardingFormData["strongestSkill"]) =>
      dispatch({ type: "SET_STRONGEST_SKILL", payload: skill }),
    [],
  );
  const setWeakestSkill = useCallback(
    (skill: OnboardingFormData["weakestSkill"]) =>
      dispatch({ type: "SET_WEAKEST_SKILL", payload: skill }),
    [],
  );
  const setPreferredFormats = useCallback(
    (formats: OnboardingFormData["preferredFormats"]) =>
      dispatch({ type: "SET_PREFERRED_FORMATS", payload: formats }),
    [],
  );
  const setPainPoint = useCallback(
    (pain: OnboardingFormData["mainPainPoint"]) =>
      dispatch({ type: "SET_PAIN_POINT", payload: pain }),
    [],
  );
  const goNext = useCallback(() => dispatch({ type: "GO_NEXT" }), []);
  const goBack = useCallback(() => dispatch({ type: "GO_BACK" }), []);
  const goToStep = useCallback(
    (step: number) => dispatch({ type: "GO_TO_STEP", payload: step }),
    [],
  );
  const submitStart = useCallback(() => dispatch({ type: "SUBMIT_START" }), []);
  const submitSuccess = useCallback(() => dispatch({ type: "SUBMIT_SUCCESS" }), []);
  const submitError = useCallback(
    (msg: string) => dispatch({ type: "SUBMIT_ERROR", payload: msg }),
    [],
  );
  const setFieldErrors = useCallback(
    (errs: Record<string, string>) => dispatch({ type: "SET_FIELD_ERRORS", payload: errs }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const hydrate = useCallback(
    (data: OnboardingFormDraft) => dispatch({ type: "HYDRATE", payload: data }),
    [],
  );

  return {
    state,
    dispatch,
    canGoBack,
    canGoNext,
    isLastStep,
    progress,
    currentStep,
    setLevel,
    setGoal,
    setRhythm,
    setStrongestSkill,
    setWeakestSkill,
    setPreferredFormats,
    setPainPoint,
    goNext,
    goBack,
    goToStep,
    submitStart,
    submitSuccess,
    submitError,
    setFieldErrors,
    reset,
    hydrate,
  } as const;
}
