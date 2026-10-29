"use client";

import React from "react";
import { SidebarProvider } from "./sidebar-context";
import { Sidebar } from "./sidebar";
import { MobileDrawer } from "./mobile-drawer";
import { MobileTopBar } from "./mobile-top-bar";

interface UserProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

interface DashboardShellProps {
  user: UserProfile;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        {/* Desktop Collapsible Left Sidebar (Hidden on mobile/tablet) */}
        <Sidebar user={user} />

        {/* Mobile Slide-in Drawer (Visible when opened on < lg) */}
        <MobileDrawer user={user} />

        {/* Main Application Content Container */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          {/* Top header on mobile */}
          <MobileTopBar user={user} />

          {/* Main Page Area */}
          <div className="flex-1 min-w-0 flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

