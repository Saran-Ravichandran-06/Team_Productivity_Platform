import type { TaskPriorityType } from "@/lib/constants";
import { PriorityBadge } from "@/components/ui/priority-badge";

export function TaskPriorityBadge({ priority, className }: { priority: TaskPriorityType; className?: string }) {
  return <PriorityBadge priority={priority} className={className} />;
}
