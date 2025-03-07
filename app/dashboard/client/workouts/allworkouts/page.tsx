import { Metadata } from "next";
import { Allworkouts } from "./_components/allworkouts";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import getAllMuscles from "./actions/getAllMuscles";

export const metadata: Metadata = {
  title: "All Workouts | Gym Navigator",
  description:
    "Explore our comprehensive collection of workouts organized by muscle groups. Find exercises tailored to your fitness goals.",
};

export default async function AllWorkoutsPage() {
  const queryClient = new QueryClient();
  
  // Prefetch the muscles data with a long cache time (24 hours)
  await queryClient.prefetchQuery({
    queryKey: ["muscles"],
    queryFn: async () => {
      const data = await getAllMuscles();
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">All Workouts</h1>
          <p className="mt-2 text-gray-600">
            Discover exercises tailored to your fitness journey
          </p>
        </header>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Allworkouts />
        </HydrationBoundary>
      </div>
    </main>
  );
}
