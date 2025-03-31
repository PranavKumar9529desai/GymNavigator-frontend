import type { MenuItem } from '@/app/dashboard/_components/menuItems';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function findActiveMenuItem(
	menuItems: MenuItem[],
	pathname: string,
): MenuItem | undefined {
	return menuItems.find(
		(item) =>
			(item.link && pathname.includes(item.link)) ||
			item.subItems?.some((sub) => pathname.includes(sub.link)),
	);
}
