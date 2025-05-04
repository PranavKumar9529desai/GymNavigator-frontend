import React from "react";

interface SettingsSkeletonProps {
  count?: number;
}

export default function SettingsSkeleton({ count = 4 }: SettingsSkeletonProps) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, idx) => (
        <li key={idx}>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-200">
            <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  );
}
