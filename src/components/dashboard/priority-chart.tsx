"use client";

import { DashboardAnalytics } from "@/types/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface PriorityChartProps {
  data: DashboardAnalytics["priorityDistribution"];
}

const COLORS: Record<string, string> = {
  LOW: "var(--color-low, #94a3b8)",
  MEDIUM: "var(--color-medium, #f59e0b)",
  HIGH: "var(--color-high, #ef4444)",
};

const FORMATTED_NAMES: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function PriorityChart({ data }: PriorityChartProps) {
  const validData = data.filter(d => d.count > 0).map(d => ({
    ...d,
    name: FORMATTED_NAMES[d.priority] || d.priority
  }));

  // Ensure logical ordering
  const order = ["Low", "Medium", "High"];
  validData.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm border rounded-xl bg-card">
        No task data available for priority distribution.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-6 bg-card shadow-sm h-[400px] flex flex-col">
      <h3 className="font-semibold mb-6">Task Priority Distribution</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={validData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)'
              }}
              formatter={(value: unknown) => [`${value} Tasks`, "Count"]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {validData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.priority] || "#94a3b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
