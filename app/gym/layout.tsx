import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gyms | GymNavigator Admin',
  description: 'View and manage gyms in GymNavigator',
};

export default function GymLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
