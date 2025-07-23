'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

interface PostHogProviderProps {
	children: React.ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
	useEffect(() => {
		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		if (!posthogKey) {
			console.warn('PostHog key is not set');
			return;
		}
		posthog.init(posthogKey, {
			api_host: '/ingest',

			ui_host: 'https://us.posthog.com',
			defaults: '2025-05-24',
			capture_exceptions: true,
			debug: process.env.NODE_ENV === 'development',
		});
	}, []);

	return <PHProvider client={posthog}>{children}</PHProvider>;
}
