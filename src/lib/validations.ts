import { z } from "zod";
import { ProjectStatus, ProjectPriority, ProjectRole, TaskStatus, TaskPriority } from "@prisma/client";

const dateField = z.preprocess(
  (arg) => (arg === "" ? undefined : arg),
  z.coerce.date().optional().nullable()
);

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const baseProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(100).trim(),
  description: z.string().max(500).optional().nullable(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PLANNING),
  priority: z.nativeEnum(ProjectPriority).default(ProjectPriority.MEDIUM),
  startDate: dateField,
  deadline: dateField,
});

export const createProjectSchema = baseProjectSchema.refine((data) => {
  if (data.startDate && data.deadline) {
    return new Date(data.deadline) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "Deadline cannot be earlier than start date",
  path: ["deadline"],
});

export const updateProjectSchema = baseProjectSchema.partial().refine((data) => {
  if (data.startDate && data.deadline) {
    return new Date(data.deadline) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "Deadline cannot be earlier than start date",
  path: ["deadline"],
});

export const addProjectMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum([ProjectRole.ADMIN, ProjectRole.MEMBER]).default(ProjectRole.MEMBER),
});

export const updateProjectMemberSchema = z.object({
  role: z.enum([ProjectRole.ADMIN, ProjectRole.MEMBER]),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long").trim(),
  description: z.string().max(2000, "Description is too long").optional().nullable(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  dueDate: dateField,
  assigneeId: z.string().cuid("Invalid assignee identifier").optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assigneeId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(50),
  sort: z.enum(["createdAt", "updatedAt", "dueDate", "priority"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment is too long").trim(),
});

export const updateCommentSchema = createCommentSchema;

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
export type UpdateProjectMemberInput = z.infer<typeof updateProjectMemberSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
