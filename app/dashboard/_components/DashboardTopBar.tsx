'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import { 
  ClientDashboardMenuItems,
  type MenuItem,
  OwnerDashboardMenuItems, 
  TrainerDashboardMenuItems 
} from './menuItems';

export default function DashboardTopBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Determine which menu items to show based on user role
  let menuItems: MenuItem[] = ClientDashboardMenuItems; // Default
  
  if (session?.user?.role === 'owner') {
    menuItems = OwnerDashboardMenuItems;
  } else if (session?.user?.role === 'trainer') {
    menuItems = TrainerDashboardMenuItems;
  }

  return <TopBar menuItems={menuItems} userRole={session?.user?.role} />;
}
