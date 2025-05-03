"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Circle } from "lucide-react";

interface SettingsHeaderProps {
  title: string;
}

export default function SettingsHeader({ title }: SettingsHeaderProps) {
  const router = useRouter();
  return (
    <header className="flex items-center space-x-2 p-4 border-b">
      <button onClick={() => router.back()} aria-label="Back">
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>
      <Circle className="h-2 w-2 text-gray-700" />
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}