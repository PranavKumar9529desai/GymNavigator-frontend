'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
	useHealthProfileStore,
	type DietaryPreference,
} from '../_store/health-profile-store';

const dietaryOptions: { value: DietaryPreference; label: string }[] = [
	{ value: 'vegetarian', label: 'Vegetarian' },
	{ value: 'non-vegetarian', label: 'Non-Vegetarian' },
	{ value: 'vegan', label: 'Vegan' },
	{ value: 'other', label: 'Other' },
];

export default function DietaryPreferencesForm() {
	const {
		dietaryPreference,
		otherDietaryPreference,
		setDietaryPreference,
		setOtherDietaryPreference,
		nextStep,
		prevStep,
	} = useHealthProfileStore();

	const handleSubmit = () => {
		nextStep();
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">
					Dietary Preferences
				</h1>
				<p className="text-gray-500 mb-6">Select your dietary preference</p>

				<div className="space-y-4">
					{dietaryOptions.map((option) => (
						<button
							type="button"
							key={option.value}
							onClick={() => setDietaryPreference(option.value)}
							className={cn(
								'w-full p-4 rounded-lg border flex items-center justify-between',
								dietaryPreference === option.value
									? 'border-blue-500 bg-blue-50 text-blue-700'
									: 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
							)}
						>
							<span className="font-medium">{option.label}</span>
							{dietaryPreference === option.value && (
								<div className="h-4 w-4 rounded-full bg-blue-500" />
							)}
						</button>
					))}

					{dietaryPreference === 'other' && (
						<div className="mt-4">
							<label
								htmlFor="otherDietaryPreference"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Please specify your dietary preference
							</label>
							<Input
								id="otherDietaryPreference"
								value={otherDietaryPreference}
								onChange={(e) => setOtherDietaryPreference(e.target.value)}
								placeholder="Enter your dietary preference"
								className="w-full"
							/>
						</div>
					)}
				</div>
			</div>

			<div className="mt-8 flex flex-col gap-3">
				<Button
					onClick={handleSubmit}
					disabled={
						!dietaryPreference ||
						(dietaryPreference === 'other' && !otherDietaryPreference)
					}
					className={cn(
						'w-full py-6 flex items-center justify-center gap-2 text-base',
						'bg-gradient-to-r from-blue-500 to-blue-600',
					)}
				>
					Continue <ArrowRight className="h-5 w-5" />
				</Button>

				<Button
					onClick={prevStep}
					variant="outline"
					className="w-full py-6 flex items-center justify-center gap-2 text-base"
				>
					<ArrowLeft className="h-5 w-5" /> Go Back
				</Button>
			</div>
		</div>
	);
}
