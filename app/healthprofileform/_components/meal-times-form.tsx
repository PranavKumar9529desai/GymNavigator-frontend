'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
	useHealthProfileStore,
	type MealTimes,
} from '../_store/health-profile-store';

const mealOptions: { value: MealTimes; label: string }[] = [
	{ value: '2', label: '2 Meals per day' },
	{ value: '3', label: '3 Meals per day' },
	{ value: '4+', label: '4+ Meals per day' },
];

export default function MealTimesForm() {
	const { mealTimes, setMealTimes, nextStep, prevStep } =
		useHealthProfileStore();

	const handleSubmit = () => {
		nextStep();
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">Meal Times</h1>
				<p className="text-gray-500 mb-6">
					How many meals do you typically have per day?
				</p>

				<div className="space-y-4">
					{mealOptions.map((option) => (
						<button
							type="button"
							key={option.value}
							onClick={() => setMealTimes(option.value)}
							className={cn(
								'w-full p-4 rounded-lg border flex items-center justify-between',
								mealTimes === option.value
									? 'border-blue-500 bg-blue-50 text-blue-700'
									: 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
							)}
						>
							<span className="font-medium">{option.label}</span>
							{mealTimes === option.value && (
								<div className="h-4 w-4 rounded-full bg-blue-500" />
							)}
						</button>
					))}
				</div>
			</div>

			<div className="mt-8 flex flex-col gap-3">
				<Button
					onClick={handleSubmit}
					disabled={!mealTimes}
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
