"use client";

import { useState } from "react";
import {
	type HealthProfile,
	Selection,
} from "../_actions/get-healthprofile-by-id";

// Define accordion section IDs as constants to avoid string typos
const ACCORDION_SECTIONS = {
	HEALTH_METRICS: "healthMetrics",
	DIETARY_NEEDS: "dietaryNeeds",
	HEALTH_CONDITIONS: "healthConditions",
	PREFERENCES: "preferences",
};

interface UserProfileCardProps {
	profile?: HealthProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
	// Use a string to track which accordion is expanded
	const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
		null,
	);

	// Toggle function to expand/collapse accordion sections
	const handleAccordionToggle = (accordionId: string): void => {
		setExpandedAccordion((prevAccordion) =>
			prevAccordion === accordionId ? null : accordionId,
		);
	};

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

	return (
		<div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
			{/* Header with user's name and basic info */}
			<div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
				<h2 className="font-bold text-xl text-gray-800">
					{profile?.fullname || "Client Profile"}
				</h2>
				{profile?.contact && (
					<p className="text-gray-600 mt-1">
						<span className="font-medium">Contact:</span> {profile.contact}
					</p>
				)}
			</div>

			{/* Health Metrics Accordion */}
			<div className="border-b border-gray-200">
				<button
					type="button"
					onClick={() =>
						handleAccordionToggle(ACCORDION_SECTIONS.HEALTH_METRICS)
					}
					className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
				>
					<span className="font-semibold text-gray-800">Health Metrics</span>
					<span className="text-gray-500 text-lg">
						{expandedAccordion === ACCORDION_SECTIONS.HEALTH_METRICS
							? "−"
							: "+"}
					</span>
				</button>

				{expandedAccordion === ACCORDION_SECTIONS.HEALTH_METRICS && (
					<div className="p-4 space-y-3 bg-gray-50">
						<div className="flex justify-between">
							<div className="w-1/2 pr-2">
								<p className="text-sm font-medium text-gray-500">Height</p>
								<p className="font-medium">
									{formatHeight(profile?.heightValue, profile?.heightUnit)}
								</p>
							</div>
							<div className="w-1/2 pl-2">
								<p className="text-sm font-medium text-gray-500">Weight</p>
								<p className="font-medium">
									{formatWeight(profile?.weightValue, profile?.weightUnit)}
								</p>
							</div>
						</div>

						<div className="flex justify-between">
							<div className="w-1/2 pr-2">
								<p className="text-sm font-medium text-gray-500">Age</p>
								<p className="font-medium">{profile?.age || "Not specified"}</p>
							</div>
							<div className="w-1/2 pl-2">
								<p className="text-sm font-medium text-gray-500">Gender</p>
								<p className="font-medium">
									{profile?.gender || "Not specified"}
								</p>
							</div>
						</div>

						{profile?.bmi && (
							<div className="pt-2 border-t border-gray-200">
								<p className="text-sm font-medium text-gray-500">BMI</p>
								<p className="font-medium">
									{profile.bmi.toFixed(1)}{" "}
									<span className="text-gray-600 text-sm">
										({getBmiClassification(profile.bmi)})
									</span>
								</p>
							</div>
						)}

						{profile?.bmr && (
							<div className="pt-2 border-t border-gray-200">
								<p className="text-sm font-medium text-gray-500">
									BMR (Basal Metabolic Rate)
								</p>
								<p className="font-medium">
									{profile.bmr.toFixed(0)} calories/day
								</p>
							</div>
						)}

						{profile?.tdee && (
							<div className="pt-2 border-t border-gray-200">
								<p className="text-sm font-medium text-gray-500">
									TDEE (Total Daily Energy Expenditure)
								</p>
								<p className="font-medium">
									{profile.tdee.toFixed(0)} calories/day
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Dietary Needs Accordion */}
			<div className="border-b border-gray-200">
				<button
					type="button"
					onClick={() =>
						handleAccordionToggle(ACCORDION_SECTIONS.DIETARY_NEEDS)
					}
					className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
				>
					<span className="font-semibold text-gray-800">
						Dietary Preferences
					</span>
					<span className="text-gray-500 text-lg">
						{expandedAccordion === ACCORDION_SECTIONS.DIETARY_NEEDS ? "−" : "+"}
					</span>
				</button>

				{expandedAccordion === ACCORDION_SECTIONS.DIETARY_NEEDS && (
					<div className="p-4 space-y-3 bg-gray-50">
						<div>
							<p className="text-sm font-medium text-gray-500">Diet Type</p>
							<p className="font-medium">
								{profile?.dietaryPreference || "Not specified"}
								{profile?.otherDietaryPreference &&
									` - ${profile.otherDietaryPreference}`}
							</p>
						</div>

						{Array.isArray(profile?.nonVegDays) &&
							profile.nonVegDays.some((day) => day.selected) && (
								<div className="pt-2 border-t border-gray-200">
									<p className="text-sm font-medium text-gray-500">
										Non-Veg Days
									</p>
									<div className="flex flex-wrap gap-1 mt-1">
										{profile.nonVegDays
											.filter((day) => day.selected)
											.map((day) => (
												<span
													key={day.day}
													className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
												>
													{day.day}
												</span>
											))}
									</div>
								</div>
							)}

						{Array.isArray(profile?.allergies) &&
							profile.allergies.some((allergy) => allergy.selected) && (
								<div className="pt-2 border-t border-gray-200">
									<p className="text-sm font-medium text-gray-500">Allergies</p>
									<div className="flex flex-wrap gap-1 mt-1">
										{profile.allergies
											.filter((allergy) => allergy.selected)
											.map((allergy) => (
												<span
													key={allergy.id || `allergy-${allergy.name}`}
													className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded"
												>
													{allergy.name}
												</span>
											))}
										{profile.otherAllergy && (
											<span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
												{profile.otherAllergy}
											</span>
										)}
									</div>
								</div>
							)}

						{profile?.religiousPreference && (
							<div className="pt-2 border-t border-gray-200">
								<p className="text-sm font-medium text-gray-500">
									Religious Preferences
								</p>
								<p className="font-medium">
									{profile.religiousPreference}
									{profile.otherReligiousPreference &&
										` - ${profile.otherReligiousPreference}`}
								</p>
							</div>
						)}

						{Array.isArray(profile?.dietaryRestrictions) &&
							profile.dietaryRestrictions.some(
								(restriction) => restriction.selected,
							) && (
								<div className="pt-2 border-t border-gray-200">
									<p className="text-sm font-medium text-gray-500">
										Dietary Restrictions
									</p>
									<div className="flex flex-wrap gap-1 mt-1">
										{profile.dietaryRestrictions
											.filter((restriction) => restriction.selected)
											.map((restriction) => (
												<span
													key={
														restriction.id || `restriction-${restriction.name}`
													}
													className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded"
												>
													{restriction.name}
												</span>
											))}
									</div>
								</div>
							)}
					</div>
				)}
			</div>

			{/* Health Conditions Accordion */}
			<div className="border-b border-gray-200">
				<button
					type="button"
					onClick={() =>
						handleAccordionToggle(ACCORDION_SECTIONS.HEALTH_CONDITIONS)
					}
					className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
				>
					<span className="font-semibold text-gray-800">Health Conditions</span>
					<span className="text-gray-500 text-lg">
						{expandedAccordion === ACCORDION_SECTIONS.HEALTH_CONDITIONS
							? "−"
							: "+"}
					</span>
				</button>

				{expandedAccordion === ACCORDION_SECTIONS.HEALTH_CONDITIONS && (
					<div className="p-4 space-y-3 bg-gray-50">
						{Array.isArray(profile?.medicalConditions) &&
						profile.medicalConditions.some(
							(condition) => condition.selected,
						) ? (
							<div>
								<p className="text-sm font-medium text-gray-500">
									Medical Conditions
								</p>
								<div className="flex flex-wrap gap-1 mt-1">
									{profile.medicalConditions
										.filter((condition) => condition.selected)
										.map((condition) => (
											<span
												key={condition.id || `condition-${condition.name}`}
												className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
											>
												{condition.name}
											</span>
										))}
									{profile.otherMedicalCondition && (
										<span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
											{profile.otherMedicalCondition}
										</span>
									)}
								</div>
							</div>
						) : (
							<p className="text-gray-600">No medical conditions reported</p>
						)}
					</div>
				)}
			</div>

			{/* Preferences Accordion */}
			<div className="border-b border-gray-200">
				<button
					type="button"
					onClick={() => handleAccordionToggle(ACCORDION_SECTIONS.PREFERENCES)}
					className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
				>
					<span className="font-semibold text-gray-800">Preferences</span>
					<span className="text-gray-500 text-lg">
						{expandedAccordion === ACCORDION_SECTIONS.PREFERENCES ? "−" : "+"}
					</span>
				</button>

				{expandedAccordion === ACCORDION_SECTIONS.PREFERENCES && (
					<div className="p-4 space-y-3 bg-gray-50">
						<div>
							<p className="text-sm font-medium text-gray-500">
								Activity Level
							</p>
							<p className="font-medium">
								{profile?.activityLevel || "Not specified"}
							</p>
						</div>

						<div className="pt-2 border-t border-gray-200">
							<p className="text-sm font-medium text-gray-500">Meal Times</p>
							<p className="font-medium">
								{profile?.mealTimes || "Not specified"}
							</p>
						</div>

						{profile?.goal && (
							<div className="pt-2 border-t border-gray-200">
								<p className="text-sm font-medium text-gray-500">
									Fitness Goal
								</p>
								<p className="font-medium">{profile.goal}</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
