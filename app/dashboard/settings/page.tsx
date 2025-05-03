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
    <div className="max-w-md mx-auto p-4 border rounded-lg bg-white">
      <SettingsHeader title="Settings" />
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.path}>
            <Link href={item.path}>
              <p className="text-lg font-medium">{item.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
