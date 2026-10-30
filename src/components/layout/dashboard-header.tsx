"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSidebar } from "./sidebar-context";
import { UserProfile } from "./nav-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  user: UserProfile;
}

interface PageMeta {
  title: string;
  description: string;
}

function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/dashboard") {
    return {
      title: "Dashboard",
      description: "Overview of your workspace, analytics, and team productivity.",
    };
  }

  if (pathname === "/dashboard/projects") {
    return {
      title: "Projects",
      description: "Manage, collaborate, and track progress on all your projects.",
    };
  }

  if (pathname === "/dashboard/notifications") {
    return {
      title: "Notifications",
      description: "Stay updated with your latest task activities and team alerts.",
    };
  }

  if (pathname === "/dashboard/settings") {
    return {
      title: "Settings",
      description: "Manage your personal profile and account preferences.",
    };
  }

  // Fallbacks for nested/child routes
  if (pathname === "/dashboard/projects/new") {
    return {
      title: "Create Project",
      description: "Set up a new project for your workspace.",
    };
  }

  if (pathname.includes("/tasks/")) {
    return {
      title: "Task Details",
      description: "View task specifications, assignees, and comments.",
    };
  }

  if (pathname.endsWith("/tasks")) {
    return {
      title: "Project Tasks",
      description: "Track, organize, and assign tasks across your team.",
    };
  }

  if (pathname.endsWith("/members")) {
    return {
      title: "Project Members",
      description: "Manage team members and project permissions.",
    };
  }

  if (pathname.endsWith("/activity")) {
    return {
      title: "Project Activity",
      description: "Real-time activity log and audit history for this project.",
    };
  }

  if (pathname.endsWith("/edit")) {
    return {
      title: "Edit Project",
      description: "Update project configuration and metadata.",
    };
  }

  if (pathname.startsWith("/dashboard/projects/")) {
    return {
      title: "Project Overview",
      description: "View and manage project tasks, members, and activity.",
    };
  }

  return {
    title: "Dashboard",
    description: "Overview of your workspace, projects, and activities.",
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openMobile, unreadCount } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { title, description } = getPageMeta(pathname);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email
    ? user.email[0].toUpperCase()
    : "U";

  const isNotificationsActive = pathname === "/dashboard/notifications";

  return (
    <header className="sticky top-0 z-20 w-full bg-white border-b border-[#E5E7EB] shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Toggle + Page Title & Description */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={openMobile}
            aria-label="Open sidebar menu"
            className="lg:hidden p-2 -ml-2 rounded-lg text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate leading-tight font-sans">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5 leading-snug">
              {description}
            </p>
          </div>
        </div>

        {/* Right Section: Bell Icon + User Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Bell Icon (opens notifications page) */}
          <Link
            href="/dashboard/notifications"
            aria-label="Open notifications page"
            className={`relative p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isNotificationsActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            }`}
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-in zoom-in-50">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile at the rightmost end */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-lg hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              aria-label="User profile options"
            >
              {/* Avatar circle */}
              <div className="size-9 rounded-full bg-[#4B3428] text-[#F5EEE7] flex items-center justify-center font-semibold text-xs shadow-xs shrink-0 select-none">
                {userInitials}
              </div>

              {/* Name & chevron (visible on tablet/desktop) */}
              <div className="hidden sm:flex flex-col items-start text-left min-w-0 max-w-[140px]">
                <span className="text-sm font-medium text-foreground truncate leading-tight">
                  {user.name || "User"}
                </span>
                <span className="text-[11px] text-muted-foreground truncate leading-tight">
                  {user.email || ""}
                </span>
              </div>

              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-56 bg-white border border-[#E5E7EB] shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none truncate">
                    {user.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/notifications")}
                  className="cursor-pointer"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded-full font-medium">
                      {unreadCount}
                    </span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="destructive"
                className="cursor-pointer text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

