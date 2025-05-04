"use client";

import Link from "next/link";
import { MenuItem } from "../menuitems";
import { cn } from "@/lib/utils";

interface SettingsMenuProps {
  items: MenuItem[];
}

export default function SettingsMenu({ items }: SettingsMenuProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.path}>
          <Link href={item.path} className="block">
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                "hover:bg-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            >
              {item.icon && (
                <span className="w-6 h-6 text-gray-600 flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span className="text-base font-medium text-gray-800">
                {item.label}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
