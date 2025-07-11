import { Suspense } from "react";
import { redirect } from "next/navigation";
import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";
import { DietAssignmentClient } from "./_components/diet-assignment-client";
import { LoadingSkeleton } from "./_components/loading-skeleton";

interface PageProps {
  searchParams: {
    userId?: string;
  };
}

// Server action to get user health profile
async function getUserHealthProfile(userId: string) {
  try {
    const trainerAxios = await TrainerReqConfig();
    const response = await trainerAxios.get(`/diet/user/${userId}/health-profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user health profile:", error);
    return null;
  }
}

// Server action to get available diet plans
async function getAvailableDietPlans() {
  try {
    const trainerAxios = await TrainerReqConfig();
    const response = await trainerAxios.get("/diet/alldietplans");
    return response.data;
  } catch (error) {
    console.error("Error fetching diet plans:", error);
    return null;
  }
}

export default async function AssignDietToUserPage({ searchParams }: PageProps) {
  const { userId } = searchParams;

  if (!userId) {
    redirect("/dashboard/trainer/assignedusers");
  }

  // Fetch data in parallel
  const [userProfileData, dietPlansData] = await Promise.all([
    getUserHealthProfile(userId),
    getAvailableDietPlans(),
  ]);

  if (!userProfileData || !userProfileData.success) {
    redirect("/dashboard/trainer/assignedusers");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <Suspense fallback={<LoadingSkeleton />}>
          <DietAssignmentClient
            userProfile={userProfileData.data}
            dietPlans={dietPlansData?.data || []}
            userId={userId}
          />
        </Suspense>
      </div>
    </div>
  );
}
