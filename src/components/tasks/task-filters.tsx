"use client";

import { TASK_STATUS, TASK_PRIORITY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Search, X } from "lucide-react";
import { TaskProjectMember } from "@/types/task";

type TaskFiltersProps = {
  members: TaskProjectMember[];
  viewMode: "list" | "board";
  onViewModeChange: (mode: "list" | "board") => void;
};

export function TaskFilters({ members, viewMode, onViewModeChange }: TaskFiltersProps) {
  const { search, setSearch, searchParams, setFilter, clearFilters } = useUrlFilters("search", 300);

  const currentStatus = searchParams.get("status") || "";
  const currentPriority = searchParams.get("priority") || "";
  const currentAssignee = searchParams.get("assigneeId") || "";

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px] max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-white pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {search && (
            <button 
              onClick={() => setSearch("")} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 bg-muted p-1 rounded-md">
          <button
            onClick={() => onViewModeChange("list")}
            className={`px-3 py-1 text-sm rounded-sm transition-colors ${viewMode === "list" ? "bg-white shadow-xs font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            List
          </button>
          <button
            onClick={() => onViewModeChange("board")}
            className={`px-3 py-1 text-sm rounded-sm transition-colors ${viewMode === "board" ? "bg-white shadow-xs font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Kanban
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={currentStatus}
          onChange={(e) => setFilter("status", e.target.value)}
          className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs"
        >
          <option value="">All Statuses</option>
          {Object.values(TASK_STATUS).map((status) => (
            <option key={status} value={status}>{status.replace("_", " ")}</option>
          ))}
        </select>

        <select
          value={currentPriority}
          onChange={(e) => setFilter("priority", e.target.value)}
          className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs"
        >
          <option value="">All Priorities</option>
          {Object.values(TASK_PRIORITY).map((priority) => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>

        <select
          value={currentAssignee}
          onChange={(e) => setFilter("assigneeId", e.target.value)}
          className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs"
        >
          <option value="">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {members.map((member) => (
            <option key={member.user.id} value={member.user.id}>
              {member.user.name}
            </option>
          ))}
        </select>

        {(currentStatus || currentPriority || currentAssignee || searchParams.get("search")) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-9"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
