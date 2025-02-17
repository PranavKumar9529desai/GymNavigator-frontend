import BottomNavigation from './(common)/components/bottomNavigation';
import SidebarGym from './(common)/components/sidebar';
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex ">
        {/* sidebarj*/}
        <div className="hidden lg:block">
          <SidebarGym />
        </div>

        <div className="block lg:hidden">
          <BottomNavigation />
        </div>
        {/* another componenth */}
        <div className="w-full lg:h-screen h-[80%] py-10 lg:py-2 overflow-auto border-4 ">
          {children}
        </div>
      </div>
    </>
  );
}
