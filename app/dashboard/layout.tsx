import type React from "react";
import { auth } from "../(auth)/auth";
import DashboardBottomNav from "./_components/DashboardBottomNav";
import Topbar from "./_components/TopBar";
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
      <div className="flex h-screen bg-gray-50">
        {/* Server-rendered sidebar - visible only on desktop */}
        <div className="hidden md:block h-screen">
          <Sidebar menuItems={getMenuItems()} />
        </div>
        <div className="w-full flex flex-col overflow-hidden">
          {/* Topbar with logo and subroute navigation - visible only on mobile */}
          <div className="md:hidden">
            <Topbar gymName="Gym Navigator" userRole={role} />
          </div>
          
          {/* Main content area with proper height calculations */}
          <div className="flex-1 overflow-y-auto scroll-container relative pb-16 md:pb-0">
            <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
              {children}
            </div>
          </div>
        </div>

        {/* Bottom navigation - visible only on mobile */}
        <div className="md:hidden">
          <DashboardBottomNav menuItems={getMenuItems()} />
        </div>
      </div>
    </>
  );
}
