'use client';
import { SessionProvider } from '@/node_modules/next-auth/react';
import type React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
	return <SessionProvider>{children}</SessionProvider>;
}
