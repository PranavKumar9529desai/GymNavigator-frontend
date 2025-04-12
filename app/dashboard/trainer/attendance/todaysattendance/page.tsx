export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import UserAttendance from './UserAttendance';
import { TodayAttendance } from './getTodayAttendance';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { queryClient } from '@/app/queryClient';
import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default async function AttendancePage() {
	await queryClient.prefetchQuery({
		queryKey: ['todays-attendance'],
		queryFn: TodayAttendance,
		staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
	});

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<UserAttendance />
			</HydrationBoundary>
		</Suspense>
	);
}
