"use client";

import { useState } from "react";
import type { HealthProfile } from "../_actions/get-healthprofile-by-id";
import { HealthConditionsSection } from "./profile/HealthConditionsSection";
import { HealthMetricsSection } from "./profile/HealthMetricsSection";
import { MealsSection } from "./profile/MealsSection";
import { PreferencesSection } from "./profile/PreferencesSection";
import { ProfileHeader } from "./profile/ProfileHeader";

interface UserProfileCardProps {
	profile?: HealthProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
	const [showMore, setShowMore] = useState(false);

	return (
		<div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
			{/* Profile Section - Avatar, Name, Contact */}
			<ProfileHeader fullname={profile?.fullname} contact={profile?.contact} />

			{/* Health Metrics Section */}
			<HealthMetricsSection profile={profile} />

			{/* Meals Section */}
			<MealsSection profile={profile} />

			{/* Show More Button */}
			<button
				onClick={() => setShowMore(!showMore)}
				className="w-full py-3 text-center text-blue-600 font-medium hover:bg-blue-50 transition-colors"
			>
				{showMore ? "Show Less" : "Show More"}
			</button>

			{/* Health Conditions and Preferences (visible when Show More is clicked) */}
			{showMore && (
				<>
					{/* Health Conditions Section */}
					<HealthConditionsSection
						medicalConditions={profile?.medicalConditions}
						otherMedicalCondition={profile?.otherMedicalCondition}
					/>

					{/* Preferences Section */}
					<PreferencesSection
						activityLevel={profile?.activityLevel}
						allergies={profile?.allergies}
						otherAllergy={profile?.otherAllergy}
						religiousPreference={profile?.religiousPreference}
						otherReligiousPreference={profile?.otherReligiousPreference}
						dietaryRestrictions={profile?.dietaryRestrictions}
					/>
				</>
			)}
		</div>
	);
}
