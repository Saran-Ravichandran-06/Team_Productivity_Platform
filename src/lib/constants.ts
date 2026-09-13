export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE",
} as const;

export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export const PROJECT_STATUS = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
} as const;

export const PROJECT_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export const TASK_STATUS_LIST = Object.values(TASK_STATUS);
export const TASK_PRIORITY_LIST = Object.values(TASK_PRIORITY);

export type TaskStatusType = keyof typeof TASK_STATUS;
export type TaskPriorityType = keyof typeof TASK_PRIORITY;
export type ProjectStatusType = keyof typeof PROJECT_STATUS;
export type ProjectPriorityType = keyof typeof PROJECT_PRIORITY;
