import type { Selection } from "../../_actions/get-healthprofile-by-id";

interface HealthConditionsSectionProps {
	medicalConditions?: Selection[] | string;
	otherMedicalCondition?: string;
}

export function HealthConditionsSection({
	medicalConditions,
	otherMedicalCondition,
}: HealthConditionsSectionProps) {
	const hasMedicalConditions =
		Array.isArray(medicalConditions) &&
		medicalConditions.some((condition) => condition.selected);

	return (
		<div className="p-4 bg-gray-50 border-t border-gray-200">
			<h3 className="font-semibold text-gray-800 mb-3 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 mr-2 text-red-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				Health Conditions
			</h3>

			{hasMedicalConditions ? (
				<div>
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
						Medical Conditions
					</span>
					<div className="flex flex-wrap gap-2">
						{Array.isArray(medicalConditions) &&
							medicalConditions
								.filter((condition) => condition.selected)
								.map((condition) => (
									<span
										key={condition.id || `condition-${condition.name}`}
										className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm"
									>
										{condition.name}
									</span>
								))}
						{otherMedicalCondition && (
							<span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm">
								{otherMedicalCondition}
							</span>
						)}
					</div>
				</div>
			) : (
				<div className="p-3 bg-green-50 rounded-lg text-green-700 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
					No medical conditions reported
				</div>
			)}
		</div>
	);
}
