import { queryClient } from '@/lib/getQueryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { SingleWorkout } from './_components/excercise';
import { GetExcerciseDetails } from './actions/get-excercise-details';

// Proper Next.js 15 page params type

// in next 15 params are return promise
export default async function Page({
	params,
}: {
	params: Promise<{ musclename: string; excercisename: string }>;
}) {
	// Direct access without await

	const { musclename, excercisename } = await params;

	await queryClient.prefetchQuery({
		queryKey: ['exercise', musclename, excercisename],
		queryFn: () => GetExcerciseDetails(musclename, excercisename),
	});

	const dehydratedState = dehydrate(queryClient);

	return (
		<main className="min-h-screen bg-gray-50">
			<HydrationBoundary state={dehydratedState}>
				<Suspense fallback={<LoadingSkeleton />}>
					<SingleWorkout />
				</Suspense>
			</HydrationBoundary>
		</main>
	);
}

// Moved loading UI to separate component
function LoadingSkeleton() {
	return (
		<div className="flex items-center justify-center min-h-[60vh]">
			<div className="relative">
				<div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
				<div className="mt-4 text-blue-600 font-medium">
					Loading exercise...
				</div>
			</div>
		</div>
	);
}
