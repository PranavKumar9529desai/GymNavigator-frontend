'use client';

import { useSession } from 'next-auth/react';
import { Suspense } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';
import TopBar from './TopBar';
import { useDashboardMenu } from './use-dashboard-menu';
import type { Rolestype, GymInfo } from '@/types/next-auth';

interface UserSession {
	user: {
		name: string;
		email: string;
		id: string;
	};
	role: Rolestype;
	gym?: GymInfo;
}

export default function DashboardTopBar() {
	const { data: session, status } = useSession();

	// Use our optimized hook to get menu items - efficient and memoized
	const menuItems = useDashboardMenu(session?.role || 'client');

	return (
		<Suspense fallback={<Skeleton className="h-10 w-64 mx-auto " />}>
			<TopBar
				menuItems={menuItems}
				userRole={session?.role}
				status={status}
				sessionData={session as UserSession | undefined}
			/>
		</Suspense>
	);
}
