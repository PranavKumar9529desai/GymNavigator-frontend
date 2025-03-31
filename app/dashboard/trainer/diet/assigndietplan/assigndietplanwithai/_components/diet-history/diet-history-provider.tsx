'use client';

import { useSession } from 'next-auth/react';
// biome-ignore lint/style/useImportType: <Diet hsitory provider need it>
import React from 'react';
import { createContext, useContext } from 'react';
import type { DietHistoryItem } from '../../_store/diet-view-store';
import { useDietHistoryQuery } from './use-diet-history';

// This provider is now a lightweight wrapper around React Query
// It's kept for backward compatibility
interface DietHistoryContextType {
	loading: boolean;
	history: DietHistoryItem[];
	error: string | null;
	refreshHistory: () => Promise<void>;
}

const DietHistoryContext = createContext<DietHistoryContextType>({
	loading: true,
	history: [],
	error: null,
	refreshHistory: async () => {},
});

export const useDietHistory = () => useContext(DietHistoryContext);

export function DietHistoryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session } = useSession();
	const userId = session?.user?.id || '';

	// Use the React Query hook
	const {
		data = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useDietHistoryQuery(userId);

	// Convert React Query state to the old interface for backward compatibility
	const contextValue = {
		loading: isLoading,
		history: data,
		error: isError
			? error instanceof Error
				? error.message
				: 'Error loading diet history'
			: null,
		refreshHistory: async () => {
			await refetch();
		},
	};

	return (
		<DietHistoryContext.Provider value={contextValue}>
			{children}
		</DietHistoryContext.Provider>
	);
}
