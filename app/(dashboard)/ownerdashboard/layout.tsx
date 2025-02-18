import type React from "react";
import BottomNavigation from "./(common)/components/bottomNavigation";
import Sidebar from "./(common)/components/sidebar";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        <div className="hidden md:block h-screen">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="w-full h-screen overflow-y-auto scroll-container relative pb-16 lg:pb-0">
          <div className="min-h-[calc(100vh-4rem)]">{children}</div>
        </div>

        {/* Bottom Navigation - positioned at the bottom */}
        <div className="block lg:hidden">
          <BottomNavigation />
        </div>
      </div>
    </>
  );
}
