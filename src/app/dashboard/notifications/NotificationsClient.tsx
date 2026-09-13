"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getNotificationIcon, getNotificationLink, formatRelativeTime } from "@/lib/notification-utils";
import Link from "next/link";

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async (page: number, unreadOnly: boolean, background = false) => {
    if (!background) setIsLoading(true);
    try {
      const res = await fetch(`/api/notifications?page=${page}&pageSize=20${unreadOnly ? "&unread=true" : ""}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      if (!background) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, filter === "unread");
    
    // Polling every 15 seconds if on page 1
    const interval = setInterval(() => {
      if (pagination.page === 1) {
        fetchNotifications(1, filter === "unread", true);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchNotifications, filter, pagination.page]);

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "PATCH" });
      if (res.ok) {
        // Optimistically update
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        if (filter === "unread") {
          fetchNotifications(1, true); // Refresh, should be empty
        }
      }
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        if (filter === "unread") {
          // If viewing unread, remove it visually or just leave it marked as read (which it is now)
          // Doing nothing makes it gray out, which is good feedback.
        }
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <div className="flex gap-4">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className="text-xs h-7"
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
              className="text-xs h-7"
            >
              Unread
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={!hasUnread}>
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 animate-pulse text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {filter === "unread" ? "You have no unread notifications." : "You have no notifications yet."}
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const link = getNotificationLink(notification);
              
              return (
                <div 
                  key={notification.id} 
                  className={`p-4 flex gap-4 transition-colors hover:bg-muted/50 ${!notification.read ? 'bg-primary/5' : ''}`}
                >
                  <div className={`mt-1 shrink-0 ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-muted-foreground'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 items-end shrink-0 ml-4">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => markAsRead(notification.id)}>
                        Mark read
                      </Button>
                    )}
                    {link !== "/dashboard/notifications" && (
                      <Link href={link} onClick={() => !notification.read && markAsRead(notification.id)}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          View details
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={pagination.page <= 1}
            onClick={() => fetchNotifications(pagination.page - 1, filter === "unread")}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchNotifications(pagination.page + 1, filter === "unread")}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
