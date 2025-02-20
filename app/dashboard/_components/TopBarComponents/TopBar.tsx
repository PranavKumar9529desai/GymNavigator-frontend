"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Headroom from "react-headroom";
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
    const pathParts = pathname.split("/");
    const currentSection = pathParts[3];

    const currentMenuItem = menuItems.find(
      (item) => item.name.toLowerCase() === currentSection?.toLowerCase()
    );

    if (currentMenuItem) {
      setCurrentSubItems(currentMenuItem.subItems || []);
    }
  }, [pathname, menuItems]);

  return (
    <div className="relative">
      <Headroom
        style={{
          WebkitTransform: "translateY(0)",
          msTransform: "translateY(0)",
          transform: "translateY(0)",
        }}
        className="z-50"
      >
        <div className="transform-gpu transition-all duration-300 ease-in-out opacity-100 translate-y-0">
          <TopSection className="h-20 bg-gradient-to-r from-indigo-100 to-indigo-50/90 py-3 px-4" />
        </div>

        <div
          className={cn(
            "w-full transform-gpu transition-all duration-300 ease-in-out border-b border-indigo-200",
            isScrolled
              ? "fixed top-0 left-0 right-0 z-50 shadow-sm backdrop-blur-md bg-gradient-to-r from-indigo-100/95 via-indigo-50/95 to-indigo-100/95 opacity-100 translate-y-0"
              : "relative bg-gradient-to-r from-indigo-100/90 via-indigo-50/90 to-indigo-100/90"
          )}
        >
          <BottomSection
            className={cn(
              "transition-all duration-300 ease-in-out",
              currentSubItems?.length > 0 ? "h-[9.5rem]" : "h-[4.5rem]"
            )}
            menuItems={menuItems}
          />
        </div>
      </Headroom>

      {isScrolled && (
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            currentSubItems?.length > 0 ? "h-[6.5rem]" : "h-[4.5rem]"
          )}
          style={{
            willChange: "height",
          }}
        />
      )}
    </div>
  );
}
