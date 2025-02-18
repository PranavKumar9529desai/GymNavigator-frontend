"use client";

import BottomNavigation from "@/components/common/Bottomnavigation/bottomnavigation";
import type { MenuItem } from "./menuItems";

interface DashboardBottomNavProps {
  menuItems: MenuItem[];
}

export default function DashboardBottomNav({
  menuItems,
}: DashboardBottomNavProps) {
  return <BottomNavigation menuItems={menuItems} />;
}
