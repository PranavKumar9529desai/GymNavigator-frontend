import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 5, // 5 minutes
			staleTime: 1000 * 60, // Reduce to 1 minute for more frequent updates
			refetchOnWindowFocus: true, // Enable refetch on window focus

			refetchOnMount: true, // Enable refetch when component mounts
			refetchOnReconnect: true, // Enable refetch on network reconnect
		},
	},
});

// Helper function to invalidate multiple queries
export const invalidateQueries = (queryKeys: string[]) => {
	for (const key of queryKeys) {
		queryClient.invalidateQueries({ queryKey: [key] });
	}
};
