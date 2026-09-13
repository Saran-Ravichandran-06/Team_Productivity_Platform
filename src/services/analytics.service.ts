import { prisma } from "@/lib/prisma";
import { DashboardAnalytics, DashboardRange } from "@/types/analytics";
import { TaskStatus, ProjectStatus } from "@prisma/client";

export class AnalyticsService {
  /**
   * Helper to determine start date based on range string
   */
  private static getStartDate(range: DashboardRange): Date {
    const now = new Date();
    switch (range) {
      case "7d":
        return new Date(now.setDate(now.getDate() - 7));
      case "30d":
        return new Date(now.setDate(now.getDate() - 30));
      case "6m":
        return new Date(now.setMonth(now.getMonth() - 6));
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  }

  /**
   * Get full dashboard analytics for a user
   */
  static async getDashboardAnalytics(userId: string, range: DashboardRange): Promise<DashboardAnalytics> {
    const startDate = this.getStartDate(range);
    const now = new Date();

    // 1. We must restrict ALL queries to projects the user is a member of.
    // We will build a common where clause for projects and tasks.
    const projectWhere = {
      members: {
        some: { userId },
      },
    };

    const taskWhere = {
      project: projectWhere,
    };

    // 2. Fetch KPIs using aggregations where possible
    const [
      totalTasks,
      activeProjects,
      statusGroups,
      priorityGroups,
      overdueTasks,
      completionActivities,
      projects
    ] = await Promise.all([
      // Total tasks
      prisma.task.count({ where: taskWhere }),
      
      // Active projects
      prisma.project.count({ where: { ...projectWhere, status: ProjectStatus.ACTIVE } }),
      
      // Status distribution
      prisma.task.groupBy({
        by: ["status"],
        where: taskWhere,
        _count: true,
      }),
      
      // Priority distribution
      prisma.task.groupBy({
        by: ["priority"],
        where: taskWhere,
        _count: true,
      }),

      // Overdue tasks
      prisma.task.count({
        where: {
          ...taskWhere,
          status: { not: TaskStatus.DONE },
          dueDate: { lt: now },
        },
      }),

      // Completion trend (from Activity table for accuracy)
      prisma.activity.findMany({
        where: {
          type: "TASK_COMPLETED",
          project: projectWhere,
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc"
        }
      }),

      // Project Progress
      prisma.project.findMany({
        where: projectWhere,
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              tasks: true,
            },
          },
          tasks: {
            select: {
              status: true,
              dueDate: true,
            }
          }
        },
      })
    ]);

    // 3. Process KPIs
    const todoTasks = statusGroups.find(s => s.status === TaskStatus.TODO)?._count ?? 0;
    const inProgressTasks = statusGroups.find(s => s.status === TaskStatus.IN_PROGRESS)?._count ?? 0;
    const reviewTasks = statusGroups.find(s => s.status === TaskStatus.REVIEW)?._count ?? 0;
    const completedTasks = statusGroups.find(s => s.status === TaskStatus.DONE)?._count ?? 0;
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // 4. Process Completion Trend (group by YYYY-MM-DD)
    const trendMap = new Map<string, number>();
    completionActivities.forEach(activity => {
      // Create local date string YYYY-MM-DD
      const dateStr = activity.createdAt.toISOString().split("T")[0];
      trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
    });

    // Fill in empty dates for the range so the chart looks continuous
    const completionTrend = [];
    const currDate = new Date(startDate);
    while (currDate <= now) {
      const dateStr = currDate.toISOString().split("T")[0];
      completionTrend.push({
        date: dateStr,
        completed: trendMap.get(dateStr) || 0
      });
      currDate.setDate(currDate.getDate() + 1);
    }

    // 5. Process Project Progress
    const projectProgress = projects.map(p => {
      const total = p._count.tasks;
      const completed = p.tasks.filter(t => t.status === TaskStatus.DONE).length;
      const overdue = p.tasks.filter(t => t.status !== TaskStatus.DONE && t.dueDate && t.dueDate < now).length;
      const progress = total > 0 ? (completed / total) * 100 : 0;
      
      return {
        projectId: p.id,
        projectName: p.name,
        totalTasks: total,
        completedTasks: completed,
        progress,
        overdueTasks: overdue,
      };
    });

    // Sort projects by total tasks descending
    projectProgress.sort((a, b) => b.totalTasks - a.totalTasks);

    // 6. Format distributions for charts
    const statusDistribution = statusGroups.map(s => ({
      status: s.status,
      count: s._count
    }));

    const priorityDistribution = priorityGroups.map(p => ({
      priority: p.priority,
      count: p._count
    }));

    return {
      range,
      kpis: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        reviewTasks,
        todoTasks,
        overdueTasks,
        completionRate,
        activeProjects,
      },
      statusDistribution,
      priorityDistribution,
      completionTrend,
      projectProgress,
    };
  }
}
