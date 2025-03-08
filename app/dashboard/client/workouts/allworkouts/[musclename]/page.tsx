import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SingleMuscles } from "./_components/singleMuscle";
import { getSingleMuscle } from "./actions/getSIngleMuscle";
import Loading from "./loading";

export default async function Page({
  params,
}: {
  params: { musclename: string };
}) {
  // Await the params here as well for consistency
  const musclename = await params.musclename;
  const muscleName = musclename.charAt(0).toUpperCase() + musclename.slice(1);

  // Initialize QueryClient
  const queryClient = new QueryClient();

  // Prefetch the data
  await queryClient.prefetchQuery({
    queryKey: ["exercises", muscleName],
    queryFn: () => getSingleMuscle(muscleName),
  });

  return (
    <main aria-labelledby="page-title">
      <header className="sr-only border-4 border-red-400">
        <h1 id="page-title">{muscleName} </h1>
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
