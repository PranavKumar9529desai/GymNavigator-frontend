'use client';

import BottomNavigation from '@/components/common/Bottomnavigation/bottomnavigation';
import { useSession } from 'next-auth/react';
import {
	ClientDashboardMenuItems,
	type MenuItem,
	OwnerDashboardMenuItems,
	TrainerDashboardMenuItems,
} from './menuItems';

export default function DashboardBottomNav() {
	const { data: session } = useSession();

	// Determine which menu items to show based on user role
	let menuItems: MenuItem[] = ClientDashboardMenuItems; // Default

	if (session?.role === 'owner') {
		menuItems = OwnerDashboardMenuItems;
	} else if (session?.role === 'trainer') {
		menuItems = TrainerDashboardMenuItems;
	}

	return <BottomNavigation menuItems={menuItems} />;
}
