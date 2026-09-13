"use client";

import { useState, useEffect, useCallback } from "react";
import { ActivityTimeline } from "./activity-timeline";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TaskActivityList({ projectId, taskId }: { projectId: string; taskId: string }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}/activity?pageSize=5`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.data);
      }
    } catch (error) {
      console.error("Failed to load task activity", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, taskId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Recent Activity</h3>
      {isLoading ? (
        <div className="text-sm text-muted-foreground animate-pulse">Loading activity...</div>
      ) : (
        <ActivityTimeline activities={activities} />
      )}
      <div className="pt-2">
        <Link href={`/dashboard/projects/${projectId}/activity`}>
          <Button variant="link" className="px-0 text-muted-foreground">
            View full project activity &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
