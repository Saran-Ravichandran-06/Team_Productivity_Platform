export type DashboardRange = "7d" | "30d" | "6m" | "1y";

export interface DashboardAnalytics {
  range: DashboardRange;
  kpis: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    reviewTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
    activeProjects: number;
  };
  statusDistribution: {
    status: string;
    count: number;
  }[];
  priorityDistribution: {
    priority: string;
    count: number;
  }[];
  completionTrend: {
    date: string;
    completed: number;
  }[];
  projectProgress: {
    projectId: string;
    projectName: string;
    totalTasks: number;
    completedTasks: number;
    progress: number;
    overdueTasks: number;
  }[];
}
