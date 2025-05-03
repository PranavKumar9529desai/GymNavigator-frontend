"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Circle } from "lucide-react";

interface SettingsHeaderProps {
  title: string;
}

export default function SettingsHeader({ title }: SettingsHeaderProps) {
  const router = useRouter();
  return (
    <header className="flex p-4 border-b bg-blue-700 text-white text-sm h-16 items-center">
      <button onClick={() => router.back()} aria-label="Back">
        <ChevronLeft className="h-5 w-5 text-white-700" />
      </button>
      <h1 className="text-base font-semibold ">{title}</h1>
    </header>
  );
}
