"use client";
import { cn } from "@/lib/utils";
import {
  Bell,
  Building2,
  CalendarCheck,
  ClipboardList,
  Dumbbell,
  Home,
  QrCode,
  Search,
  UserCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { MenuItem, SubItem } from "../menuItems";

const iconMap = {
  Building2,
  CalendarCheck,
  ClipboardList,
  Dumbbell,
  Home,
  UserCheck,
  Users,
  UtensilsCrossed,
};

interface BottomSectionProps {
  className?: string;
  menuItems: MenuItem[];
}

export default function BottomSection({ className, menuItems }: BottomSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentSubItems, setCurrentSubItems] = useState<(SubItem & { parentIcon: string })[]>([]);

  useEffect(() => {
    const pathParts = pathname.split('/');
    const currentSection = pathParts[3];
    const currentMenuItem = menuItems.find(
      item => item.name.toLowerCase() === currentSection?.toLowerCase()
    );

    if (currentMenuItem) {
      setCurrentSubItems((currentMenuItem.subItems || []).map(subItem => ({
        ...subItem,
        parentIcon: currentMenuItem.iconName
      })));
    }
  }, [pathname, menuItems]);

  return (
    <div 
      className={cn(
        "px-4 transform-gpu transition-all duration-300 ease-in-out",
        currentSubItems.length > 0 ? "py-3" : "py-2",
        className
      )}
    >
      {/* Search Bar and Action Buttons Container */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="relative flex items-center bg-white/90 rounded-xl shadow-sm ring-1 ring-indigo-200/30">
            <Search className="absolute left-3 w-5 h-5 text-indigo-500/70" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder-indigo-400 border-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => console.log("QR Code clicked")}
            className="p-2.5 bg-white/90 hover:bg-white rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800 shadow-sm ring-1 ring-indigo-200/30 hover:shadow-md"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button 
            type="button"
            onClick={() => console.log("Notification clicked")}
            className="p-2.5 bg-white/90 hover:bg-white rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800 shadow-sm ring-1 ring-indigo-200/30 hover:shadow-md"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Only show if there are subroutes */}
      {currentSubItems.length > 0 && (
        <nav className="flex flex-col items-center gap-2 mt-3">
          {/* Icons Row */}
          <div className="flex justify-center gap-4 w-full relative pb-3">
            {currentSubItems.map((subItem) => {
              const IconComponent = iconMap[subItem.parentIcon as keyof typeof iconMap];
              const isActive = pathname === subItem.link;
              
              return (
                <div 
                  key={subItem.label} 
                  className="flex flex-col items-center w-28 transform-gpu transition-transform duration-200 ease-out"
                >
                  <button
                    type="button"
                    onClick={() => router.push(subItem.link)}
                    className={cn(
                      "w-12 h-12 rounded-xl transform-gpu transition-all duration-200 ease-out flex items-center justify-center hover:scale-105",
                      isActive
                        ? "bg-white text-gray-800 shadow-md ring-1 ring-gray-200/50" 
                        : "bg-white/80 text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm"
                    )}
                  >
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                  </button>
                  <span
                    className={cn(
                      "relative text-xs text-center mt-1.5 px-1 font-medium pb-2 transition-colors duration-200",
                      isActive
                        ? "text-gray-800 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-0.5 after:bg-gray-800 after:rounded-full after:transition-transform after:duration-200" 
                        : "text-gray-500"
                    )}
                  >
                    {subItem.name}
                  </span>
                </div>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
} 