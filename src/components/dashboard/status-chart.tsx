"use client";

import { DashboardAnalytics } from "@/types/analytics";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface StatusChartProps {
  data: DashboardAnalytics["statusDistribution"];
}

const COLORS: Record<string, string> = {
  TODO: "var(--color-todo, #94a3b8)",
  IN_PROGRESS: "var(--color-in-progress, #3b82f6)",
  REVIEW: "var(--color-review, #f59e0b)",
  DONE: "var(--color-done, #22c55e)",
};

const FORMATTED_NAMES: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
};

export function StatusChart({ data }: StatusChartProps) {
  // Filter out any zero counts for cleaner pie chart
  const validData = data.filter(d => d.count > 0).map(d => ({
    ...d,
    name: FORMATTED_NAMES[d.status] || d.status
  }));

  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm border rounded-xl bg-card">
        No task data available for status distribution.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-6 bg-card shadow-sm h-[400px] flex flex-col">
      <h3 className="font-semibold mb-6">Task Status Distribution</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={validData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="count"
              nameKey="name"
            >
              {validData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status] || "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value} Tasks`, "Count"]}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)'
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="border rounded-xl p-6 bg-card shadow-sm h-[400px] flex flex-col animate-pulse">
      <div className="h-6 w-1/3 bg-muted rounded mb-6"></div>
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="rounded-full bg-muted h-[200px] w-[200px]"></div>
      </div>
    </div>
  );
}
