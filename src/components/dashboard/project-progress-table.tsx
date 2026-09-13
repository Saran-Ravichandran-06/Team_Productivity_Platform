import { DashboardAnalytics } from "@/types/analytics";
import Link from "next/link";

interface ProjectProgressTableProps {
  projects: DashboardAnalytics["projectProgress"];
}

export function ProjectProgressTable({ projects }: ProjectProgressTableProps) {
  if (projects.length === 0) {
    return (
      <div className="border rounded-xl p-6 bg-card shadow-sm text-center text-muted-foreground">
        No active projects found.
      </div>
    );
  }

  return (
    <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="font-semibold">Project Workload & Progress</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Tasks</th>
              <th className="px-6 py-3 font-medium">Completed</th>
              <th className="px-6 py-3 font-medium">Overdue</th>
              <th className="px-6 py-3 font-medium min-w-[200px]">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((project) => (
              <tr key={project.projectId} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">
                  <Link href={`/dashboard/projects/${project.projectId}`} className="hover:underline text-primary">
                    {project.projectName}
                  </Link>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{project.totalTasks}</td>
                <td className="px-6 py-4 text-muted-foreground">{project.completedTasks}</td>
                <td className="px-6 py-4">
                  {project.overdueTasks > 0 ? (
                    <span className="text-destructive font-medium">{project.overdueTasks}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.round(project.progress)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{Math.round(project.progress)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProjectProgressTableSkeleton() {
  return (
    <div className="border rounded-xl bg-card shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 border-b">
        <div className="h-6 bg-muted rounded w-1/4"></div>
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
