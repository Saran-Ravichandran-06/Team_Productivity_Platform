"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { signOut } from "next-auth/react";

interface UserProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

interface MobileDrawerProps {
  user: UserProfile;
}

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileDrawer({ user }: MobileDrawerProps) {
  const { isMobileOpen, closeMobile } = useSidebar();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count");
        if (res.ok && isMounted) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch {
        // Silent fail
      }
    };

    if (isMobileOpen) {
      fetchUnread();
    }
    return () => {
      isMounted = false;
    };
  }, [isMobileOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      window.location.href = "/login";
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

  if (!isMobileOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#261B14] border-r border-[#3E2C22] text-[#F5EEE7] shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
        {/* Brand & Close Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#3E2C22]/80 shrink-0">
          <Link
            href="/dashboard"
            onClick={closeMobile}
            className="flex flex-col justify-center"
          >
            <span
              className="text-2xl font-black tracking-tight text-white font-brand italic leading-none"
              style={{
                fontFamily: "'Times New Roman MT', 'Times New Roman', Times, serif",
                fontStyle: "italic",
                fontWeight: 900,
              }}
            >
              KNOVA
            </span>
            <span
              className="text-[11px] font-medium tracking-tight text-[#C5B3A5] font-switzer leading-tight mt-1"
              style={{ fontFamily: "'Switzer', sans-serif" }}
            >
              Plan.Collaborate.Deliver
            </span>
          </Link>

          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="p-2 rounded-lg text-[#D1C2B5] hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A] ${
                  isActive
                    ? "bg-[#4B3428] text-white shadow-xs font-semibold"
                    : "text-[#D1C2B5] hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#A0785A] rounded-r-full"
                    aria-hidden="true"
                  />
                )}

                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-[#F5EEE7]" : "text-[#BBAAA0]"
                  }`}
                  aria-hidden="true"
                />

                <span className="truncate flex-1">{item.name}</span>

                {item.name === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#A0785A] text-white shadow-xs">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Account Section */}
        <div className="p-3 border-t border-[#3E2C22]/80 shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="size-9 rounded-full bg-[#4B3428] border border-[#A0785A]/40 text-[#F5EEE7] flex items-center justify-center font-semibold text-xs shrink-0 shadow-xs">
              {userInitials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {user.name || "User"}
              </p>
              <p className="text-xs text-[#A8988C] truncate mt-0.5 leading-tight">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 rounded-lg text-[#D1C2B5] hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A] shrink-0"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className={`h-4 w-4 ${isLoggingOut ? "animate-pulse" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

