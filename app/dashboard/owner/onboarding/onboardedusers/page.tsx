"use client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import OnboardedUsers from "./OnbordedUsers";
import { fetchOnboardingUsers } from "./actions/api";
import Loading from "./loading";

export default function Page() {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["onboardedUsers"],
    queryFn: fetchOnboardingUsers,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
    retry: 2, // Retry failed requests up to 2 times
  });

  if (error) {
    console.error("Error in onboarding users page:", error);
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error loading users</h2>
        <p className="text-gray-600 mt-2 mb-4">
          There was a problem loading the data
        </p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  // Transform the data
  const transformedUsers =
    response?.users?.map((user) => ({
      id: user.id,
      name: user.name,
      startDate: user.startDate ? new Date(user.startDate) : null,
      endDate: user.endDate ? new Date(user.endDate) : null,
    })) ?? [];

  return (
    <>
      <h1 className="text-3xl font-bold text-center pt-4  ">
        Onboarding Users
      </h1>
      {isLoading ? (
        <Loading />
      ) : (
        <OnboardedUsers initialUsers={transformedUsers} />
      )}
    </>
  );
}
