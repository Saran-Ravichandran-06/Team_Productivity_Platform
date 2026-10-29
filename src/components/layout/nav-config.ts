import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface UserProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

