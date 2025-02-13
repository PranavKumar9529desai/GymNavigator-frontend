import type React from 'react';
import BottomNavigation from './(common)/components/bottomNavigation';
import Sidebar from './(common)/components/sidebar';
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex ">
        <div className="hidden md:block h-screen ">
          <Sidebar />
        </div>

        <div className="block lg:hidden">
          <BottomNavigation />
        </div>
        {/* another componenth */}
        <div className="w-full h-[85vh] md:h-screen overflow-auto  ">
          {children}
        </div>
      </div>
    </>
  );
}
