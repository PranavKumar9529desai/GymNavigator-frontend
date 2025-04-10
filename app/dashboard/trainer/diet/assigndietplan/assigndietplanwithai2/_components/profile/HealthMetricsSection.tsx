import type { HealthProfile } from "../../_actions/get-healthprofile-by-id";

interface HealthMetricsSectionProps {
	profile?: HealthProfile;
}

export function HealthMetricsSection({ profile }: HealthMetricsSectionProps) {
	// Format utility functions
	const formatHeight = (value?: number, unit?: string): string => {
		if (!value) return "N/A";
		return `${value} ${unit || "cm"}`;
	};

	const formatWeight = (value?: number, unit?: string): string => {
		if (!value) return "N/A";
		return `${value} ${unit || "kg"}`;
	};

	// BMI utility functions
	const getBmiColor = (bmi: number): string => {
		if (bmi < 18.5) return "bg-blue-50 text-blue-700";
		if (bmi < 25) return "bg-green-50 text-green-700";
		if (bmi < 30) return "bg-yellow-50 text-yellow-700";
		return "bg-red-50 text-red-700";
	};

	const getBmiClassification = (bmi: number): string => {
		if (bmi < 18.5) return "Underweight";
		if (bmi < 25) return "Normal weight";
		if (bmi < 30) return "Overweight";
		if (bmi < 35) return "Obesity Class I";
		if (bmi < 40) return "Obesity Class II";
		return "Obesity Class III";
	};

	return (
		<div className="p-4 border-b border-blue-100">
			<h3 className="font-semibold text-blue-800 mb-3 flex items-center">
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
				<div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
						Age
					</span>
					<span className="font-medium text-lg text-blue-700">{profile?.age || "N/A"}</span>
				</div>

				<div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
						Gender
					</span>
					<span className="font-medium text-lg text-blue-700">
						{profile?.gender || "N/A"}
					</span>
				</div>

				<div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
						Height
					</span>
					<span className="font-medium text-lg text-blue-700">
						{formatHeight(profile?.heightValue, profile?.heightUnit)}
					</span>
				</div>

				<div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
						Weight
					</span>
					<span className="font-medium text-lg text-blue-700">
						{formatWeight(profile?.weightValue, profile?.weightUnit)}
					</span>
				</div>
			</div>

			<div className="space-y-4 mt-4">
				{profile?.dietaryPreference && (
					<div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
						<span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
							Diet Type
						</span>
						<p className="font-medium text-blue-700">
							{profile.dietaryPreference}
							{profile.otherDietaryPreference &&
								` - ${profile.otherDietaryPreference}`}
						</p>
					</div>
				)}

				<div className="flex gap-4">
					{profile?.bmi && (
						<div
							className={`flex-1 p-3 rounded-lg border border-blue-100 ${getBmiColor(profile.bmi)}`}
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
						<div className="flex-1 p-3 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100">
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
					<div className="p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
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
