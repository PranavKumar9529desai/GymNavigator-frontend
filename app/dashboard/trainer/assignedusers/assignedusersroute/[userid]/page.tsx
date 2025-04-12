import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";
import { getUserCompleteInfo } from "./_actions/get-user-assigned-by-id";
import { UserProfileComponent } from "./_components/UserProfileComponent";
import Loading from "./loading";

export default async function AssignedUserPage({
  params,
}: {
  params: { userid: string };
}) {
  const { userid } = params;

  // Prefetch the query on the server
  await queryClient.prefetchQuery({
    queryKey: ["user", userid],
    queryFn: () => getUserCompleteInfo(userid),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <UserProfileComponent userId={userid} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
