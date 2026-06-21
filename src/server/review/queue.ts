import type { DashboardBlock, DashboardResource, DashboardSkill } from "@/entities/dashboard";
import {
  LearningEventType,
  type LearningEvent,
  type ProgressEntry,
} from "@/shared/types";
import {
  getEntryState,
  getSkillLine,
} from "@/shared/lib/recommendation-helpers";

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */

export type ReviewSource = "resource" | "block" | "writing_mistake" | "speaking_pattern";

export type ReviewQueueItem = {
  id: string;
  sourceType: ReviewSource;
  sourceId: string;
  label: string;
  context: string;
  urgency: "overdue" | "due_soon" | "flagged" | "neglected";
  priority: number;
  reason: string;
};

export type WeakAreaSignal = {
  skillSlug: string;
  skillTitle: string;
  signal: "weak" | "neglected" | "avoided" | "difficult";
  evidence: string;
  strength: number;
};

export type EnrichedResource = DashboardResource & {
  blockId: string;
  blockTitle: string;
  stageTitle: string;
  stageTypeLabel: string;
  blockSkills: DashboardSkill[];
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;
const OVERDUE_DAYS = 14;
const DUE_SOON_DAYS = 7;
const BLOCK_REVIEW_DAYS = 7;
const RESOURCE_REVISIT_DAYS = 14;
const DIFFICULTY_RECURRENCE_MIN = 2;
const QUEUE_MAX_ITEMS = 8;
const NEGLECT_DEFAULT_DAYS = 7;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function daysSince(timestamp: number): number {
  return (Date.now() - timestamp) / DAY_MS;
}

function clampPriority(value: number): number {
  return Math.min(10, Math.max(1, Math.round(value)));
}

function assignUrgency(entryOrEventTs: number): ReviewQueueItem["urgency"] {
  const elapsed = daysSince(entryOrEventTs);
  if (elapsed > OVERDUE_DAYS) return "overdue";
  if (elapsed > DUE_SOON_DAYS) return "due_soon";
  return "flagged";
}

function dedupKey(sourceType: ReviewSource, sourceId: string, suffix?: string): string {
  return suffix ? `${sourceType}:${sourceId}:${suffix}` : `${sourceType}:${sourceId}`;
}

function blockPriority(daysSinceUpdate: number, block: DashboardBlock): number {
  let score = 3;
  if (daysSinceUpdate > OVERDUE_DAYS) score += 4;
  else if (daysSinceUpdate > DUE_SOON_DAYS) score += 2;
  if (block.skills.some((s) => s.emphasis === "primary")) score += 1;
  return clampPriority(score);
}

function resourcePriority(daysSinceUpdate: number, resource: EnrichedResource): number {
  let score = 3;
  if (daysSinceUpdate > OVERDUE_DAYS) score += 4;
  else if (daysSinceUpdate > DUE_SOON_DAYS) score += 2;
  if (resource.role === "core") score += 1;
  return clampPriority(score);
}

/* ------------------------------------------------------------------ */
/*  generateReviewQueue                                                */
/* ------------------------------------------------------------------ */

export function generateReviewQueue(
  entries: ProgressEntry[],
  events: LearningEvent[],
  blockById: Map<string, DashboardBlock>,
  resourceById: Map<string, EnrichedResource>,
): ReviewQueueItem[] {
  const queue = new Map<string, ReviewQueueItem>();

  // 1. Entries with "needs_review" or "difficult"
  for (const entry of entries) {
    if (entry.state !== "needs_review" && entry.state !== "difficult") continue;

    if (entry.entryType === "block") {
      const block = blockById.get(entry.id);
      if (!block) continue;

      const elapsed = daysSince(entry.updatedAt);
      const key = dedupKey("block", block.id);
      if (!queue.has(key)) {
        queue.set(key, {
          id: key,
          sourceType: "block",
          sourceId: block.id,
          label: block.title,
          context: `${block.stageTitle} — ${getSkillLine(block.skills)}`,
          urgency: assignUrgency(entry.updatedAt),
          priority: blockPriority(elapsed, block),
          reason: `Due for review — ${Math.round(elapsed)} day${Math.round(elapsed) === 1 ? "" : "s"} since last update in ${block.stageTitle.toLowerCase()}.`,
        });
      }
    }

    if (entry.entryType === "resource") {
      const resource = resourceById.get(entry.id);
      if (!resource) continue;

      const elapsed = daysSince(entry.updatedAt);
      const key = dedupKey("resource", resource.id);
      if (!queue.has(key)) {
        queue.set(key, {
          id: key,
          sourceType: "resource",
          sourceId: resource.id,
          label: resource.title,
          context: `${resource.blockTitle} / ${resource.sourceName}`,
          urgency: assignUrgency(entry.updatedAt),
          priority: resourcePriority(elapsed, resource),
          reason: `Due for review — completed ${Math.round(elapsed)} day${Math.round(elapsed) === 1 ? "" : "s"} ago and marked the main resource difficult.`,
        });
      }
    }
  }

  // 2. ResourceMarkedDifficult events
  for (const event of events) {
    if (event.type !== LearningEventType.ResourceMarkedDifficult) continue;

    const resource = resourceById.get(event.payload.resourceId);
    if (!resource) continue;

    const existingKey = dedupKey("resource", resource.id);
    if (queue.has(existingKey)) continue;

    const key = dedupKey("resource", resource.id, "difficult");
    queue.set(key, {
      id: key,
      sourceType: "resource",
      sourceId: resource.id,
      label: resource.title,
      context: `${resource.blockTitle} / marked difficult`,
      urgency: assignUrgency(event.timestamp),
      priority: clampPriority(7),
      reason: event.payload.reason ?? `Marked difficult for ${resource.blockTitle.toLowerCase()} — needs another pass.`,
    });
  }

  // 3. Blocks completed but not reviewed in 7+ days
  for (const [, block] of blockById) {
    const entry = entries.find(
      (e) => e.id === block.id && e.entryType === "block",
    );
    if (!entry || entry.state !== "completed") continue;

    const completedDays = daysSince(entry.updatedAt);
    if (completedDays < BLOCK_REVIEW_DAYS) continue;

    const lastReviewEvent = events.find(
      (e) =>
        e.type === LearningEventType.ReviewDone &&
        e.payload.reviewItemId === `block:${block.id}`,
    );

    if (lastReviewEvent && daysSince(lastReviewEvent.timestamp) < BLOCK_REVIEW_DAYS) continue;

    const key = dedupKey("block", block.id, "review");
    if (!queue.has(key)) {
      queue.set(key, {
        id: key,
        sourceType: "block",
        sourceId: block.id,
        label: block.title,
        context: `${block.stageTitle} — completed ${Math.round(completedDays)} days ago`,
        urgency: completedDays > OVERDUE_DAYS ? "overdue" : "due_soon",
        priority: clampPriority(6),
        reason: `Completed ${Math.round(completedDays)} days ago — due for a review pass.`,
      });
    }
  }

  // 4. Resources completed over 14 days ago without revisit
  for (const [, resource] of resourceById) {
    const entry = entries.find(
      (e) => e.id === resource.id && e.entryType === "resource",
    );
    if (!entry || entry.state !== "completed") continue;

    const completedDays = daysSince(entry.updatedAt);
    if (completedDays < RESOURCE_REVISIT_DAYS) continue;

    const hasRevisit = events.some(
      (e) =>
        (e.type === LearningEventType.ResourceStarted ||
          e.type === LearningEventType.ResourceCompleted) &&
        "resourceId" in e.payload &&
        e.payload.resourceId === resource.id &&
        e.timestamp > entry.updatedAt,
    );
    if (hasRevisit) continue;

    const key = dedupKey("resource", resource.id, "revisit");
    if (!queue.has(key)) {
      queue.set(key, {
        id: key,
        sourceType: "resource",
        sourceId: resource.id,
        label: resource.title,
        context: `${resource.blockTitle} — last done ${Math.round(completedDays)} days ago`,
        urgency: completedDays > 21 ? "overdue" : "due_soon",
        priority: clampPriority(5),
        reason: `Completed ${Math.round(completedDays)} days ago — time for a refresher.`,
      });
    }
  }

  // 5. Skills appearing in difficulty signals
  const skillDifficultyCount = new Map<string, { title: string; count: number }>();

  for (const event of events) {
    if (event.type !== LearningEventType.ResourceMarkedDifficult) continue;
    const resource = resourceById.get(event.payload.resourceId);
    if (!resource) continue;
    for (const skill of resource.skills) {
      const current = skillDifficultyCount.get(skill.slug) ?? {
        title: skill.title,
        count: 0,
      };
      current.count++;
      skillDifficultyCount.set(skill.slug, current);
    }
  }

  for (const [slug, info] of skillDifficultyCount) {
    if (info.count < DIFFICULTY_RECURRENCE_MIN) continue;

    const key = dedupKey("resource", slug, "recurring");
    if (!queue.has(key)) {
      queue.set(key, {
        id: key,
        sourceType: "resource",
        sourceId: slug,
        label: info.title,
        context: "Recurring difficulty signal",
        urgency: "flagged",
        priority: clampPriority(5 + info.count),
        reason: `${info.title} keeps appearing in difficulty flags (${info.count}x).`,
      });
    }
  }

  return [...queue.values()]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, QUEUE_MAX_ITEMS);
}

