import type { MenuItem, SubItem } from '@/app/dashboard/_components/menuItems';
import {
  ClientDashboardMenuItems,
  OwnerDashboardMenuItems,
  TrainerDashboardMenuItems,
} from '@/app/dashboard/_components/menuItems';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const getMenuItemsByRole = (role: 'owner' | 'trainer' | 'client') => {
  switch (role) {
    case 'owner':
      return OwnerDashboardMenuItems;
    case 'trainer':
      return TrainerDashboardMenuItems;
    case 'client':
      return ClientDashboardMenuItems;
    default:
      return [];
  }
};

const findActiveMenuItem = (pathname: string, menuItems: MenuItem[]): MenuItem | undefined => {
  const pathParts = pathname.split('/');
  const section = pathParts[3]; // dashboard/role/section
  return menuItems.find((item) => item.name.toLowerCase() === section?.toLowerCase());
};

const SubNavigation = () => {
  const pathname = usePathname();
  const role = pathname.split('/')[2] as 'owner' | 'trainer' | 'client';
  const menuItems = getMenuItemsByRole(role);
  const activeMenuItem = findActiveMenuItem(pathname, menuItems);

  if (!activeMenuItem?.subItems?.length) {
    return null;
  }

  return (
    <nav className="py-4">
      <ul className="flex gap-4 list-none p-0 m-0">
        {activeMenuItem.subItems.map((route) => (
          <li key={route.link}>
            <Link
              href={route.link}
              className={cn(
                'px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors',
                pathname === route.link && 'bg-gray-200 text-gray-900',
              )}
            >
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubNavigation;
