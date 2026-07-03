import { describe, expect, test } from "vitest";

import { queryKeys } from "../queryKeys";

describe("queryKeys", () => {
  describe("learners", () => {
    test("profile() returns a stable reference when called without args", () => {
      expect(queryKeys.learners.profile()).toEqual(
        queryKeys.learners.profile(),
      );
    });

    test("all is the same reference", () => {
      expect(queryKeys.learners.all).toBe(queryKeys.learners.all);
    });

    test("profileDetail(id) creates a different array for different ids", () => {
      expect(queryKeys.learners.profileDetail("a")).not.toBe(
        queryKeys.learners.profileDetail("b"),
      );
    });

    test("profile() returns the correct key shape", () => {
      expect(queryKeys.learners.profile()).toEqual(["learners", "profile"]);
    });

    test("profileDetail(id) returns the correct key shape", () => {
      expect(queryKeys.learners.profileDetail("id1")).toEqual([
        "learners",
        "profile",
        "detail",
        "id1",
      ]);
    });

    test("progress() returns the correct key shape", () => {
      expect(queryKeys.learners.progress()).toEqual(["learners", "progress"]);
    });

    test("drafts() returns the correct key shape", () => {
      expect(queryKeys.learners.drafts()).toEqual(["learners", "drafts"]);
    });

    test("events() returns the correct key shape", () => {
      expect(queryKeys.learners.events()).toEqual(["learners", "events"]);
    });
  });

  describe("ai", () => {
    test("writing.feedback() returns the correct key shape", () => {
      expect(queryKeys.ai.writing.feedback()).toEqual([
        "ai",
        "writing",
        "feedback",
      ]);
    });

    test("speaking.feedback() returns the correct key shape", () => {
      expect(queryKeys.ai.speaking.feedback()).toEqual([
        "ai",
        "speaking",
        "feedback",
      ]);
    });

    test("recommendation.explain(id) returns the correct key shape", () => {
      expect(queryKeys.ai.recommendation.explain("rec1")).toEqual([
        "ai",
        "recommendation",
        "explain",
        "rec1",
      ]);
    });

    test("all is the same reference", () => {
      expect(queryKeys.ai.all).toBe(queryKeys.ai.all);
    });
  });

  describe("dashboard", () => {
    test("state() returns the correct key shape", () => {
      expect(queryKeys.dashboard.state()).toEqual(["dashboard", "state"]);
    });

    test("all is the same reference", () => {
      expect(queryKeys.dashboard.all).toBe(queryKeys.dashboard.all);
    });
  });

  describe("resources", () => {
    test("list(filters) returns the correct key shape", () => {
      expect(queryKeys.resources.list({ level: "B1" })).toEqual([
        "resources",
        "list",
        { level: "B1" },
      ]);
    });

    test("detail(id) returns the correct key shape", () => {
      expect(queryKeys.resources.detail("res-1")).toEqual([
        "resources",
        "detail",
        "res-1",
      ]);
    });

    test("all is the same reference", () => {
      expect(queryKeys.resources.all).toBe(queryKeys.resources.all);
    });
  });
});
