import BottomNavigation from './(common)/components/bottomNavigation';
import SidebarGym from './(common)/components/sidebar';
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block h-screen">
          <SidebarGym />
        </div>

        {/* Main content area */}
        <div className="w-full h-screen overflow-y-auto scroll-container relative pb-16 lg:pb-0">
          <div className="min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="block lg:hidden">
          <BottomNavigation />
        </div>
      </div>
    </>
  );
}
