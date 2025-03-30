import { queryClient } from '@/lib/getQueryClient';
export const dynamic = 'force-dynamic';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { type MuscleGroup, fetchMuscles } from './_actions/get-muscles';
import { Allworkouts } from './_components/allworkouts';

export const metadata: Metadata = {
  title: 'All Workouts | Gym Navigator',
  description:
    'Explore our comprehensive collection of workouts organized by muscle groups. Find exercises tailored to your fitness goals.',
};

export default async function AllWorkoutsPage() {
  // Get cached data if available
  const cachedData = queryClient.getQueryData<{ muscles: MuscleGroup[] }>(['muscles']);

  console.log('cached data is this ', cachedData);
  // If no cached data, prefetch it
  if (!cachedData || !cachedData.muscles) {
    await queryClient.prefetchQuery({
      queryKey: ['muscles'],
      queryFn: fetchMuscles,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  }

  // Get the data after prefetching (if it was needed)
  const initialData = queryClient.getQueryData<{ muscles: MuscleGroup[] }>(['muscles']);
  console.log('fetched data is this', initialData);
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">All Workouts</h1>
          <p className="mt-2 text-gray-600">Discover exercises tailored to your fitness journey</p>
        </header>
        <HydrationBoundary state={dehydratedState}>
          <Allworkouts initialData={initialData?.muscles} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
