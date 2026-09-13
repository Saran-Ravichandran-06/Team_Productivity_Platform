import { ActivityIcon } from "./activity-icon";

export function ActivityItem({ activity }: { activity: any }) {
  const date = new Date(activity.createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  return (
    <div className="flex gap-4">
      <div className="mt-1 bg-muted p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
        <ActivityIcon type={activity.type} className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none text-foreground break-words">
          {activity.description}
        </p>
        <p className="text-xs text-muted-foreground">
          {date}
        </p>
      </div>
    </div>
  );
}
