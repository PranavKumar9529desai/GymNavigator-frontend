"use client";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import CompactSearchBar from "./CompactSearchBar";
import FullTopBar from "./FullTopBar";

export default function TopBar() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const scrollContainer = document.querySelector(".scroll-container");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      setIsCompact(scrollTop > 50);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers for the buttons
  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  const handleQRCodeClick = () => {
    console.log("QR Code clicked");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out",
        "transform-gpu bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 ",
        isCompact ? "h-16" : "h-[160px]"
      )}
    >
      <div className="max-w-7xl mx-auto h-full relative flex flex-col justify-center px-6">
        {/* Full Top Bar */}
        <div
          className={cn(
            "transition-all duration-300",
            isCompact ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <FullTopBar
            onNotificationClick={handleNotificationClick}
            onQRCodeClick={handleQRCodeClick}
            onProfileClick={handleProfileClick}
          />
        </div>

        {/* Compact Search Bar */}
        <CompactSearchBar
          isCompact={isCompact}
          onNotificationClick={handleNotificationClick}
          onQRCodeClick={handleQRCodeClick}
          onProfileClick={handleProfileClick}
        />
      </div>
    </header>
  );
}
