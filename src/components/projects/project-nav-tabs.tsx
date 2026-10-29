"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList, CheckSquare, Users, Activity } from "lucide-react";

interface ProjectNavTabsProps {
  projectId: string;
}

export function ProjectNavTabs({ projectId }: ProjectNavTabsProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/projects/${projectId}`;

  const tabs = [
    {
      name: "Overview",
      href: basePath,
      icon: LayoutList,
      isActive: pathname === basePath,
    },
    {
      name: "Tasks",
      href: `${basePath}/tasks`,
      icon: CheckSquare,
      isActive: pathname.startsWith(`${basePath}/tasks`),
    },
    {
      name: "Members",
      href: `${basePath}/members`,
      icon: Users,
      isActive: pathname.startsWith(`${basePath}/members`),
    },
    {
      name: "Activity",
      href: `${basePath}/activity`,
      icon: Activity,
      isActive: pathname.startsWith(`${basePath}/activity`),
    },
  ];

  return (
    <nav
      aria-label="Project Sections"
      className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-none"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            aria-current={tab.isActive ? "page" : undefined}
            className={`flex items-center gap-2 whitespace-nowrap py-3.5 px-1 border-b-2 font-medium text-sm transition-colors ${
              tab.isActive
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-coffee-border/80"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

