"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { MenuItem, SubItem } from "../menuItems";
import BottomSection from "./BottomSection";
import TopSection from "./TopSection";

interface TopBarProps {
  menuItems: MenuItem[];
}

export default function TopBar({ menuItems }: TopBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSubItems, setCurrentSubItems] = useState<SubItem[]>([]);
  const pathname = usePathname();
  const TOP_SECTION_HEIGHT = 80;

  useEffect(() => {
    const scrollContainer = document.querySelector(".scroll-container");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      setIsScrolled(scrollTop >= TOP_SECTION_HEIGHT);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Find the current section based on URL path
    const pathParts = pathname.split("/");
    const currentSection = pathParts[3]; // dashboard/role/section

    // Find the menu item that matches the current section
    const currentMenuItem = menuItems.find(
      (item) => item.name.toLowerCase() === currentSection?.toLowerCase()
    );

    if (currentMenuItem) {
      setCurrentSubItems(currentMenuItem.subItems || []);
    }
  }, [pathname, menuItems]);

  return (
    <div className="relative">
      {/* Top Section - Scrolls naturally */}
      <TopSection className="h-20 bg-gradient-to-r from-indigo-50 to-white py-3 px-4" />

      {/* Bottom Section - Becomes fixed when TopSection is fully scrolled out */}
      <div
        className={cn(
          "w-full transition-all duration-300 border-b border-indigo-100",
          isScrolled
            ? "fixed top-0 left-0 right-0 z-50 shadow-sm backdrop-blur-md bg-gradient-to-r from-indigo-50/95 via-white/95 to-indigo-50/95"
            : "relative bg-gradient-to-r from-indigo-50/80 via-white/80 to-indigo-50/80"
        )}
      >
        <BottomSection
          className={cn(
            "transition-all duration-300",
            currentSubItems?.length > 0 ? "h-[6.5rem]" : "h-[4.5rem]"
          )}
          menuItems={menuItems}
        />
      </div>

      {/* Spacer to prevent content jump when BottomSection becomes fixed */}
      {isScrolled && (
        <div
          className={cn(
            "transition-all duration-300",
            currentSubItems?.length > 0 ? "h-[6.5rem]" : "h-[4.5rem]"
          )}
        />
      )}
    </div>
  );
}
