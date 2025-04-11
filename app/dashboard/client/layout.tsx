import type React from "react";
import { getIsWorkoutAndDietAssignedStatus } from "./_actions/get-isworkoutanddietassigned-status";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";
import ClientLayout from "./_components/ClientLayout";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Prefetch the assignment status data
  await queryClient.prefetchQuery({
    queryKey: ["assignmentStatus"],
    queryFn: getIsWorkoutAndDietAssignedStatus,
  });

  return (
    <div className="min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientLayout>{children}</ClientLayout>
      </HydrationBoundary>
    </div>
  );
}
