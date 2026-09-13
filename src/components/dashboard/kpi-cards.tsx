import { DashboardAnalytics } from "@/types/analytics";
import { CheckCircle2, Clock, ListTodo, PlayCircle, AlertCircle, Briefcase } from "lucide-react";

interface KpiCardsProps {
  kpis: DashboardAnalytics["kpis"];
}

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center text-muted-foreground mb-2">
          <ListTodo className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Total Tasks</span>
        </div>
        <div className="text-2xl font-bold">{kpis.totalTasks}</div>
      </div>

      <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center text-muted-foreground mb-2">
          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
          <span className="text-sm font-medium">Completed</span>
        </div>
        <div className="text-2xl font-bold">{kpis.completedTasks}</div>
      </div>

      <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center text-muted-foreground mb-2">
          <PlayCircle className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm font-medium">In Progress</span>
        </div>
        <div className="text-2xl font-bold">{kpis.inProgressTasks}</div>
      </div>

      <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center text-muted-foreground mb-2">
          <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
          <span className="text-sm font-medium">Overdue</span>
        </div>
        <div className="text-2xl font-bold text-destructive">{kpis.overdueTasks}</div>
      </div>

      <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center text-muted-foreground mb-2">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Completion Rate</span>
        </div>
        <div className="text-2xl font-bold">{Math.round(kpis.completionRate)}%</div>
      </div>

      <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center text-muted-foreground mb-2">
          <Briefcase className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Active Projects</span>
        </div>
        <div className="text-2xl font-bold">{kpis.activeProjects}</div>
      </div>
    </div>
  );
}

export function KpiCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between h-24 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
}
