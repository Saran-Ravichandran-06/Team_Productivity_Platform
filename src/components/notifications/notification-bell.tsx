"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { getNotificationIcon, getNotificationLink, formatRelativeTime } from "@/lib/notification-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        fetch("/api/notifications?pageSize=5"),
        fetch("/api/notifications/unread-count")
      ]);
      
      if (notifRes.ok) {
        const data = await notifRes.json();
        setNotifications(data.data || []);
      }
      
      if (countRes.ok) {
        const countData = await countRes.json();
        setUnreadCount(countData.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Polling every 15 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      try {
        await fetch(`/api/notifications/${notification.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
    
    router.push(getNotificationLink(notification));
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
      <DropdownMenuTrigger 
        className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 font-medium">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{unreadCount} new</span>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <DropdownMenuItem 
                  key={notification.id}
                  className="p-3 cursor-pointer flex gap-3 items-start"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`mt-0.5 shrink-0 ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm leading-tight ${!notification.read ? 'font-medium' : 'text-muted-foreground'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-primary rounded-full shrink-0 mt-1.5" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <div className="p-2">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" className="w-full text-xs h-8" onClick={() => {}}>
              View all notifications
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
