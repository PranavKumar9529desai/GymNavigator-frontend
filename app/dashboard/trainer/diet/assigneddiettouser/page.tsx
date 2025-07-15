import { Suspense } from "react";
import { redirect } from "next/navigation";
import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";
import { DietAssignmentClient } from "./_components/diet-assignment-client";
import { LoadingSkeleton } from "./_components/loading-skeleton";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AssignDietToUserPage({ searchParams }: PageProps) {
  const { userId } = await searchParams;


  if (!userId) {
    redirect("/dashboard/trainer/assignedusers");
  }

  let userProfileData = null;
  let dietPlansData = null;
  try {
    const trainerAxios = await TrainerReqConfig();
    const [userProfileRes, dietPlansRes] = await Promise.all([
      trainerAxios.get(`/diet/user/${userId}/health-profile`),
      trainerAxios.get("/diet/alldietplans"),
    ]);
    userProfileData = userProfileRes.data;
    dietPlansData = dietPlansRes.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    redirect("/dashboard/trainer/assignedusers");
  }

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
            userId={userId as string}
          />
        </Suspense>
      </div>
    </div>
  );
}
