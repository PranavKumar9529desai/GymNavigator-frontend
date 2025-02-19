"use client";
import { cn } from "@/lib/utils";
import { Bell, Building2, CalendarCheck, ClipboardList, Dumbbell, Home, QrCode, Search, UserCheck, Users, UtensilsCrossed } from "lucide-react";
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
  const [, setActiveSection] = useState('');
  const [currentSubItems, setCurrentSubItems] = useState<(SubItem & { parentIcon: string })[]>([]);

  useEffect(() => {
    // Find the current section based on URL path
    const pathParts = pathname.split('/');
    const currentSection = pathParts[3]; // dashboard/role/section
    const currentSubRoute = pathParts[4]; // Possible subroute
    
    // Find the menu item that matches the current section
    const currentMenuItem = menuItems.find(
      item => item.name.toLowerCase() === currentSection?.toLowerCase()
    );

    if (currentMenuItem) {
      // If we're on a subroute, set it as active
      if (currentSubRoute && currentMenuItem.subItems) {
        const activeSubItem = currentMenuItem.subItems.find(
          subItem => subItem.link.toLowerCase().includes(currentSubRoute.toLowerCase())
        );
        if (activeSubItem) {
          setActiveSection(activeSubItem.link);
        } else {
          setActiveSection(currentMenuItem.link || '');
        }
      } else {
        setActiveSection(currentMenuItem.link || '');
      }

      // Always update subitems when section or subroute changes
      setCurrentSubItems((currentMenuItem.subItems || []).map(subItem => ({
        ...subItem,
        parentIcon: currentMenuItem.iconName
      })));
    }
  }, [pathname, menuItems]);

  return (
    <div className={cn(
      "px-4 transition-all duration-300",
      currentSubItems.length > 0 ? "py-3" : "py-2",
      className
    )}>
      {/* Search Bar Row with Action Buttons */}
      <div className="flex items-center gap-4  rounded-xl p-1 shadow-sm ring-1 ring-indigo-100/20">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/70" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 placeholder-indigo-300 border-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 px-2">
          <button 
            type="button"
            onClick={() => console.log("QR Code clicked")}
            className="p-2.5 hover:bg-white/90 rounded-lg transition-colors"
          >
            <QrCode className="w-5 h-5 " />
          </button>
          <button 
            type="button"
            onClick={() => console.log("Notification clicked")}
            className="p-2.5 hover:bg-white/90 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 " />
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Only show if there are subroutes */}
      {currentSubItems.length > 0 && (
        <nav className="flex flex-col items-center gap-2 mt-3">
          {/* Icons Row */}
          <div className="flex justify-center gap-4 w-full">
            {currentSubItems.map((subItem) => {
              const IconComponent = iconMap[subItem.parentIcon as keyof typeof iconMap];
              return (
                <div key={subItem.label} className="flex flex-col items-center w-28">
                  <button
                    type="button"
                    onClick={() => router.push(subItem.link)}
                    className={cn(
                      "w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center hover:bg-white/90",
                      pathname === subItem.link
                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200/50" 
                        : "bg-white/60  hover:text-indigo-600"
                    )}
                  >
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                  </button>
                  <span
                    className={cn(
                      "text-xs text-center mt-1.5 px-1 font-medium",
                      pathname === subItem.link
                        ? "text-indigo-700" 
                        : ""
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