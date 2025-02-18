import type React from "react";
import { auth } from "../(auth)/auth";
import DashboardBottomNav from "./_components/DashboardBottomNav";
import {
  ClientDashboardMenuItems,
  OwnerDashboardMenuItems,
  TrainerDashboardMenuItems,
} from "./_components/menuItems";
import Sidebar from "./_components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side role detection
  const session = await auth();
  const role = session?.user?.role || session?.role;
  console.log("role from the layout", role);
  const getMenuItems = () => {
    switch (role) {
      case "owner":
        return OwnerDashboardMenuItems;
      case "trainer":
        return TrainerDashboardMenuItems;
      case "client":
        return ClientDashboardMenuItems;
      default:
        return [];
    }
  };

  return (
    <>
      <div className="flex">
        {/* Server-rendered sidebar - visible only on desktop */}
        <div className="hidden md:block h-screen ">
          <Sidebar menuItems={getMenuItems()} />
        </div>
        <div className="w-full">
          <div className="h-[95vh] md:h-screen overflow-y-auto scroll-container relative pb-16 lg:pb-0">
            {children}
          </div>
        </div>

        {/* Bottom navigation - visible only on mobile */}
        <div className="md:hidden ">
          <DashboardBottomNav menuItems={getMenuItems()} />
        </div>
      </div>
    </>
  );
}
