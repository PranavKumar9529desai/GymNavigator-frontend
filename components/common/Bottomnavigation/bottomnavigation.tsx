'use client';
import type { MenuItem as BaseMenuItem } from '@/app/dashboard/_components/menuItems';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useScrollDirection } from '../../../lib/hooks/useScrollDirection';

// Extend the MenuItem type to use iconName instead of icon
interface MenuItem extends Omit<BaseMenuItem, 'icon'> {
  iconName: string;
}

interface BottomNavigationProps {
  menuItems: MenuItem[];
  basePath?: string;
}

export default function BottomNavigation({ menuItems, basePath = '' }: BottomNavigationProps) {
  const isVisible = useScrollDirection(10, 100);
  const pathname = usePathname();
  const router = useRouter();

  // Function to get the icon component from its name
  const getIconComponent = (iconName: string): LucideIcon => {
    return (
      (LucideIcons as unknown as Record<string, LucideIcon>)[iconName] || LucideIcons.HelpCircle
    );
  };

  const isActiveRoute = (item: MenuItem) => {
    if (item.link && pathname.includes(item.link)) {
      return true;
    }
    return item.subItems?.some((sub) => pathname.includes(sub.link));
  };

  const handleNavClick = (item: MenuItem) => {
    if (item.subItems && item.subItems.length > 0) {
      // Navigate to the first subroute
      const firstSubItem = item.subItems[0];
      router.push(
        firstSubItem.link.startsWith('/') ? firstSubItem.link : `${basePath}${firstSubItem.link}`,
      );
    } else if (item.link) {
      router.push(item.link.startsWith('/') ? item.link : `${basePath}${item.link}`);
    }
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg pb-safe transform transition-all duration-300 ease-in-out',
        !isVisible && 'translate-y-full opacity-0',
        'supports-[height:100dvh]:bottom-[env(safe-area-inset-bottom)]',
      )}
    >
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {menuItems.map((item) => {
          const Icon = getIconComponent(item.iconName);
          const isActive = isActiveRoute(item);

          return (
            <button
              type="button"
              key={item.label}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-16 px-1',
                'hover:opacity-80 transition-all duration-200',
                isActive &&
                  'before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-10 before:h-0.5 before:bg-blue-600 before:rounded-full',
              )}
              onClick={() => handleNavClick(item)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavClick(item)}
              aria-label={item.name}
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <Icon
                  className={cn(
                    'h-6 w-6 transition-colors duration-200',
                    isActive ? 'text-blue-600' : 'text-gray-400',
                  )}
                />
                <span
                  className={cn(
                    'text-xs leading-none transition-colors duration-200 max-w-full truncate',
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-500',
                  )}
                >
                  {item.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
