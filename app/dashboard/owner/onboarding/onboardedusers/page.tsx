import { Suspense } from "react";
import { getOnboardingUsersServer } from "./actions/GetOnBoardingUser";
import Loading from "./loading";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/lib/getQueryClient";
import OnboardedUsersClient from "./client-components/OnboardedUsersClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Prefetch the query server-side
  await queryClient.prefetchQuery({
    queryKey: ["onboardedUsers"],
    queryFn: getOnboardingUsersServer,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Dehydrate the query cache
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <h1 className="text-3xl font-bold text-center pt-4">Onboarding Users</h1>
      <Suspense fallback={<Loading />}>
        <HydrationBoundary state={dehydratedState}>
          <OnboardedUsersClient />
        </HydrationBoundary>
      </Suspense>
    </>
  );
}
