import { queryClient } from '@/lib/getQueryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { type AttendanceData, fetchAttendanceData } from './_actions/get-attendance';
import CalendarSkeleton from './_components/CalendarSkeleton';
import MonthAttendance from './_components/MonthAttendance';

export const metadata: Metadata = {
  title: 'Attendance History | GymNavigator',
  description:
    'View and track your gym attendance history with detailed calendar view and progress statistics.',
};

export default async function ViewAttendancePage() {
  // Get cached data if available
  const cachedData = queryClient.getQueryData<AttendanceData>(['attendanceDays']);

  // If no cached data, prefetch it
  if (!cachedData) {
    await queryClient.prefetchQuery({
      queryKey: ['attendanceDays'],
      queryFn: fetchAttendanceData,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  }

  // Get the data after prefetching (if it was needed)
  const initialData = queryClient.getQueryData<AttendanceData>(['attendanceDays']);
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="py-4">
      {/* <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent text-center">
          Gym Attendance
        </h1>
      </header> */}

      <section className="">
        <Suspense fallback={<CalendarSkeleton />}>
          <HydrationBoundary state={dehydratedState}>
            <MonthAttendance initialData={initialData?.attendanceDays} />
          </HydrationBoundary>
        </Suspense>
      </section>
    </main>
  );
}
