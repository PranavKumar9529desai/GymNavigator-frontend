"use client";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface TopSectionProps {
  className?: string;
}

export default function TopSection({ className }: TopSectionProps) {
  return (
    <div className={cn("px-4 flex items-center justify-between", className)}>
      {/* Logo Section with Title and Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600" />
        <div className="flex flex-col">
          <span className="font-semibold text-lg leading-tight">GymNavigator</span>
          <span className="text-sm text-gray-600">Gym Manager</span>
        </div>
      </div>

      {/* Profile Button */}
      <button 
        type="button"
        onClick={() => console.log("Profile clicked")}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <User className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
} 