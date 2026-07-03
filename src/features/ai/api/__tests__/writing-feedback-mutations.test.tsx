import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  useWritingFeedbackMutation,
  type WritingFeedbackRequest,
} from "../writing-feedback.mutations";

/**
 * The writing feedback mutation calls `fetch('/api/ai/writing-feedback')`
 * and parses a `{ ok, data | error }` envelope. We stub `fetch` with `vi.fn`
 * and assert both the happy path and the error envelope.
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

const samplePayload: WritingFeedbackRequest = {
  learnerLevel: "B1",
  taskPrompt: "Describe your morning routine.",
  learnerResponse: "I wake up at 7am and brush my teeth.",
};

const okResponse = {
  ok: true,
  data: {
    verdict: "pass" as const,
    feedbackSummary: "Clear and on-topic.",
    overallSummary: "Solid response.",
    correctedVersion: null,
    keyIssues: [],
    naturalnessSuggestions: [],
    grammarNotes: [],
    vocabularySuggestions: [],
    nextPracticeFocus: "Try adding more complex sentences.",
    detectedPatterns: [],
  },
};

describe("useWritingFeedbackMutation", () => {
  test("POSTs the payload and resolves with the writing feedback data on success", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => okResponse,
    });

    const { result } = renderHook(() => useWritingFeedbackMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: samplePayload });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(okResponse.data);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/ai/writing-feedback");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual(samplePayload);
  });

  test("throws an Error when the HTTP response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    const { result } = renderHook(() => useWritingFeedbackMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: samplePayload });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toContain("HTTP 500");
  });

  test("throws an Error with the API error message when the envelope is {ok:false}", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        ok: false,
        error: { code: "provider_error", message: "Model unavailable" },
      }),
    });

    const { result } = renderHook(() => useWritingFeedbackMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: samplePayload });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe("Model unavailable");
  });

  test("forwards the AbortSignal to fetch when one is provided", async () => {
    const controller = new AbortController();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => okResponse,
    });

    const { result } = renderHook(() => useWritingFeedbackMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ payload: samplePayload, signal: controller.signal });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.signal).toBe(controller.signal);
  });
});
