import type { HealthProfile } from "../../_actions/get-healthprofile-by-id";

interface HealthMetricsSectionProps {
	profile?: HealthProfile;
}

export function HealthMetricsSection({ profile }: HealthMetricsSectionProps) {
	// Format utility functions
	const formatHeight = (value?: number, unit?: string): string => {
		if (!value) return "Not specified";
		return `${value} ${unit || ""}`;
	};

	const formatWeight = (value?: number, unit?: string): string => {
		if (!value) return "Not specified";
		return `${value} ${unit || ""}`;
	};

	// Format BMI with classification
	const getBmiClassification = (bmi?: number): string => {
		if (!bmi) return "";
		if (bmi < 18.5) return "Underweight";
		if (bmi < 25) return "Normal weight";
		if (bmi < 30) return "Overweight";
		return "Obese";
	};

	// BMI color based on classification
	const getBmiColor = (bmi?: number): string => {
		if (!bmi) return "bg-gray-200";
		if (bmi < 18.5) return "bg-blue-100 text-blue-800";
		if (bmi < 25) return "bg-green-100 text-green-800";
		if (bmi < 30) return "bg-yellow-100 text-yellow-800";
		return "bg-red-100 text-red-800";
	};

	return (
		<div className="p-4 border-b border-gray-200">
			<h3 className="font-semibold text-gray-800 mb-3 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 mr-2 text-blue-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
				Health Metrics
			</h3>

			<div className="grid grid-cols-2 gap-4 mb-4">
				<div className="bg-gray-50 p-3 rounded-lg">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
						Age
					</span>
					<span className="font-medium text-lg">{profile?.age || "N/A"}</span>
				</div>

				<div className="bg-gray-50 p-3 rounded-lg">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
						Gender
					</span>
					<span className="font-medium text-lg">
						{profile?.gender || "N/A"}
					</span>
				</div>

				<div className="bg-gray-50 p-3 rounded-lg">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
						Height
					</span>
					<span className="font-medium text-lg">
						{formatHeight(profile?.heightValue, profile?.heightUnit)}
					</span>
				</div>

				<div className="bg-gray-50 p-3 rounded-lg">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
						Weight
					</span>
					<span className="font-medium text-lg">
						{formatWeight(profile?.weightValue, profile?.weightUnit)}
					</span>
				</div>
			</div>

			<div className="space-y-4 mt-4">
				{profile?.dietaryPreference && (
					<div className="p-3 bg-blue-50 rounded-lg">
						<span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
							Diet Type
						</span>
						<p className="font-medium">
							{profile.dietaryPreference}
							{profile.otherDietaryPreference &&
								` - ${profile.otherDietaryPreference}`}
						</p>
					</div>
				)}

				<div className="flex gap-4">
					{profile?.bmi && (
						<div
							className={`flex-1 p-3 rounded-lg ${getBmiColor(profile.bmi)}`}
						>
							<span className="text-xs font-medium uppercase tracking-wide block mb-1">
								BMI
							</span>
							<p className="font-medium text-lg">
								{profile.bmi.toFixed(1)}
								<span className="block text-xs mt-1 font-normal">
									{getBmiClassification(profile.bmi)}
								</span>
							</p>
						</div>
					)}

					{profile?.bmr && (
						<div className="flex-1 p-3 bg-indigo-50 text-indigo-800 rounded-lg">
							<span className="text-xs font-medium uppercase tracking-wide block mb-1">
								BMR
							</span>
							<p className="font-medium text-lg">
								{profile.bmr.toFixed(0)}
								<span className="block text-xs mt-1 font-normal">
									calories/day
								</span>
							</p>
						</div>
					)}
				</div>

				{profile?.goal && (
					<div className="p-3 bg-green-50 text-green-800 rounded-lg">
						<span className="text-xs font-medium uppercase tracking-wide block mb-1">
							Goal
						</span>
						<p className="font-medium">{profile.goal}</p>
					</div>
				)}
			</div>
		</div>
	);
}
