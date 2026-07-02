import { describe, expect, test } from "vitest";

import type {
  DashboardBlock,
  DashboardResource,
  DashboardSkill,
} from "@/entities/dashboard";
import type { ProgressEntry } from "@/shared/types";

import {
  selectBestNextResource,
  type EnrichedResource,
  type RecommendationCollections,
} from "./engine";

const STAGE_1 = "stage-1";
const STAGE_2 = "stage-2";
const STAGE_3 = "stage-3";

const BLOCK_1A = "block-1a";
const BLOCK_1B = "block-1b";
const BLOCK_2A = "block-2a";
const BLOCK_2B = "block-2b";
const BLOCK_3A = "block-3a";

const SKILLS: DashboardSkill[] = [];

function makeBlock(
  id: string,
  stageId: string,
  stageTitle: string,
  title: string,
): DashboardBlock {
  return {
    id,
    slug: id,
    title,
    summary: null,
    purpose: null,
    whyNow: null,
    estimatedMinutes: 30,
    recommendedSessionCount: null,
    cefrLabel: null,
    stageId,
    stageTitle,
    stageSummary: null,
    stageTypeLabel: "Foundation",
    blockTypeLabel: "Learn",
    skills: SKILLS,
    resources: [],
    writingTasks: [],
    speakingPrompts: [],
  };
}

function makeResource(overrides: Partial<EnrichedResource>): EnrichedResource {
  const base: DashboardResource = {
    id: overrides.id ?? "res-default",
    slug: overrides.slug ?? overrides.id ?? "res-default",
    title: overrides.title ?? "Default Resource",
    sourceName: "Source",
    url: "https://example.com",
    description: null,
    resourceTypeLabel: "Article",
    resourceFormatLabel: "Text",
    primaryUseCaseLabel: "Foundation",
    accessTypeLabel: "Free",
    difficultyLabel: "Standard",
    cefrLabel: null,
    estimatedMinutes: 10,
    whyRecommended: "Recommended",
    bestUseCase: "Use it",
    followUpHint: null,
    note: null,
    role: overrides.role ?? "core",
    skills: [],
    isFeatured: false,
  };
  return {
    ...base,
    blockId: overrides.blockId ?? BLOCK_1A,
    blockTitle: overrides.blockTitle ?? "Block 1A",
    stageTitle: overrides.stageTitle ?? "Stage 1",
    stageTypeLabel: overrides.stageTypeLabel ?? "Foundation",
    blockSkills: overrides.blockSkills ?? [],
  };
}

function makeCollections(): RecommendationCollections {
  const blocks: DashboardBlock[] = [
    makeBlock(BLOCK_1A, STAGE_1, "Stage 1", "Block 1A"),
    makeBlock(BLOCK_1B, STAGE_1, "Stage 1", "Block 1B"),
    makeBlock(BLOCK_2A, STAGE_2, "Stage 2", "Block 2A"),
    makeBlock(BLOCK_2B, STAGE_2, "Stage 2", "Block 2B"),
    makeBlock(BLOCK_3A, STAGE_3, "Stage 3", "Block 3A"),
  ];
  const resources: EnrichedResource[] = [
    makeResource({
      id: "res-1a",
      blockId: BLOCK_1A,
      blockTitle: "Block 1A",
      stageTitle: "Stage 1",
      role: "core",
    }),
    makeResource({
      id: "res-1b",
      blockId: BLOCK_1B,
      blockTitle: "Block 1B",
      stageTitle: "Stage 1",
      role: "core",
    }),
    makeResource({
      id: "res-2a",
      blockId: BLOCK_2A,
      blockTitle: "Block 2A",
      stageTitle: "Stage 2",
      role: "core",
    }),
    makeResource({
      id: "res-2b",
      blockId: BLOCK_2B,
      blockTitle: "Block 2B",
      stageTitle: "Stage 2",
      role: "core",
    }),
    makeResource({
      id: "res-3a",
      blockId: BLOCK_3A,
      blockTitle: "Block 3A",
      stageTitle: "Stage 3",
      role: "core",
    }),
  ];
  const blockById = new Map(blocks.map((b) => [b.id, b]));
  const resourceById = new Map(resources.map((r) => [r.id, r]));
  return {
    allBlocks: blocks,
    blockById,
    resourceById,
    resources,
    writingTasks: [],
    speakingPrompts: [],
  };
}

