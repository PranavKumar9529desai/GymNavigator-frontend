import type React from 'react';
import BottomNavigation from './(common)/components/bottomNavigation';
import Sidebar from './(common)/components/sidebar';
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        <div className="hidden md:block h-screen">
          <Sidebar />
        </div>

        <div className="block lg:hidden">
          <BottomNavigation />
        </div>
        {/* Modified scroll container with added class */}
        <div className="w-full h-[95vh] md:h-screen overflow-y-auto scroll-container relative">
          <div className="min-h-[calc(100vh-4rem)]">{children}</div>
        </div>
      </div>
    </>
  );
}
