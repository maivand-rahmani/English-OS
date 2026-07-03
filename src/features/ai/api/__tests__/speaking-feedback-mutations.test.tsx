import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  useSpeakingFeedbackMutation,
  type SpeakingFeedbackRequest,
} from "../speaking-feedback.mutations";

/**
 * The speaking feedback mutation accepts a **discriminated union** payload
 * keyed on `type` (`"initial"` vs `"reflection"`) and maps each branch to
 * a different request body shape before POSTing. We stub `fetch` and
 * verify the discriminator-aware body mapping for both branches.
 */

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

const sampleInitial: SpeakingFeedbackRequest = {
  type: "initial",
  prompt: "Talk about your favourite hobby.",
  transcript: "I like reading books in the evening.",
  learnerLevel: "B1",
};

const sampleReflection: SpeakingFeedbackRequest = {
  type: "reflection",
  prompt: "Talk about your favourite hobby.",
  learnerReflection: "I spoke too fast and forgot the word 'novel'.",
  originalTranscript: "I like reading books in the evening.",
  learnerLevel: "B1",
};

const okResponse = {
  ok: true,
  data: {
    verdict: "pass" as const,
    feedbackSummary: "Clear and well-paced.",
    overallSummary: "Strong initial attempt.",
    clarityFeedback: "Speech was clear.",
    grammarFeedback: "Minor tense slip.",
    vocabularyFeedback: "Good range.",
    fluencyFeedback: "Natural pacing.",
    strongerResponseExample: null,
    nextPracticeFocus: "Practice past tense narration.",
    detectedPatterns: [],
    confidenceNote: "Keep going.",
  },
};

function readLastRequestBody(): Record<string, unknown> {
  const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  return JSON.parse(init.body as string) as Record<string, unknown>;
}

describe("useSpeakingFeedbackMutation", () => {
  test("POSTs the initial-type payload using { transcript } and resolves with the data", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => okResponse,
    });

    const { result } = renderHook(() => useSpeakingFeedbackMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: sampleInitial });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(okResponse.data);

    const body = readLastRequestBody();
    expect(body).toEqual({
      learnerLevel: "B1",
      promptText: "Talk about your favourite hobby.",
      transcript: "I like reading books in the evening.",
    });
    expect(body).not.toHaveProperty("learnerReflection");
  });

  test("POSTs the reflection-type payload using { transcript, learnerReflection }", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => okResponse,
    });

    const { result } = renderHook(() => useSpeakingFeedbackMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: sampleReflection });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const body = readLastRequestBody();
    expect(body).toEqual({
      learnerLevel: "B1",
      promptText: "Talk about your favourite hobby.",
      transcript: "I like reading books in the evening.",
      learnerReflection: "I spoke too fast and forgot the word 'novel'.",
    });
  });

  test("throws when the HTTP response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      json: async () => ({}),
    });

    const { result } = renderHook(() => useSpeakingFeedbackMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: sampleInitial });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toContain("HTTP 503");
  });

  test("throws with the API error message when the envelope is {ok:false}", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        ok: false,
        error: { code: "timeout", message: "AI speaking timed out" },
      }),
    });

    const { result } = renderHook(() => useSpeakingFeedbackMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: sampleReflection });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe(
      "AI speaking timed out",
    );
  });
});
