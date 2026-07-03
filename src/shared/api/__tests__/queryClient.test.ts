import { QueryClient } from "@tanstack/react-query";
import { describe, expect, test } from "vitest";

import { createQueryClient, queryClient } from "../queryClient";

describe("createQueryClient", () => {
  test("returns a new QueryClient instance each call", () => {
    const a = createQueryClient();
    const b = createQueryClient();
    expect(a).toBeInstanceOf(QueryClient);
    expect(b).toBeInstanceOf(QueryClient);
    expect(a).not.toBe(b);
  });

  test("instances are independent (mutating one does not affect another)", () => {
    const a = createQueryClient();
    const b = createQueryClient();

    a.setQueryData(["test", "key"], "value-a");

    const bData = b.getQueryData(["test", "key"]);
    expect(bData).toBeUndefined();
  });

  test("default queries options are set correctly", () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.queries?.staleTime).toBe(60_000);
    expect(defaults.queries?.gcTime).toBe(5 * 60_000);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.queries?.retry).toBe(1);
    expect(defaults.queries?.networkMode).toBe("offlineFirst");
  });

  test("default mutations options are set correctly", () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.mutations?.retry).toBe(0);
    expect(defaults.mutations?.networkMode).toBe("offlineFirst");
  });
});

describe("queryClient singleton", () => {
  test("is a QueryClient instance", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });
});
