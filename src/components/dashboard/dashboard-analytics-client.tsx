"use client";

import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { DashboardRange } from "@/types/analytics";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { KpiCards, KpiCardsSkeleton } from "./kpi-cards";
import { StatusChart, ChartSkeleton } from "./status-chart";
import { PriorityChart } from "./priority-chart";
import { CompletionTrendChart } from "./completion-trend-chart";
import { ProjectProgressTable, ProjectProgressTableSkeleton } from "./project-progress-table";
import Link from "next/link";

interface DashboardAnalyticsClientProps {
  userName: string;
}

export function DashboardAnalyticsClient({ userName }: DashboardAnalyticsClientProps) {
  const { data, isLoading, error, range, setRange, refresh } = useDashboardAnalytics("30d");

  const ranges: { value: DashboardRange; label: string }[] = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "6m", label: "Last 6 Months" },
    { value: "1y", label: "Last Year" },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-xl font-semibold">Failed to load analytics</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={refresh} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  // Handle completely empty states gracefully (No projects or tasks exist at all for the user)
  const isCompletelyEmpty = data?.kpis.totalTasks === 0 && data?.kpis.activeProjects === 0;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Welcome back, {userName} 👋</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Here is your workspace productivity overview.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted p-1 rounded-lg">
            {ranges.map((r) => (
              <Button
                key={r.value}
                variant={range === r.value ? "default" : "ghost"}
                size="sm"
                className="text-xs h-8"
                onClick={() => setRange(r.value)}
                disabled={isLoading}
              >
                {r.label}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={refresh}
            disabled={isLoading}
            aria-label="Refresh analytics"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-muted-foreground" : ""}`} />
          </Button>
        </div>
      </div>

      {isCompletelyEmpty && !isLoading ? (
        <div className="text-center py-20 border rounded-xl bg-card border-dashed space-y-4">
          <h3 className="text-lg font-medium">No data available yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            You don&apos;t have any active projects or tasks. Get started by creating a project to see your analytics.
          </p>
          <Link href="/dashboard/projects/new">
            <Button>Create your first project</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div>
            {isLoading || !data ? <KpiCardsSkeleton /> : <KpiCards kpis={data.kpis} />}
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {isLoading || !data ? <ChartSkeleton /> : <CompletionTrendChart data={data.completionTrend} />}
            </div>
            <div>
              {isLoading || !data ? <ChartSkeleton /> : <StatusChart data={data.statusDistribution} />}
            </div>
          </div>

          {/* Charts Row 2 & Table */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              {isLoading || !data ? <ChartSkeleton /> : <PriorityChart data={data.priorityDistribution} />}
            </div>
            <div className="lg:col-span-2">
              {isLoading || !data ? <ProjectProgressTableSkeleton /> : <ProjectProgressTable projects={data.projectProgress} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