/* ------------------------------------------------------------------ */
/*  detectWeakAreas                                                    */
/* ------------------------------------------------------------------ */

export function detectWeakAreas(
  entries: ProgressEntry[],
  events: LearningEvent[],
  blocks: DashboardBlock[],
  resources: EnrichedResource[],
): WeakAreaSignal[] {
  const signals = new Map<string, WeakAreaSignal>();
  const progressById = new Map(entries.map((e) => [e.id, e]));

  for (const block of blocks) {
    const state = getEntryState(progressById.get(block.id));

    for (const skill of block.skills) {
      const existing = signals.get(skill.slug);

      if (state === "difficult" || state === "needs_review") {
        const weight = skill.emphasis === "primary" ? 2 : 1;
        const signal: WeakAreaSignal = existing ?? {
          skillSlug: skill.slug,
          skillTitle: skill.title,
          signal: "difficult",
          evidence: "",
          strength: 0,
        };
        signal.strength += weight;
        signals.set(skill.slug, signal);
      }

      if (state === "skipped_for_now" && skill.emphasis === "primary") {
        const weight = 1.5;
        const signal: WeakAreaSignal = existing ?? {
          skillSlug: skill.slug,
          skillTitle: skill.title,
          signal: "avoided",
          evidence: "",
          strength: 0,
        };
        signal.strength += weight;
        signals.set(skill.slug, signal);
      }
    }
  }

  for (const resource of resources) {
    const state = getEntryState(progressById.get(resource.id));
    if (state !== "needs_review") continue;

    for (const skill of resource.skills) {
      const existing = signals.get(skill.slug);
      const weight = skill.emphasis === "primary" ? 1.5 : 0.75;
      const signal: WeakAreaSignal = existing ?? {
        skillSlug: skill.slug,
        skillTitle: skill.title,
        signal: "weak",
        evidence: "",
        strength: 0,
      };
      signal.strength += weight;
      if (signal.signal === "weak" && signal.strength > 3) {
        signal.signal = "difficult";
      }
      signals.set(skill.slug, signal);
    }
  }

  for (const event of events) {
    if (event.type !== LearningEventType.ResourceMarkedDifficult) continue;

    const resource = resources.find((r) => r.id === event.payload.resourceId);
    if (!resource) continue;

    for (const skill of resource.skills) {
      const existing = signals.get(skill.slug);
      const weight = skill.emphasis === "primary" ? 1.5 : 0.75;
      const signal: WeakAreaSignal = existing ?? {
        skillSlug: skill.slug,
        skillTitle: skill.title,
        signal: "difficult",
        evidence: "",
        strength: 0,
      };
      signal.strength += weight;
      signal.signal = "difficult";
      signals.set(skill.slug, signal);
    }
  }

  for (const [, signal] of signals) {
    const difficultyResourceCount = resources.filter(
      (r) =>
        r.skills.some((s) => s.slug === signal.skillSlug) &&
        (progressById.get(r.id)?.state === "needs_review" ||
          progressById.get(r.id)?.state === "difficult" ||
          events.some(
            (e) =>
              e.type === LearningEventType.ResourceMarkedDifficult &&
              e.payload.resourceId === r.id,
          )),
    ).length;

    const skippedBlockCount = blocks.filter(
      (b) =>
        b.skills.some((s) => s.slug === signal.skillSlug) &&
        progressById.get(b.id)?.state === "skipped_for_now",
    ).length;

    const evidenceParts: string[] = [];
    if (difficultyResourceCount > 0) {
      evidenceParts.push(
        `${difficultyResourceCount} resource${difficultyResourceCount > 1 ? "s" : ""} marked difficult for this skill`,
      );
    }
    if (skippedBlockCount > 0) {
      evidenceParts.push(
        `${skippedBlockCount} block${skippedBlockCount > 1 ? "s" : ""} skipped with this skill as primary focus`,
      );
    }
    signal.evidence = evidenceParts.join("; ") || "Weakness detected";
  }

  return [...signals.values()]
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5);
}

