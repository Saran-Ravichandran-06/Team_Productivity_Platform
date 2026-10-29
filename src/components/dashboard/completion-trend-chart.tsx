"use client";

import { DashboardAnalytics } from "@/types/analytics";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CompletionTrendChartProps {
  data: DashboardAnalytics["completionTrend"];
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm border rounded-xl bg-card">
        No task completion data available for this range.
      </div>
    );
  }

  // Format dates for the X-axis (e.g., "Sep 12")
  const formattedData = data.map(d => {
    const dateObj = new Date(d.date);
    return {
      ...d,
      displayDate: dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };
  });

  return (
    <div className="border rounded-xl p-6 bg-card shadow-sm h-[400px] flex flex-col">
      <h3 className="font-semibold mb-6">Tasks Completed Over Time</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-done, #22c55e)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-done, #22c55e)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
              tickLine={false} 
              axisLine={false}
              minTickGap={20}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fill: "var(--muted-foreground)" }} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)'
              }}
              labelStyle={{ color: 'var(--foreground)', fontWeight: '500', marginBottom: '4px' }}
              formatter={(value: unknown) => [`${value} Completed`, "Tasks"]}
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stroke="var(--color-done, #22c55e)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCompleted)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
