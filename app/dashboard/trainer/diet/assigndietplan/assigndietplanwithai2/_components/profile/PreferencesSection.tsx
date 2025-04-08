import type { Selection } from "../../_actions/get-healthprofile-by-id";

interface PreferencesSectionProps {
	activityLevel?: string;
	allergies?: Selection[] | string;
	otherAllergy?: string;
	religiousPreference?: string;
	otherReligiousPreference?: string;
	dietaryRestrictions?: Selection[] | string;
}

export function PreferencesSection({
	activityLevel,
	allergies,
	otherAllergy,
	religiousPreference,
	otherReligiousPreference,
	dietaryRestrictions,
}: PreferencesSectionProps) {
	const hasAllergies =
		Array.isArray(allergies) && allergies.some((allergy) => allergy.selected);
	const hasRestrictions =
		Array.isArray(dietaryRestrictions) &&
		dietaryRestrictions.some((restriction) => restriction.selected);

	return (
		<div className="p-4 bg-gray-50 border-t border-gray-200">
			<h3 className="font-semibold text-gray-800 mb-3 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 mr-2 text-amber-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
					/>
				</svg>
				Preferences
			</h3>

			<div className="space-y-4">
				{activityLevel && (
					<div className="p-3 bg-blue-50 rounded-lg">
						<span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
							Activity Level
						</span>
						<p className="font-medium text-blue-800">{activityLevel}</p>
					</div>
				)}

				{hasAllergies && (
					<div className="mt-4">
						<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
							Allergies
						</span>
						<div className="flex flex-wrap gap-2">
							{Array.isArray(allergies) &&
								allergies
									.filter((allergy) => allergy.selected)
									.map((allergy) => (
										<span
											key={allergy.id || `allergy-${allergy.name}`}
											className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 mr-1"
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
											{allergy.name}
										</span>
									))}
							{otherAllergy && (
								<span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 mr-1"
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
									{otherAllergy}
								</span>
							)}
						</div>
					</div>
				)}

				{religiousPreference && (
					<div className="p-3 bg-amber-50 rounded-lg mt-4">
						<span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
							Religious Preferences
						</span>
						<p className="font-medium text-amber-800">
							{religiousPreference}
							{otherReligiousPreference && ` - ${otherReligiousPreference}`}
						</p>
					</div>
				)}

				{hasRestrictions && (
					<div className="mt-4">
						<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
							Dietary Restrictions
						</span>
						<div className="flex flex-wrap gap-2">
							{Array.isArray(dietaryRestrictions) &&
								dietaryRestrictions
									.filter((restriction) => restriction.selected)
									.map((restriction) => (
										<span
											key={restriction.id || `restriction-${restriction.name}`}
											className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm"
										>
											{restriction.name}
										</span>
									))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