function progress(
  entries: Array<[string, ProgressEntry["state"]]>,
): Map<string, ProgressEntry> {
  return new Map(
    entries.map(([id, state]) => [
      id,
      { id, entryType: "resource", state, updatedAt: 0 },
    ]),
  );
}

describe("selectBestNextResource", () => {
  test("step 1: returns in-progress resource in focus block", () => {
    const collections = makeCollections();
    const result = selectBestNextResource(
      collections,
      progress([["res-1a", "in_progress"]]),
      [],
      BLOCK_1A,
      STAGE_1,
    );
    expect(result.resource?.id).toBe("res-1a");
    expect(result.urgency).toBe("now");
  });

  test("step 2: returns core resource in focus block when nothing in-progress", () => {
    const collections = makeCollections();
    const result = selectBestNextResource(
      collections,
      new Map(),
      [],
      BLOCK_1A,
      STAGE_1,
    );
    expect(result.resource?.id).toBe("res-1a");
    expect(result.urgency).toBe("soon");
  });

  test("step 3: returns supporting resource in focus block when core is completed", () => {
    const collections = makeCollections();
    collections.resources.push(
      makeResource({
        id: "res-1a-support",
        blockId: BLOCK_1A,
        blockTitle: "Block 1A",
        stageTitle: "Stage 1",
        role: "supporting",
      }),
    );
    collections.resourceById.set("res-1a-support", collections.resources.at(-1)!);

    const result = selectBestNextResource(
      collections,
      progress([["res-1a", "completed"]]),
      [],
      BLOCK_1A,
      STAGE_1,
    );
    expect(result.resource?.id).toBe("res-1a-support");
    expect(result.urgency).toBe("soon");
  });

  test("step 4: returns unfinished core from current + next stage when focus block is exhausted", () => {
    const collections = makeCollections();
    const result = selectBestNextResource(
      collections,
      progress([
        ["res-1a", "completed"],
        ["res-1b", "completed"],
      ]),
      [],
      BLOCK_1A,
      STAGE_1,
    );
    expect(result.resource?.id).not.toBe("res-3a");
    expect(["res-2a", "res-2b"]).toContain(result.resource?.id);
  });

  test("step 4: does NOT return resources from stages more than 1 ahead of focus", () => {
    const collections = makeCollections();
    const result = selectBestNextResource(
      collections,
      progress([
        ["res-1a", "completed"],
        ["res-1b", "completed"],
        ["res-2a", "completed"],
        ["res-2b", "completed"],
      ]),
      [],
      BLOCK_1A,
      STAGE_1,
    );
    expect(result.resource?.id).not.toBe("res-3a");
  });

  test("step 5: fallback returns first resource in current + next stage", () => {
    const collections = makeCollections();
    const result = selectBestNextResource(
      collections,
      progress([
        ["res-1a", "completed"],
        ["res-1b", "completed"],
        ["res-2a", "completed"],
        ["res-2b", "completed"],
      ]),
      [],
      BLOCK_1A,
      STAGE_1,
    );
    expect(result.resource).not.toBeNull();
    expect(["Stage 1", "Stage 2"]).toContain(result.resource?.stageTitle);
    expect(result.urgency).toBe("optional");
  });

  test("when no focus is provided, allows resources from all stages (backwards compat)", () => {
    const collections = makeCollections();
    const result = selectBestNextResource(collections, new Map(), []);
    expect(result.resource?.id).toBe("res-1a");
  });

  test("focusStageId alone constrains the candidate pool without focusBlockId", () => {
    const collections = makeCollections();
    const result = selectBestNextResource(
      collections,
      new Map(),
      [],
      undefined,
      STAGE_1,
    );
    expect(["res-1a", "res-1b"]).toContain(result.resource?.id);
  });
});