/* ------------------------------------------------------------------ */
/*  detectNeglectedSkills                                              */
/* ------------------------------------------------------------------ */

export function detectNeglectedSkills(
  events: LearningEvent[],
  blocks: DashboardBlock[],
  resources: EnrichedResource[],
  daysThreshold: number = NEGLECT_DEFAULT_DAYS,
): WeakAreaSignal[] {
  const cutoff = Date.now() - daysThreshold * DAY_MS;
  const signals: WeakAreaSignal[] = [];

  const recentBlockIds = new Set<string>();
  const recentResourceIds = new Set<string>();

  for (const event of events) {
    if (event.timestamp < cutoff) continue;

    switch (event.type) {
      case LearningEventType.BlockStarted:
      case LearningEventType.BlockCompleted:
        if ("blockId" in event.payload && typeof event.payload.blockId === "string") {
          recentBlockIds.add(event.payload.blockId);
        }
        break;
      case LearningEventType.ResourceStarted:
      case LearningEventType.ResourceCompleted:
        if ("resourceId" in event.payload && typeof event.payload.resourceId === "string") {
          recentResourceIds.add(event.payload.resourceId);
        }
        break;
      default:
        break;
    }
  }

  const skillMap = new Map<string, { title: string; latestActivity: number; speakingSkill: boolean; writingSkill: boolean }>();

  for (const block of blocks) {
    if (recentBlockIds.has(block.id)) continue;

    for (const skill of block.skills) {
      const slug = skill.slug;
      const isSpeaking = skill.title.toLowerCase().includes("speaking") || slug.includes("speaking");
      const isWriting = skill.title.toLowerCase().includes("writing") || slug.includes("writing");

      const existing = skillMap.get(slug) ?? {
        title: skill.title,
        latestActivity: 0,
        speakingSkill: isSpeaking,
        writingSkill: isWriting,
      };
      skillMap.set(slug, existing);
    }
  }

  for (const resource of resources) {
    if (recentResourceIds.has(resource.id)) continue;

    for (const skill of resource.skills) {
      const slug = skill.slug;
      const isSpeaking = skill.title.toLowerCase().includes("speaking") || slug.includes("speaking");
      const isWriting = skill.title.toLowerCase().includes("writing") || slug.includes("writing");

      const existing = skillMap.get(slug) ?? {
        title: skill.title,
        latestActivity: 0,
        speakingSkill: isSpeaking,
        writingSkill: isWriting,
      };
      skillMap.set(slug, existing);
    }
  }

  let hasRecentWriting = false;
  let hasRecentSpeaking = false;

  for (const event of events) {
    if (event.timestamp < cutoff) continue;
    if (event.type === LearningEventType.WritingSubmitted) hasRecentWriting = true;
    if (event.type === LearningEventType.SpeakingRecorded) hasRecentSpeaking = true;
  }

  for (const [slug, info] of skillMap) {
    if (info.writingSkill && hasRecentWriting) continue;
    if (info.speakingSkill && hasRecentSpeaking) continue;

    const latestTs = findLatestActivity(slug, blocks, resources, events);
    const daysSinceLast = latestTs > 0 ? Math.round((Date.now() - latestTs) / DAY_MS) : daysThreshold + 1;

    const evidence =
      info.speakingSkill
        ? "Speaking practice has been quiet for over a week."
        : info.writingSkill
          ? "Writing has been quiet for over a week."
          : `No practice activity for ${daysSinceLast} day${daysSinceLast === 1 ? "" : "s"}.`;

    signals.push({
      skillSlug: slug,
      skillTitle: info.title,
      signal: "neglected",
      evidence,
      strength: Math.min(1, daysSinceLast / OVERDUE_DAYS),
    });
  }

  return signals.sort((a, b) => b.strength - a.strength).slice(0, 5);
}

