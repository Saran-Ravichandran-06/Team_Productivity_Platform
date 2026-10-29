"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { useSidebar } from "./sidebar-context";

interface UserProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

interface MobileTopBarProps {
  user: UserProfile;
}

export function MobileTopBar({ user }: MobileTopBarProps) {
  const { openMobile } = useSidebar();

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

  return (
    <header className="lg:hidden h-16 border-b border-border bg-card/95 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openMobile}
          aria-label="Open navigation menu"
          className="p-2 -ml-1 rounded-lg text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/dashboard" className="flex items-baseline gap-2">
          <span
            className="text-2xl font-black tracking-tight text-foreground font-brand italic leading-none"
            style={{
              fontFamily: "'Times New Roman MT', 'Times New Roman', Times, serif",
              fontStyle: "italic",
              fontWeight: 900,
            }}
          >
            KNOVA
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/notifications"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
        </Link>

        <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs shadow-xs">
          {userInitials}
        </div>
      </div>
    </header>
  );
}

