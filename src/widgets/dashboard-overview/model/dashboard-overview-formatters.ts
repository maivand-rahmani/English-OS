import type { DashboardBlock, DashboardSkill } from "@/entities/dashboard";
import {
  LearningEventType,
  type BlockState,
  type LearningEvent,
  type ProgressEntry,
} from "@/shared/types";

import type { ResourceWithContext } from "./dashboard-overview-types";

export function countActiveDays(events: LearningEvent[], days: number) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const uniqueDays = new Set(
    events
      .filter((event) => event.timestamp >= cutoff)
      .map((event) => new Date(event.timestamp).toDateString()),
  );

  return uniqueDays.size;
}

export function getConsistencyLabel(activeDays: number) {
  if (activeDays >= 5) {
    return "Strong return rhythm";
  }

  if (activeDays >= 3) {
    return "Steady momentum";
  }

  if (activeDays >= 1) {
    return "Momentum is forming";
  }

  return "No recent rhythm yet";
}

export function getStrongestSkill(
  blocks: DashboardBlock[],
  resources: ResourceWithContext[],
  entries: ProgressEntry[],
) {
  const scores = new Map<string, { title: string; progress: number }>();
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));

  for (const block of blocks) {
    const state = getEntryState(progressById.get(block.id));
    for (const skill of block.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, progress: 0 };
      const weight = skill.emphasis === "primary" ? 3 : 1.5;

      if (state === "completed") {
        current.progress += weight;
      } else if (state === "in_progress") {
        current.progress += weight / 1.5;
      }

      scores.set(skill.slug, current);
    }
  }

  for (const resource of resources) {
    const state = getEntryState(progressById.get(resource.id));
    for (const skill of resource.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, progress: 0 };
      const weight = skill.emphasis === "primary" ? 1.5 : 0.75;

      if (state === "completed") {
        current.progress += weight;
      }

      scores.set(skill.slug, current);
    }
  }

  return [...scores.values()].sort((left, right) => right.progress - left.progress)[0]
    ?.title;
}

export function getWeakestSkill(
  blocks: DashboardBlock[],
  resources: ResourceWithContext[],
  entries: ProgressEntry[],
  events: LearningEvent[],
) {
  const scores = new Map<string, { title: string; friction: number }>();
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const resourceById = new Map(resources.map((resource) => [resource.id, resource]));

  for (const block of blocks) {
    const state = getEntryState(progressById.get(block.id));
    for (const skill of block.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, friction: 0 };
      const weight = skill.emphasis === "primary" ? 2 : 1;

      if (
        state === "difficult" ||
        state === "needs_review" ||
        state === "skipped_for_now"
      ) {
        current.friction += weight;
      }

      scores.set(skill.slug, current);
    }
  }

  for (const resource of resources) {
    const state = getEntryState(progressById.get(resource.id));
    for (const skill of resource.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, friction: 0 };
      const weight = skill.emphasis === "primary" ? 1.75 : 0.75;

      if (state === "needs_review") {
        current.friction += weight;
      }

      scores.set(skill.slug, current);
    }
  }

  for (const event of events) {
    if (event.type !== LearningEventType.ResourceMarkedDifficult) {
      continue;
    }

    const resource = resourceById.get(event.payload.resourceId);
    if (!resource) {
      continue;
    }

    for (const skill of resource.skills) {
      const current = scores.get(skill.slug) ?? { title: skill.title, friction: 0 };
      current.friction += skill.emphasis === "primary" ? 1.5 : 0.75;
      scores.set(skill.slug, current);
    }
  }

  const highestFriction = [...scores.values()].sort(
    (left, right) => right.friction - left.friction,
  )[0];

  return highestFriction?.friction ? highestFriction.title : null;
}

export function getResourceReason(
  resource: ResourceWithContext,
  entry: ProgressEntry | undefined,
  blockState: BlockState,
) {
  const resourceState = getEntryState(entry);

  if (resourceState === "needs_review") {
    return `Recommended because you already marked this resource shaky for ${resource.blockTitle.toLowerCase()}.`;
  }

  if (resourceState === "in_progress") {
    return `Recommended because it is already part of your active work inside ${resource.blockTitle.toLowerCase()}.`;
  }

  if (blockState === "not_started" && resource.role === "core") {
    return "Recommended because it is the core support resource for your current block and helps you start cleanly.";
  }

  return resource.note ?? resource.whyRecommended;
}

export function getWritingStatus(events: LearningEvent[], draftCount: number) {
  if (draftCount > 0) {
    return `${draftCount} local draft${draftCount === 1 ? "" : "s"} waiting`;
  }

  const lastWritingAt = getLatestEventTimestamp(
    events,
    LearningEventType.WritingSubmitted,
  );

  if (!lastWritingAt) {
    return "No writing submitted yet";
  }

  return isRecent(lastWritingAt, 5)
    ? "Writing momentum is still warm"
    : "Writing has been quiet recently";
}

export function getSpeakingStatus(events: LearningEvent[]) {
  const lastSpeakingAt = getLatestEventTimestamp(
    events,
    LearningEventType.SpeakingRecorded,
  );

  if (!lastSpeakingAt) {
    return "No speaking session recorded yet";
  }

  return isRecent(lastSpeakingAt, 5)
    ? "Speaking practice is active"
    : "Speaking needs another return";
}

export function getLatestEventTimestamp(
  events: LearningEvent[],
  type: LearningEvent["type"],
) {
  return events.find((event) => event.type === type)?.timestamp ?? null;
}

export function getEntryState(entry: ProgressEntry | undefined): BlockState {
  return entry?.state ?? "not_started";
}

export function getSkillLine(skills: DashboardSkill[]) {
  if (skills.length === 0) {
    return "No skill links yet";
  }

  return skills
    .slice()
    .sort((left, right) =>
      left.emphasis === right.emphasis
        ? 0
        : left.emphasis === "primary"
          ? -1
          : 1,
    )
    .map((skill) => skill.title)
    .join(" / ");
}

export function humanizeState(state: BlockState) {
  switch (state) {
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    case "difficult":
      return "Difficult";
    case "needs_review":
      return "Needs review";
    case "skipped_for_now":
      return "Skipped for now";
    default:
      return "Not started";
  }
}

export function formatMinutes(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) {
    return "Flexible time";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

export function formatRelativeTimestamp(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(timestamp);
}

export function isRecent(timestamp: number, days: number) {
  return Date.now() - timestamp <= days * 24 * 60 * 60 * 1000;
}
