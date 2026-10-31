"use client";

import { ProjectStatus, ProjectPriority } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Search, X } from "lucide-react";

export function ProjectFilters() {
  const { search, setSearch, searchParams, setFilter, clearFilters } = useUrlFilters("search", 300);

  const currentStatus = searchParams.get("status") || "";
  const currentPriority = searchParams.get("priority") || "";

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px] max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
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
        
        <div className="flex flex-wrap gap-3">
          <select
            value={currentStatus}
            onChange={(e) => setFilter("status", e.target.value)}
            className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs"
          >
            <option value="">All Statuses</option>
            {Object.values(ProjectStatus).map((status) => (
              <option key={status} value={status}>{status.replace("_", " ")}</option>
            ))}
          </select>

          <select
            value={currentPriority}
            onChange={(e) => setFilter("priority", e.target.value)}
            className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs"
          >
            <option value="">All Priorities</option>
            {Object.values(ProjectPriority).map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          {(currentStatus || currentPriority || searchParams.get("search")) && (
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
    </div>
  );
}
