"use client";

import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Define icons for the navigation items
const iconMap: Record<string, JSX.Element> = {
  home: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
    </svg>
  ),
  "chart-bar": (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
    </svg>
  ),
};

interface SubrouteNavProps {
  subroutes: {
    name: string;
    href: string;
    icon: string;
  }[];
}

const SubrouteNav: React.FC<SubrouteNavProps> = ({ subroutes }) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  // Listen for scroll events to hide text labels when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
        if (showLabels) setShowLabels(false);
      } else {
        setIsScrolled(false);
        if (!showLabels) setShowLabels(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showLabels]);

  return (
    <nav className="overflow-x-auto scrollbar-hide border-t">
      <div className="h-14 flex items-center justify-around md:justify-center md:gap-8 px-1">
        {subroutes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`relative flex flex-col items-center justify-center h-full px-3 transition-all ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <div className="flex flex-col items-center">
                {/* Icon is always visible */}
                {iconMap[route.icon]}
                
                {/* Text label with smooth animation */}
                <AnimatePresence mode="wait">
                  {showLabels && (
                    <m.span
                      initial={{ opacity: 0, y: -5, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -5, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs mt-1 whitespace-nowrap"
                    >
                      {route.name}
                    </m.span>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Active indicator dot */}
              {isActive && (
                <m.div 
                  layoutId="activeRoute"
                  className="absolute bottom-0 w-1.5 h-1.5 bg-blue-600 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SubrouteNav;
