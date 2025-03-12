'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';
import TopBar from './TopBar';
import {
  ClientDashboardMenuItems,
  type MenuItem,
  OwnerDashboardMenuItems,
  TrainerDashboardMenuItems,
} from './menuItems';

export default function DashboardTopBar() {
  const { data: session, status } = useSession();

  // Determine which menu items to show based on user role
  let menuItems: MenuItem[] = ClientDashboardMenuItems; // Default

  if (session?.role === 'owner') {
    menuItems = OwnerDashboardMenuItems;
  } else if (session?.role === 'trainer') {
    menuItems = TrainerDashboardMenuItems;
  }

  return (
    <Suspense fallback={<Skeleton className="h-10 w-64 mx-auto" />}>
      <TopBar menuItems={menuItems} userRole={session?.role} status={status} />
    </Suspense>
  );
}
