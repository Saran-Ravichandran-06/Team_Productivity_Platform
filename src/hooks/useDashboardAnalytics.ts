import { useState, useEffect, useCallback } from "react";
import { DashboardAnalytics, DashboardRange } from "@/types/analytics";

export function useDashboardAnalytics(initialRange: DashboardRange = "30d") {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<DashboardRange>(initialRange);

  const fetchAnalytics = useCallback(async (selectedRange: DashboardRange) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/analytics?range=${selectedRange}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  const refresh = () => fetchAnalytics(range);

  return {
    data,
    isLoading,
    error,
    range,
    setRange,
    refresh
  };
}
