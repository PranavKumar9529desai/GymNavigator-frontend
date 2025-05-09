import { QueryClient } from '@tanstack/react-query';
// Use this queryclient configurations every time you need to use the queryclient
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 5,
			staleTime: 1000 * 60,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		},
	},
});
