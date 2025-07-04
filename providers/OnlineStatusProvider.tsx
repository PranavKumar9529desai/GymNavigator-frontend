'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';

interface OnlineStatusContextType {
	isOnline: boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(
	undefined,
);

interface OnlineStatusProviderProps {
	children: ReactNode;
}

export function OnlineStatusProvider({ children }: OnlineStatusProviderProps) {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		// Set initial state based on navigator.onLine
		setIsOnline(navigator.onLine);

		// Event handlers for online/offline events
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		// Add event listeners
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		// Cleanup event listeners on unmount
		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	return (
		<OnlineStatusContext.Provider value={{ isOnline }}>
			{children}
		</OnlineStatusContext.Provider>
	);
}

export function useOnlineStatus(): boolean {
	const context = useContext(OnlineStatusContext);

	if (context === undefined) {
		throw new Error(
			'useOnlineStatus must be used within an OnlineStatusProvider',
		);
	}

	return context.isOnline;
}
