'use client';
import type { ReactNode } from 'react';

interface ClientLayoutProps {
	children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
	return children;
}
