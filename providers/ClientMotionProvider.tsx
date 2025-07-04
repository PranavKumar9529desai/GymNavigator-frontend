'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

interface ClientMotionProviderProps {
	children: ReactNode;
}

export default function ClientMotionProvider({
	children,
}: ClientMotionProviderProps) {
	return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
