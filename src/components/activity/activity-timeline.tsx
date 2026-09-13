import { ActivityItem } from "./activity-item";

export function ActivityTimeline({ activities }: { activities: any[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-10 border rounded-xl bg-card border-dashed">
        <p className="text-muted-foreground">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border-b last:border-0 pb-4 last:pb-0">
          <ActivityItem activity={activity} />
        </div>
      ))}
    </div>
  );
}
