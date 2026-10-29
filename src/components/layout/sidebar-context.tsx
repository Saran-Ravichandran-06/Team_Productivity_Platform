"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  openMobile: () => void;
  closeMobile: () => void;
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  // Adjust mobile open state during render when pathname changes (official React pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }

  // Load persisted collapse state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("knova_sidebar_collapsed");
      if (stored !== null) {
        queueMicrotask(() => {
          setIsCollapsed(stored === "true");
        });
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count || 0);
      }
    } catch {
      // Ignore network errors in polling
    }
  }, []);

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
        // Ignore network errors in polling
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("knova_sidebar_collapsed", String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem("knova_sidebar_collapsed", String(collapsed));
    } catch {
      // Ignore storage errors
    }
  };

  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapse,
        setCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        openMobile,
        closeMobile,
        unreadCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
