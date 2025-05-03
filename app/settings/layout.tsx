"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { settingsMenuItems } from "./menuitems";
import DashboardBottomNav from "@/app/dashboard/_components/DashboardBottomNav";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading settings...</div>;
  }

  const role = session?.role as "owner" | "client" | "trainer";
  const menuItems = settingsMenuItems[role] || [];

  return (
    <>
      <div className="flex min-h-screen bg-white">
        <main className="flex-1 ">{children}</main>
      </div>
    </>
  );
}
