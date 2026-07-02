import type { DashboardSkill } from "@/entities/dashboard";
import type { BlockState, LearningEvent, ProgressEntry } from "@/shared/types";

export function getEntryState(entry: ProgressEntry | undefined): BlockState {
  return entry?.state ?? "not_started";
}

export function getLatestEventTimestamp(
  events: LearningEvent[],
  type: LearningEvent["type"],
): number | null {
  return events.reduce<number | null>((latest, event) => {
    if (event.type !== type) return latest;
    return latest === null || event.timestamp > latest ? event.timestamp : latest;
  }, null);
}

export function isRecent(timestamp: number, days: number): boolean {
  return Date.now() - timestamp <= days * 24 * 60 * 60 * 1000;
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "Flexible time";

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours} hr`;

  return `${hours} hr ${remainingMinutes} min`;
}

export function getSkillLine(skills: DashboardSkill[]): string {
  if (skills.length === 0) return "No skill links yet";

  return skills
    .slice()
    .sort((left, right) =>
      left.emphasis === right.emphasis ? 0 : left.emphasis === "primary" ? -1 : 1,
    )
    .map((skill) => skill.title)
    .join(" / ");
}
