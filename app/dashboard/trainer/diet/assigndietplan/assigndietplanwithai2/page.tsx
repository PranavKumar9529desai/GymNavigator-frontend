import { gethealthprofileById } from "./_actions/get-healthprofile-by-id";
import { DietPlanner } from "./_components/DietPlanner/DietPlanner";
import { UserProfileCard } from "./_components/UserProfileCard";

export default async function AssignDietPlanWithAI2({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const userId = (await searchParams).userId || "defaultUserId";
  const profileResult = await gethealthprofileById(userId);

  return (
    <div className="mx-auto">
      {/* Main container with improved mobile-friendly spacing and a light shadow */}
      <div className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Left Section */}
          <div className="w-full md:w-1/3">
            <UserProfileCard
              profile={profileResult.success ? profileResult.data : undefined}
            />
          </div>
          {/* Right Section */}
          <div className="w-full md:w-2/3">
            <DietPlanner />
          </div>
        </div>
      </div>
    </div>
  );
}
