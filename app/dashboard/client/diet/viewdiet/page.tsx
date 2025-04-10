import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from '@tanstack/react-query';
import { Leaf, UtensilsCrossed } from 'lucide-react';

export const dynamic = 'force-dynamic';

import { fetchTodaysDiet } from './_actions/get-todays-diet';
import TodaysDiet from './_components/todays-diet';

export default async function ViewDietPage() {
	const queryClient = new QueryClient();

	// Prefetch the data on the server
	await queryClient.prefetchQuery({
		queryKey: ['todaysDiet'],
		queryFn: fetchTodaysDiet,
	});

	return (
		<div className="mx-auto px-2 py-3">
			<div className="flex items-center justify-center mb-4">
				<div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-2 mr-2 shadow-sm">
					<UtensilsCrossed size={20} className="text-white" />
				</div>
				<h1 className="text-xl font-bold text-gray-900">Today's Diet Plan</h1>
			</div>
			
			<div className="bg-gray-50 rounded-lg p-3">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<TodaysDiet />
				</HydrationBoundary>
			</div>
			
			<div className="mt-4 text-center text-[10px] text-gray-500 flex items-center justify-center">
				<Leaf size={12} className="text-emerald-500 mr-1" />
				<span>Updated daily based on your fitness goals</span>
			</div>
		</div>
	);
}
