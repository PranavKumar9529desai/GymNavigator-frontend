import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import NotificationButton from "./NotificationButton";
import QRCodeButton from "./QRCodeButton";
import SubrouteNav from "./SubrouteNav";
import UserMenuButton from "./UserMenuButton";

interface TopbarProps {
  gymName?: string;
  userRole?: string;
}

const Topbar: FC<TopbarProps> = ({ gymName = "Gym Navigator", userRole }) => {
  // Define subroutes with icons for better mobile navigation
  const subroutes = [
    { name: "Dashboard", href: "/dashboard", icon: "home" },
    { name: "Schedule", href: "/dashboard/subroute1", icon: "calendar" },
    { name: "Members", href: "/dashboard/subroute2", icon: "users" },
    { name: "Analytics", href: "/dashboard/subroute3", icon: "chart-bar" },
  ];

  return (
    <>
      <div className="w-full bg-white shadow-sm flex flex-col sticky top-0 z-10 px-4 py-2">
        {/* Top section with logo, name, and buttons */}
        <div className="h-12 md:h-16 flex items-center justify-between bg-white px-4">
          <div className="flex items-center space-x-3">
            <div className="relative h-9 w-9 rounded-md overflow-hidden shadow-sm">
              <Image
                src="/apple-touch-icon.png"
                alt="Gym Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">{gymName}</h1>
              {userRole && (
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <NotificationButton />
            <QRCodeButton />
            <UserMenuButton />
          </div>
        </div>

        {/* Subroute navigation with smooth animations */}
        <SubrouteNav subroutes={subroutes} />
      </div>
    </>
  );
};

export default Topbar;
