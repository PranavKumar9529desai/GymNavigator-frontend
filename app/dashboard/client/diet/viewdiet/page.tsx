import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

import { queryClient } from "@/lib/queryClient";
import { fetchTodaysDiet } from "./_actions/get-todays-diet";
import TodaysDiet from "./_components/todays-diet";

export default async function ViewDietPage() {
  // Prefetch the data on the server
  await queryClient.prefetchQuery({
    queryKey: ["todaysDiet"],
    queryFn: fetchTodaysDiet,
  });

  return (
    <div className="py-4">
      <h1 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-600 to-green-500 text-transparent bg-clip-text">
        Today's Diet Plan
      </h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TodaysDiet />
      </HydrationBoundary>

      <div className="mt-6 text-center text-xs text-gray-500">
        <span>Updated daily based on your fitness goals</span>
      </div>
    </div>
  );
}
