"use client";

import { useState, useEffect } from "react";
import { ActivityTimeline } from "./activity-timeline";
import { ActivityItemData } from "./activity-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TaskActivityList({ projectId, taskId }: { projectId: string; taskId: string }) {
  const [activities, setActivities] = useState<ActivityItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchActivity = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}/activity?pageSize=5`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setActivities(data.data || []);
        }
      } catch (error) {
        console.error("Failed to load task activity", error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchActivity();

    return () => {
      ignore = true;
    };
  }, [projectId, taskId]);

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
