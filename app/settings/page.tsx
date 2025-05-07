"use client";

import { ReactElement, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { settingsMenuItems, Role, MenuItem } from "./menuitems";
import SettingsHeader from "./SettingsHeader";

export default function SettingsIndexPage(): ReactElement {
  const { data: session } = useSession();
  const role = session?.role as Role;
  
  // Use memoization to prevent unnecessary recalculation of menu items
  const items: MenuItem[] = useMemo(() => {
    return settingsMenuItems[role] || [];
  }, [role]);

  return (
    <section className="max-w-4xl mx-auto px-4 pb-20 md:pb-6">
      <SettingsHeader title="Settings" />
      <nav aria-label="Settings navigation">
        <ul className="py-6 space-y-4">
          {items.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className="block">
                <div className="flex items-center gap-4 py-4 px-5 min-h-[56px] hover:bg-gray-50 transition-colors border-b border-gray-100">
                  {item.icon && (
                    <div className="flex-shrink-0 w-6 h-6 text-gray-600">
                      {item.icon}
                    </div>
                  )}
                  <span className="text-base md:text-lg font-medium text-gray-800">{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
