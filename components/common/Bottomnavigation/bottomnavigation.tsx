"use client";
import type {
  MenuItem,
  SubItem,
} from "@/app/(dashboard)/ownerdashboard/(common)/components/menuItems";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useScrollDirection } from "./useScrollDirection";

interface BottomNavigationProps {
  menuItems: MenuItem[];
  basePath?: string;
}

export default function BottomNavigation({
  menuItems,
  basePath = "",
}: BottomNavigationProps) {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const isVisible = useScrollDirection(10, 100);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveRoute = (item: MenuItem) => {
    if (item.link && pathname.includes(item.link)) {
      return true;
    }
    return item.subItems?.some((sub) => pathname.includes(sub.link));
  };

  const handleNavClick = (item: MenuItem) => {
    if (item.subItems) {
      setActiveRoute(activeRoute === item.label ? null : item.label);
    } else if (item.link) {
      router.push(
        item.link.startsWith("/") ? item.link : `${basePath}${item.link}`
      );
      setActiveRoute(null);
    }
  };

  // Add scroll listener to the main content area
  useEffect(() => {
    const scrollContainer = document.querySelector('.overflow-y-auto.relative');
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Force re-render on scroll
      setActiveRoute(prev => prev); 
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg pb-safe transform transition-all duration-200 ease-in-out",
          !isVisible && "translate-y-full opacity-0",
          "supports-[height:100dvh]:bottom-[env(safe-area-inset-bottom)]"
        )}
      >
        <div className="flex justify-around items-center h-14 px-2 max-w-md mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);

            return (
              <button
                type="button"
                key={item.label}
                className={cn(
                  "relative flex flex-col items-center justify-center w-14 h-14 px-1",
                  "hover:opacity-80 transition-all duration-200"
                )}
                onClick={() => handleNavClick(item)}
                onKeyDown={(e) => e.key === "Enter" && handleNavClick(item)}
                aria-label={item.name}
              >
                <div className="flex flex-col items-center justify-center">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200 mb-1",
                      isActive ? "text-blue-600" : "text-gray-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] leading-none transition-colors duration-200 max-w-full truncate",
                      isActive ? "text-blue-600 font-medium" : "text-gray-500"
                    )}
                  >
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {activeRoute && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => setActiveRoute(null)}
          onKeyDown={(e) => e.key === "Escape" && setActiveRoute(null)}
          role="presentation"
        >
          <dialog
            open
            className="fixed bottom-14 left-0 right-0 bg-white rounded-t-xl z-50 max-h-[70vh] overflow-y-auto transform transition-transform duration-300 ease-out m-0 p-0 w-full"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Escape" && setActiveRoute(null)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {menuItems.find((item) => item.label === activeRoute)?.name}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveRoute(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid gap-2">
                {menuItems
                  .find((item) => item.label === activeRoute)
                  ?.subItems?.map((subItem) => (
                    <div
                      key={subItem.label}
                      className="transform transition-all duration-200"
                    >
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start p-4 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => {
                          router.push(
                            subItem.link.startsWith("/")
                              ? subItem.link
                              : `${basePath}${subItem.link}`
                          );
                          setActiveRoute(null);
                        }}
                      >
                        <span>{subItem.name}</span>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}
