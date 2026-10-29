import { useState, useEffect, useCallback } from "react";
import { DashboardAnalytics, DashboardRange } from "@/types/analytics";

export function useDashboardAnalytics(initialRange: DashboardRange = "30d") {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<DashboardRange>(initialRange);

  useEffect(() => {
    let ignore = false;

    const loadAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/dashboard/analytics?range=${range}`);
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const json = await response.json();
        if (!ignore) {
          setData(json);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "An unknown error occurred";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      ignore = true;
    };
  }, [range]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/analytics?range=${range}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const json = await response.json();
      setData(json);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  return {
    data,
    isLoading,
    error,
    range,
    setRange,
    refresh
  };
}
