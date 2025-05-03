"use client";

import { ReactElement } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { settingsMenuItems, Role, MenuItem } from "./menuitems";
import SettingsHeader from "./SettingsHeader";

export default function SettingsIndexPage(): ReactElement {
  const { data: session } = useSession();
  const role = session?.role as Role;
  const items: MenuItem[] = settingsMenuItems[role] || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <SettingsHeader title="Settings" />
        <ul className="p-6 space-y-3">
          {items.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                  {item.icon && (
                    <div className="flex-shrink-0 w-5 h-5 text-gray-600">
                      {item.icon}
                    </div>
                  )}
                  <span className="text-base font-medium text-gray-800">{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
