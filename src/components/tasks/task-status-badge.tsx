import type { TaskStatusType } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/status-badge";

export function TaskStatusBadge({ status, className }: { status: TaskStatusType; className?: string }) {
  return <StatusBadge status={status} className={className} />;
}
