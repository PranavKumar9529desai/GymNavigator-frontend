'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ClientSideProviderProps {
  children: React.ReactNode;
}

export default function ClientSideProvider({ children }: ClientSideProviderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session?.user) {
      const { role } = session.user;
      // Get the base path parts to check permissions
      const pathParts = pathname.split('/');
      if (pathParts.length >= 3 && pathParts[2] !== role) {
        // Redirect if user tries to access a dashboard they don't have permission for
        router.push(`/dashboard/${role}`);
      }
    }
  }, [session, pathname, router]);

  return <>{children}</>;
}
