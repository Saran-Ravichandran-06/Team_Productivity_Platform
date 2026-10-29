"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { signOut } from "next-auth/react";
import { NAV_ITEMS, UserProfile } from "./nav-config";

interface SidebarProps {
  user: UserProfile;
}

export function Sidebar({ user }: SidebarProps) {
  const { isCollapsed, toggleCollapse, unreadCount } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <aside
      aria-label="Application Sidebar"
      className={`hidden lg:flex flex-col h-screen sticky top-0 z-30 select-none bg-[#261B14] border-r border-[#3E2C22] text-[#F5EEE7] transition-[width] duration-300 ease-in-out shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* 1. Brand & Collapse Header */}
      <div
        className={`h-18 flex items-center border-b border-[#3E2C22]/80 shrink-0 ${
          isCollapsed ? "px-2.5 justify-between" : "px-4 justify-between"
        }`}
      >
        {!isCollapsed ? (
          <>
            <Link
              href="/dashboard"
              className="flex flex-col justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A] rounded px-1"
            >
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-[#EDE1D5] transition-colors font-brand italic leading-none">
                KNOVA
              </span>
              <span className="text-[11px] font-medium tracking-tight text-[#C5B3A5] font-switzer leading-tight mt-1">
                Plan.Collaborate.Deliver
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Collapse sidebar"
              aria-expanded={true}
              className="p-1.5 rounded-lg text-[#D1C2B5] hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A]"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A] rounded px-1 py-1"
              title="KNOVA Dashboard"
            >
              <span className="text-2xl font-black text-white group-hover:text-[#EDE1D5] transition-colors font-brand italic leading-none">
                K
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Expand sidebar"
              aria-expanded={false}
              className="p-1.5 rounded-lg text-[#D1C2B5] hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A]"
              title="Expand sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Primary Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A] ${
                  isActive
                    ? "bg-[#4B3428] text-white shadow-xs font-semibold"
                    : "text-[#D1C2B5] hover:text-white hover:bg-white/5"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                {/* Active Indicator Accent Bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#A0785A] rounded-r-full"
                    aria-hidden="true"
                  />
                )}

                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-[#F5EEE7]" : "text-[#BBAAA0] group-hover:text-white"
                  }`}
                  aria-hidden="true"
                />

                {!isCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}

                {/* Notifications unread badge */}
                {item.name === "Notifications" && unreadCount > 0 && (
                  <>
                    {!isCollapsed ? (
                      <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#A0785A] text-white shadow-xs">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : (
                      <span
                        className="absolute top-2 right-2 size-2 rounded-full bg-[#A0785A] ring-2 ring-[#261B14]"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </Link>

              {/* Accessible Floating Tooltip when Collapsed */}
              {isCollapsed && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-[#211A16] border border-[#4B3428] text-white text-xs font-medium rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 flex items-center gap-2"
                >
                  <span>{item.name}</span>
                  {item.name === "Notifications" && unreadCount > 0 && (
                    <span className="bg-[#A0785A] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 3. Bottom User Account Section */}
      <div className="p-3 border-t border-[#3E2C22]/80 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            {/* User Avatar Initials */}
            <div className="size-9 rounded-full bg-[#4B3428] border border-[#A0785A]/40 text-[#F5EEE7] flex items-center justify-center font-semibold text-xs shrink-0 shadow-xs">
              {userInitials}
            </div>

            {/* User Name & Email */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {user.name || "User"}
              </p>
              <p className="text-xs text-[#A8988C] truncate mt-0.5 leading-tight">
                {user.email}
              </p>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 rounded-lg text-[#D1C2B5] hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A] shrink-0"
              title="Sign out of workspace"
              aria-label="Sign out of workspace"
            >
              <LogOut className={`h-4 w-4 ${isLoggingOut ? "animate-pulse" : ""}`} />
            </button>
          </div>
        ) : (
          <div className="relative group flex justify-center py-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="size-10 rounded-full bg-[#4B3428] border border-[#A0785A]/40 text-[#F5EEE7] flex items-center justify-center font-semibold text-xs hover:ring-2 hover:ring-[#A0785A] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0785A]"
              aria-label={`Logged in as ${user.email}. Click to sign out.`}
            >
              {userInitials}
            </button>

            {/* Tooltip on Collapsed User Avatar */}
            <div
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-[#211A16] border border-[#4B3428] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50"
            >
              <p className="font-semibold text-white">{user.name || "User"}</p>
              <p className="text-[#A8988C] text-[11px] mt-0.5">{user.email}</p>
              <p className="text-[#A0785A] text-[10px] mt-1 font-medium">Click avatar to logout</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

