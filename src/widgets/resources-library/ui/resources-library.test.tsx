import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { ResourcesPageData } from "@/entities/resources";
import { ResourcesLibrary } from "./resources-library";

const mockResource = {
  accessTypeLabel: "Free",
  addedOrder: 0,
  bestUseCase: "Use it for short listening practice.",
  cefrLabel: "B1",
  description: "A short lesson that is easy to revisit on mobile.",
  difficultyLabel: "Intermediate",
  estimatedMinutes: 15,
  followUpHint: "Repeat the main idea in a short voice note.",
  formatCategory: "Video",
  howToUseSteps: [
    "Start with one short session.",
    "Capture one useful phrase.",
  ],
  id: "resource-1",
  isFeatured: true,
  levelTags: ["B1"],
  linkedBlocks: [
    {
      id: "block-1",
      slug: "listening-block",
      stageTitle: "Stage 1",
      state: "in_progress",
      title: "Listening block",
    },
  ],
  nextAction: "Return to the roadmap and reuse one sentence.",
  note: "A clear next step for the current block.",
  primaryCtaLabel: "Continue",
  primarySkillLabel: "Listening",
  primaryUseCaseLabel: "Listening",
  recommendationReason: "It directly supports the active listening block.",
  recommendationScore: 320,
  resourceFormatLabel: "Video",
  resourceTypeLabel: "Lesson",
  role: "core",
  roleLabel: "Core",
  roleValue: "core",
  roadmapLabel: "Stage 1 / Listening block",
  searchText: "daily listening boost bbc learning english",
  secondarySkillLabels: ["Vocabulary"],
  signal: {
    isDifficult: false,
    isUseful: true,
    lastReflection: "useful",
    lastTouchedAt: 10,
    state: "in_progress",
    stateLabel: "In Progress",
  },
  skills: [{ emphasis: "primary", slug: "listening", title: "Listening" }],
  sourceName: "BBC Learning English",
  timeLabel: "15 min",
  title: "Daily Listening Boost",
  url: "https://example.com/resource-1",
  useCaseCategory: "Listening input",
  whyRecommended: "It directly supports the active listening block.",
};

const mockLibrary = {
  activeFilters: [],
  applyResourceAction: vi.fn().mockResolvedValue(undefined),
  applySuggestedFilter: vi.fn(),
  busyAction: null,
  clearAllFilters: vi.fn(),
  clearFilter: vi.fn(),
  closeResource: vi.fn(),
  formatFilter: "all",
  formatOptions: ["Video"],
  isBrowseMode: true,
  isLoading: false,
  levelFilter: "all",
  levelOptions: ["A1", "B1"],
  matchingResources: [mockResource],
  openResource: vi.fn(),
  query: "",
  resources: [mockResource],
  roleFilter: "all",
  selectedResource: null,
  setFormatFilter: vi.fn(),
  setLevelFilter: vi.fn(),
  setQuery: vi.fn(),
  setRoleFilter: vi.fn(),
  setSkillFilter: vi.fn(),
  setStateFilter: vi.fn(),
  setUseCaseFilter: vi.fn(),
  shelves: [
    {
      description: "Recommended first.",
      id: "recommended",
      resources: [mockResource],
      title: "Recommended",
    },
  ],
  skillFilter: "all",
  skillOptions: ["Listening"],
  stateCounts: {
    completed: 0,
    difficult: 0,
    inProgress: 1,
    needsReview: 0,
    skipped: 0,
    useful: 1,
  },
  stateFilter: "all",
  suggestedFilters: [],
  useCaseFilter: "all",
  useCaseOptions: ["Listening input"],
};

vi.mock("../model/use-resources-library", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../model/use-resources-library")>();

  return {
    ...actual,
    useResourcesLibrary: () => mockLibrary,
  };
});

describe("ResourcesLibrary", () => {
  beforeEach(() => {
    mockLibrary.applySuggestedFilter.mockClear();
    mockLibrary.setFormatFilter.mockClear();
    mockLibrary.setLevelFilter.mockClear();
    mockLibrary.setRoleFilter.mockClear();
    mockLibrary.setSkillFilter.mockClear();
    mockLibrary.setStateFilter.mockClear();
    mockLibrary.setUseCaseFilter.mockClear();
    mockLibrary.isBrowseMode = true;
  });

  test("opens and closes the mobile filter sheet", async () => {
    render(<ResourcesLibrary content={buildContentStub()} />);

    fireEvent.click(screen.getAllByRole("button", { name: /^filters$/i })[1]);

    expect(
      await screen.findByRole("heading", { name: /resource filters/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close sheet/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /resource filters/i }),
      ).not.toBeInTheDocument();
    });
  });

  test("renders shelves in browse mode", () => {
    render(<ResourcesLibrary content={buildContentStub()} />);

    expect(screen.getByRole("heading", { name: /recommended/i })).toBeInTheDocument();
    expect(screen.getByText(/recommended first\./i)).toBeInTheDocument();
  });

  test("renders matching resources mode when browse mode is off", () => {
    mockLibrary.isBrowseMode = false;

    render(<ResourcesLibrary content={buildContentStub()} />);

    expect(screen.getByText(/matching resources/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^1 resource$/i })).toBeInTheDocument();
  });
});

function buildContentStub() {
  return {
    audienceLabel: "Adults",
    estimatedWeeks: 8,
    goalLabel: "Build a calmer study system.",
    learnerLevelLabel: "B1",
    resourceCount: 1,
    resources: [],
    templateDescription: "A focused resource library.",
    templateTitle: "Beginner Self-Learner Reset",
  } satisfies ResourcesPageData;
}
