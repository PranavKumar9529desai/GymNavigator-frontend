import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Today's Diet Plan</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TodaysDiet />
      </HydrationBoundary>
    </div>
  );
}
