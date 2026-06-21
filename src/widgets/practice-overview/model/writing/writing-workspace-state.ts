import type { DashboardBlock, DashboardContentState } from "@/entities/dashboard";
import type { DraftSummary, ProgressEntry } from "@/shared/types";
import {
  buildDashboardCollections,
  getFocusBlock,
} from "@/widgets/dashboard-overview/model/dashboard-overview-selectors";
import type { WritingTaskWithContext } from "@/widgets/dashboard-overview/model/dashboard-overview-types";

export type WritingTaskListItem = WritingTaskWithContext & {
  draft: DraftSummary | undefined;
  isActive: boolean;
  isRecommended: boolean;
};

export type WritingWorkspaceState = {
  activeDraft: DraftSummary | undefined;
  activeTask: WritingTaskWithContext | null;
  focusBlock: DashboardBlock | null;
  tasks: WritingTaskListItem[];
};

export function getPreferredWritingTask(
  tasks: WritingTaskWithContext[],
  focusBlockId: string | undefined,
  drafts: DraftSummary[],
) {
  const draftTaskIds = new Set(
    drafts.flatMap((draft) => (draft.taskId ? [draft.taskId] : [])),
  );

  return (
    tasks.find(
      (task) => task.blockId === focusBlockId && draftTaskIds.has(task.id),
    ) ??
    tasks.find((task) => draftTaskIds.has(task.id)) ??
    tasks.find((task) => task.blockId === focusBlockId) ??
    tasks[0] ??
    null
  );
}

export function getWritingWorkspaceState(
  content: DashboardContentState,
  entries: ProgressEntry[],
  drafts: DraftSummary[],
  selectedTaskId?: string | null,
): WritingWorkspaceState {
  const collections = buildDashboardCollections(content);
  const progressById = new Map(entries.map((entry) => [entry.id, entry]));
  const focusBlock = getFocusBlock(collections.allBlocks, progressById);
  const preferredTask = getPreferredWritingTask(
    collections.writingTasks,
    focusBlock?.id,
    drafts,
  );
  const activeTask =
    collections.writingTasks.find((task) => task.id === selectedTaskId) ??
    preferredTask;
  const draftByTaskId = new Map<string, DraftSummary>();

  for (const draft of drafts) {
    if (draft.taskId && !draftByTaskId.has(draft.taskId)) {
      draftByTaskId.set(draft.taskId, draft);
    }
  }

  const tasks = collections.writingTasks
    .map((task, index) => {
      const draft = draftByTaskId.get(task.id);
      return {
        ...task,
        draft,
        isActive: task.id === activeTask?.id,
        isRecommended: task.blockId === focusBlock?.id,
        order: index,
      };
    })
    .sort((left, right) => compareTaskPriority(left, right))
    .map((task) => {
      const { order, ...taskListItem } = task;
      void order;
      return taskListItem;
    });

  return {
    activeDraft: activeTask ? draftByTaskId.get(activeTask.id) : undefined,
    activeTask,
    focusBlock,
    tasks,
  };
}

function compareTaskPriority(
  left: WritingTaskListItem & { order: number },
  right: WritingTaskListItem & { order: number },
) {
  const scoreDiff = getTaskPriority(right) - getTaskPriority(left);

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return left.order - right.order;
}

function getTaskPriority(task: WritingTaskListItem) {
  if (task.isActive) {
    return 3;
  }

  if (task.draft) {
    return 2;
  }

  if (task.isRecommended) {
    return 1;
  }

  return 0;
}
