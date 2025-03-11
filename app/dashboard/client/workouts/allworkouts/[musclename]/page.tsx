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
import { queryClient } from "@/lib/getQueryClient";
export default async function Page({
  params,
}: {
  params: { musclename: string };
}) {
  // Decode the URL parameter and remove any potential encoding artifacts
  const musclename = decodeURIComponent(params.musclename).replace(/%20/g, " ");
  const muscleName = musclename
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Initialize QueryClient

  // Prefetch the data
  await queryClient.prefetchQuery({
    queryKey: ["exercises", muscleName],
    queryFn: () => getSingleMuscle(muscleName),
  });

  return (
    <main aria-labelledby="page-title">
      <header className="sr-only border-4 border-red-400">
        <h1 id="page-title">{muscleName}</h1>
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
