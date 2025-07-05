'use client';

import type { MenuItem } from '@/app/dashboard/_components/menuItems';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface TopBarProps {
	menuItems: MenuItem[];
	basePath?: string;
}

export default function TopBar({ menuItems, basePath = '' }: TopBarProps) {
	const pathname = usePathname();
	const router = useRouter();

	// Find the active main menu item based on the current path
	const activeMenuItem = menuItems.find(
		(item) =>
			(item.link && pathname.includes(item.link)) ||
			item.subItems?.some((sub) => pathname.includes(sub.link)),
	);

	// Function to get the icon component from its name
	const getIconComponent = (iconName: string): LucideIcon => {
		return (
			(LucideIcons as unknown as Record<string, LucideIcon>)[iconName] ||
			LucideIcons.HelpCircle
		);
	};

	// If there's no active menu item or the item has no subitems, don't render the top bar
	if (
		!activeMenuItem ||
		!activeMenuItem.subItems ||
		activeMenuItem.subItems.length === 0
	) {
		return null;
	}

	const handleSubItemClick = (link: string) => {
		router.push(link.startsWith('/') ? link : `${basePath}${link}`);
	};

	return (
		<div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm ">
			<div className="overflow-x-auto scrollbar-hide">
				<div className="flex px-2 py-2 space-x-1 whitespace-nowrap">
					{activeMenuItem.subItems.map((subItem) => {
						const Icon = subItem.iconName
							? getIconComponent(subItem.iconName)
							: null;
						const isActive = pathname.includes(subItem.link);

						return (
							<button
								type="button"
								key={subItem.name}
								onClick={() => handleSubItemClick(subItem.link)}
								className={cn(
									'flex items-center px-3 py-2 text-sm rounded-full transition-colors',
									'hover:bg-gray-100',
									isActive
										? 'bg-blue-50 text-blue-600 font-medium'
										: 'text-gray-600',
								)}
							>
								{Icon && (
									<Icon
										className={cn(
											'mr-1.5 h-4 w-4',
											isActive ? 'text-blue-600' : 'text-gray-500',
										)}
									/>
								)}
								<span>{subItem.name}</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
