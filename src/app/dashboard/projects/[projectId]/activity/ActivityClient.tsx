"use client";

import { useState, useEffect } from "react";
import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { ActivityItemData } from "@/components/activity/activity-item";
import { Button } from "@/components/ui/button";

export function ActivityClient({ projectId }: { projectId: string }) {
  const [activities, setActivities] = useState<ActivityItemData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadActivity = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}/activity?page=${currentPage}&pageSize=20`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setActivities(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Failed to load activity", error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadActivity();

    return () => {
      ignore = true;
    };
  }, [projectId, currentPage]);

  return (
    <div className="w-full py-2">
      <div className="flex justify-start mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Project Activity</h2>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 animate-pulse text-muted-foreground">Loading activity timeline...</div>
      ) : (
        <div className="border rounded-xl p-6 bg-card shadow-sm max-h-[calc(100vh-350px)] overflow-y-auto">
          <ActivityTimeline activities={activities} />
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground flex items-center">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
