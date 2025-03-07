import { getSingleMuscle } from "./actions/getSIngleMuscle";
import { SingleMuscles } from "./_components/singleMuscle";
import { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { musclename: string };
}): Promise<Metadata> {
  const muscleName =
    params.musclename.charAt(0).toUpperCase() + params.musclename.slice(1);

  return {
    title: `${muscleName} Exercises | Gym Navigator`,
    description: `Discover professional-grade exercises designed to target and strengthen your ${muscleName.toLowerCase()} muscles effectively.`,
    openGraph: {
      title: `${muscleName} Exercises | Gym Navigator`,
      description: `Explore our comprehensive collection of ${muscleName.toLowerCase()} exercises with detailed instructions and professional guidance.`,
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: { musclename: string };
}) {
  const muscleName =
    params.musclename.charAt(0).toUpperCase() + params.musclename.slice(1);

  // Initialize QueryClient
  const queryClient = new QueryClient();

  // Prefetch the data
  await queryClient.prefetchQuery({
    queryKey: ["exercises", muscleName],
    queryFn: () => getSingleMuscle(muscleName),
  });

  return (
    <main aria-labelledby="page-title">
      <header className="sr-only">
        <h1 id="page-title">{muscleName} Exercises</h1>
      </header>

      <Suspense fallback={<Loading />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SingleMuscles
            initialExercises={[]} // Initial data will come from query client
            muscleName={muscleName}
          />
        </HydrationBoundary>
      </Suspense>
    </main>
  );
}
