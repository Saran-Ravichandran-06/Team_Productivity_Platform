import { DashboardAnalytics } from "@/types/analytics";
import { CheckCircle2, ListTodo, PlayCircle, AlertCircle, Briefcase, TrendingUp } from "lucide-react";

interface KpiCardsProps {
  kpis: DashboardAnalytics["kpis"];
}

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {/* 1. Total Tasks */}
      <div className="border border-border/80 rounded-xl p-4 bg-card shadow-xs hover:border-coffee-warm/60 hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total Tasks</span>
          <div className="p-1.5 rounded-lg bg-coffee-latte text-coffee-deep">
            <ListTodo className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{kpis.totalTasks}</div>
      </div>

      {/* 2. Completed Tasks */}
      <div className="border border-border/80 rounded-xl p-4 bg-card shadow-xs hover:border-coffee-warm/60 hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{kpis.completedTasks}</div>
      </div>

      {/* 3. In Progress */}
      <div className="border border-border/80 rounded-xl p-4 bg-card shadow-xs hover:border-coffee-warm/60 hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">In Progress</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <PlayCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{kpis.inProgressTasks}</div>
      </div>

      {/* 4. Overdue */}
      <div className="border border-border/80 rounded-xl p-4 bg-card shadow-xs hover:border-coffee-warm/60 hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Overdue</span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-destructive dark:bg-rose-950/30">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-destructive">{kpis.overdueTasks}</div>
      </div>

      {/* 5. Completion Rate */}
      <div className="border border-border/80 rounded-xl p-4 bg-card shadow-xs hover:border-coffee-warm/60 hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Completion</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{Math.round(kpis.completionRate)}%</div>
      </div>

      {/* 6. Active Projects */}
      <div className="border border-border/80 rounded-xl p-4 bg-card shadow-xs hover:border-coffee-warm/60 hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Active Projects</span>
          <div className="p-1.5 rounded-lg bg-coffee-light text-coffee-dark">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{kpis.activeProjects}</div>
      </div>
    </div>
  );
}

export function KpiCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border border-border/60 rounded-xl p-4 bg-card shadow-xs flex flex-col justify-between h-24 animate-pulse"
        >
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
}
