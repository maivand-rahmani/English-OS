import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { ResourcesLibrary } from "./resources-library";
import type { RoadmapExplorerProps } from "../../roadmap-explorer/model/roadmap-explorer-types";

const mockLibrary = {
  activeResource: null,
  busyAction: null,
  completedCount: 0,
  featuredCount: 1,
  filteredResources: [],
  formatFilter: "all",
  formatOptions: ["Video"],
  isLoading: false,
  progressById: new Map(),
  resources: [
    {
      id: "resource-1",
      accessTypeLabel: "Free",
      bestUseCase: "Use it for short listening practice.",
      cefrLabel: "B1",
      description: "A short lesson that is easy to revisit on mobile.",
      difficultyLabel: "Intermediate",
      estimatedMinutes: 15,
      followUpHint: "Repeat the main idea in a short voice note.",
      isFeatured: true,
      linkedBlocks: [{ id: "block-1", stageTitle: "Stage 1", title: "Listening block" }],
      note: "A clear next step for the current block.",
      primaryUseCaseLabel: "Listening",
      resourceFormatLabel: "Video",
      resourceTypeLabel: "Lesson",
      role: "core",
      skills: [{ emphasis: "primary", slug: "listening", title: "Listening" }],
      sourceName: "BBC Learning English",
      title: "Daily Listening Boost",
      url: "https://example.com/resource-1",
      whyRecommended: "It directly supports the active listening block.",
    },
  ],
  setFormatFilter: vi.fn(),
  setSkillFilter: vi.fn(),
  setStateFilter: vi.fn(),
  setUseCaseFilter: vi.fn(),
  skillFilter: "all",
  skillOptions: ["Listening"],
  stateFilter: "all",
  updateResourceState: vi.fn(),
  useCaseFilter: "all",
  useCaseOptions: ["Listening"],
};

vi.mock("../model/use-resources-library", () => ({
  useResourcesLibrary: () => mockLibrary,
}));

vi.mock("@/shared/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => true,
}));

describe("ResourcesLibrary", () => {
  beforeEach(() => {
    mockLibrary.setFormatFilter.mockClear();
    mockLibrary.setSkillFilter.mockClear();
    mockLibrary.setStateFilter.mockClear();
    mockLibrary.setUseCaseFilter.mockClear();
  });

  test("opens and closes the mobile filter sheet", async () => {
    render(<ResourcesLibrary content={buildContentStub()} />);

    fireEvent.click(screen.getByRole("button", { name: /^filters$/i }));

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
});

function buildContentStub() {
  return {
    audienceLabel: "Adults",
    learnerLevelLabel: "B1",
  } as RoadmapExplorerProps["content"];
}
