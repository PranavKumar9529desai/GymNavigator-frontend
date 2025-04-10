interface PreferencesSectionProps {
	activityLevel?: string;
	allergies?: string[];
	otherAllergy?: string;
	religiousPreference?: string;
	otherReligiousPreference?: string;
	dietaryRestrictions?: string[];
}

export function PreferencesSection({
	activityLevel,
	allergies,
	otherAllergy,
	religiousPreference,
	otherReligiousPreference,
	dietaryRestrictions,
}: PreferencesSectionProps) {
	// Combine standard and custom allergies
	const allAllergies = [
		...(allergies || []),
		...(otherAllergy ? [otherAllergy] : []),
	];

	// Format religious preference
	const formattedReligious = religiousPreference
		? otherReligiousPreference && religiousPreference === "Other"
			? otherReligiousPreference
			: religiousPreference
		: null;

	// Check if any preferences exist to show section
	const hasPreferences =
		activityLevel ||
		allAllergies.length > 0 ||
		formattedReligious ||
		(dietaryRestrictions && dietaryRestrictions.length > 0);

	if (!hasPreferences) return null;

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
						d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
					/>
				</svg>
				Preferences
			</h3>

			<div className="space-y-4">
				{activityLevel && (
					<div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
						<span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
							Activity Level
						</span>
						<p className="font-medium text-blue-700">{activityLevel}</p>
					</div>
				)}

				{formattedReligious && (
					<div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
						<span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
							Religious Preference
						</span>
						<p className="font-medium text-blue-700">{formattedReligious}</p>
					</div>
				)}

				{allAllergies.length > 0 && (
					<div>
						<span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
							Allergies
						</span>
						<div className="flex flex-wrap gap-2">
							{allAllergies.map((allergy, index) => (
								<span
									key={index}
									className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-sm"
								>
									{allergy}
								</span>
							))}
						</div>
					</div>
				)}

				{dietaryRestrictions && dietaryRestrictions.length > 0 && (
					<div>
						<span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
							Dietary Restrictions
						</span>
						<div className="flex flex-wrap gap-2">
							{dietaryRestrictions.map((restriction, index) => (
								<span
									key={index}
									className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-sm"
								>
									{restriction}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
