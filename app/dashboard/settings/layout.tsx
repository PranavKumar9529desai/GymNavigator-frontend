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
      <aside className="hidden md:block w-64 border-r bg-gray-50 p-4">
        <nav>
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <p className="block text-gray-700 hover:text-gray-900">
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 pb-16">{children}</main>
    </div>
    <div className="md:hidden">
      <DashboardBottomNav />
    </div>
  </>
);
}
