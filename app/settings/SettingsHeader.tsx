"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Circle } from "lucide-react";

interface SettingsHeaderProps {
  title: string;
}

export default function SettingsHeader({ title }: SettingsHeaderProps) {
  const router = useRouter();
  return (
    <header className="flex p-4 border-b bg-blue-700 text-white h-16 items-center sticky top-0 z-10">
      <button 
        onClick={() => router.back()} 
        aria-label="Go back"
        className="flex items-center justify-center min-h-[44px] min-w-[44px] -ml-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <h1 className="text-lg font-semibold ml-2 truncate" title={title}>{title}</h1>
    </header>
  );
}
