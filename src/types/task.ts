import { TaskStatus, TaskPriority } from "@prisma/client";

export interface TaskMemberUser {
  id: string;
  name: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface TaskProjectMember {
  id?: string;
  user: TaskMemberUser;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  creatorId?: string;
  assigneeId?: string | null;
  creator?: TaskMemberUser | null;
  assignee?: TaskMemberUser | null;
}

