"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import {
	type ReligiousPreference,
	useHealthProfileStore,
} from "../_store/health-profile-store";

interface ReligiousPreferencesFormProps {
	onSubmit: () => Promise<void>;
	isSubmitting: boolean;
	isLast?: boolean;
}

export default function ReligiousPreferencesForm({
	onSubmit,
	isSubmitting,
	isLast = false,
}: ReligiousPreferencesFormProps) {
	const {
		religiousPreference,
		otherReligiousPreference,
		dietaryRestrictions,
		setReligiousPreference,
		setOtherReligiousPreference,
		addDietaryRestriction,
		removeDietaryRestriction,
		prevStep,
	} = useHealthProfileStore();

	const [newRestriction, setNewRestriction] = useState("");

	const handleAddRestriction = () => {
		if (newRestriction.trim()) {
			addDietaryRestriction(newRestriction.trim());
			setNewRestriction("");
		}
	};

	const handlePreferenceChange = (value: string) => {
		setReligiousPreference(value as ReligiousPreference);

		// Clear other preference when not selecting "other"
		if (value !== "other") {
			setOtherReligiousPreference("");
		}
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">
					Dietary Preferences
				</h1>
				<p className="text-gray-500 mb-6">
					Help us understand your dietary needs
				</p>

				<div className="space-y-6">
					<div>
						<label
							htmlFor="religious-preferences"
							className="text-base font-medium text-gray-700 mb-3 block"
						>
							Do you have any religious dietary preferences?
						</label>

						<RadioGroup
							id="religious-preferences"
							value={religiousPreference || ""}
							onValueChange={handlePreferenceChange}
							className="space-y-3"
						>
							{[
								{ value: "hindu", label: "Hindu" },
								{ value: "muslim", label: "Muslim" },
								{ value: "sikh", label: "Sikh" },
								{ value: "jain", label: "Jain" },
								{ value: "christian", label: "Christian" },
								{ value: "buddhist", label: "Buddhist" },
								{ value: "other", label: "Other" },
								{ value: "none", label: "None / Not applicable" },
							].map((option) => (
								<div key={option.value} className="flex items-center space-x-3">
									<RadioGroupItem
										id={option.value}
										value={option.value}
										className="border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<label
										htmlFor={option.value}
										className="font-medium text-gray-700"
									>
										{option.label}
									</label>
								</div>
							))}
						</RadioGroup>

						{religiousPreference === "other" && (
							<div className="mt-3 pl-7">
								<Input
									placeholder="Please specify"
									value={otherReligiousPreference}
									onChange={(e) => setOtherReligiousPreference(e.target.value)}
									className="max-w-sm"
								/>
							</div>
						)}
					</div>

					<div>
						<label
							htmlFor="dietary-restriction-input"
							className="text-base font-medium text-gray-700 mb-3 block"
						>
							Any specific foods you don't eat?
						</label>
						<div className="flex gap-2">
							<Input
								id="dietary-restriction-input"
								placeholder="e.g. Beef, Pork, Seafood..."
								value={newRestriction}
								onChange={(e) => setNewRestriction(e.target.value)}
								className="flex-grow"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleAddRestriction}
								disabled={!newRestriction.trim()}
								className="border-blue-300 hover:bg-blue-50"
							>
								Add
							</Button>
						</div>

						{dietaryRestrictions.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2">
								{dietaryRestrictions.map((restriction) => (
									<Badge
										key={`restriction-${restriction}`}
										className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700 px-3 py-1.5"
										onClick={() => removeDietaryRestriction(restriction)}
									>
										{restriction} &times;
									</Badge>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="mt-8 flex flex-col gap-3">
				<Button
					onClick={onSubmit}
					disabled={isSubmitting}
					className={cn(
						"w-full py-6 flex items-center justify-center gap-2 text-base",
						"bg-gradient-to-r from-blue-500 to-blue-600",
					)}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin" />
							Submitting...
						</>
					) : isLast ? (
						<>
							<Heart className="h-5 w-5" /> Complete Profile
						</>
					) : (
						<>
							Continue <ArrowRight className="h-5 w-5" />
						</>
					)}
				</Button>

				<Button
					onClick={prevStep}
					variant="outline"
					disabled={isSubmitting}
					className="w-full py-6 flex items-center justify-center gap-2 text-base"
				>
					<ArrowLeft className="h-5 w-5" /> Go Back
				</Button>
			</div>
		</div>
	);
}
