import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GymNavigator Admin',
  description: 'Admin dashboard for GymNavigator',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://admin.gymnavigator.in'),
};

// Prevent static generation for the entire common route group
export const dynamic = 'force-dynamic';

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
