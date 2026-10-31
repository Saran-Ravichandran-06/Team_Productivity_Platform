"use client";

import { TASK_STATUS, TASK_PRIORITY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Search, X, PlusCircle } from "lucide-react";
import { TaskProjectMember } from "@/types/task";

type TaskFiltersProps = {
  members: TaskProjectMember[];
  viewMode: "list" | "board";
  onViewModeChange: (mode: "list" | "board") => void;
  onCreateTask?: () => void;
};

export function TaskFilters({ members, viewMode, onViewModeChange, onCreateTask }: TaskFiltersProps) {
  const { search, setSearch, searchParams, setFilter, clearFilters } = useUrlFilters("search", 300);

  const currentStatus = searchParams.get("status") || "";
  const currentPriority = searchParams.get("priority") || "";
  const currentAssignee = searchParams.get("assigneeId") || "";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      {/* Search & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        <div className="min-w-[180px] max-w-xs flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-white pl-8 pr-7 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {search && (
            <button 
              onClick={() => setSearch("")} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <select
          value={currentStatus}
          onChange={(e) => setFilter("status", e.target.value)}
          className="h-9 rounded-md border border-input bg-white px-2.5 py-1 text-sm shadow-xs"
        >
          <option value="">All Statuses</option>
          {Object.values(TASK_STATUS).map((status) => (
            <option key={status} value={status}>{status.replace("_", " ")}</option>
          ))}
        </select>

        <select
          value={currentPriority}
          onChange={(e) => setFilter("priority", e.target.value)}
          className="h-9 rounded-md border border-input bg-white px-2.5 py-1 text-sm shadow-xs"
        >
          <option value="">All Priorities</option>
          {Object.values(TASK_PRIORITY).map((priority) => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>

        <select
          value={currentAssignee}
          onChange={(e) => setFilter("assigneeId", e.target.value)}
          className="h-9 rounded-md border border-input bg-white px-2.5 py-1 text-sm shadow-xs"
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
            className="h-9 px-2 text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {/* View Switcher + Create Task Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex gap-1 bg-muted p-1 rounded-md">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${viewMode === "list" ? "bg-white shadow-xs font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("board")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${viewMode === "board" ? "bg-white shadow-xs font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Kanban
          </button>
        </div>

        {onCreateTask && (
          <Button size="sm" onClick={onCreateTask} className="h-9">
            <PlusCircle className="mr-1.5 h-4 w-4" /> Create Task
          </Button>
        )}
      </div>
    </div>
  );
}