function findLatestActivity(
  skillSlug: string,
  blocks: DashboardBlock[],
  resources: EnrichedResource[],
  events: LearningEvent[],
): number {
  const relevantBlockIds = blocks
    .filter((b) => b.skills.some((s) => s.slug === skillSlug))
    .map((b) => b.id);

  const relevantResourceIds = resources
    .filter((r) => r.skills.some((s) => s.slug === skillSlug))
    .map((r) => r.id);

  let latest = 0;

  for (const event of events) {
    if (event.timestamp <= latest) continue;

    const matchesBlock =
      "blockId" in event.payload &&
      typeof event.payload.blockId === "string" &&
      relevantBlockIds.includes(event.payload.blockId);

    const matchesResource =
      "resourceId" in event.payload &&
      typeof event.payload.resourceId === "string" &&
      relevantResourceIds.includes(event.payload.resourceId);

    if (matchesBlock || matchesResource) {
      latest = event.timestamp;
    }
  }

  return latest;
}

/* ------------------------------------------------------------------ */
/*  getReviewHeadline                                                  */
/* ------------------------------------------------------------------ */

export function getReviewHeadline(items: ReviewQueueItem[]): string {
  if (items.length === 0) return "No urgent review yet";

  const overdue = items.filter((i) => i.urgency === "overdue").length;
  const neglected = items.filter((i) => i.urgency === "neglected").length;

  if (overdue > 0) {
    return `${items.length} item${items.length === 1 ? "" : "s"} need attention — ${overdue} overdue`;
  }

  if (neglected > 0) {
    return `${neglected} neglected area${neglected === 1 ? "" : "s"} need${neglected === 1 ? "s" : ""} a check-in`;
  }

  return `${items.length} item${items.length === 1 ? "" : "s"} need attention`;
}
