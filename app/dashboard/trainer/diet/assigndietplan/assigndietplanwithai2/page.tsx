import { gethealthprofileById } from './_actions/get-healthprofile-by-id';
import { DietPlanner } from './_components/DietPlanner/DietPlanner';
import { UserProfileCard } from './_components/UserProfileCard';

export default async function AssignDietPlanWithAI2({
	searchParams,
}: {
	searchParams: Promise<{ userId?: string }>;
}) {
	const userId = (await searchParams).userId || 'defaultUserId';
	const profileResult = await gethealthprofileById(userId);

	return (
		<div className="mx-auto">
			{/* Main container with gradient background and improved styling */}
			<div className="p-4 md:p-6 bg-gradient-to-b from-blue-50/50 to-white rounded-lg">
				<h1 className="text-2xl font-bold text-blue-800 mb-6">
					Personalized Diet Plan Generator
				</h1>

				<div className="flex flex-col md:flex-row gap-6">
					{/* Left Section - User Profile */}
					<div className="w-full md:w-1/3">
						<UserProfileCard
							profile={profileResult.success ? profileResult.data : undefined}
						/>
					</div>

					{/* Right Section - Diet Planner */}
					<div className="w-full md:w-2/3">
						<DietPlanner />
					</div>
				</div>
			</div>
		</div>
	);
}
