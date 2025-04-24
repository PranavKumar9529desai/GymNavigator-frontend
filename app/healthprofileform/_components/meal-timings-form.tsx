'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function MealTimingsForm() {
	const {
		mealTimes,
		mealTimings,
		updateMealTime,
		nextStep,
		prevStep,
		setMealTimes,
	} = useHealthProfileStore();

	// Ensure meal timings are populated even if somehow they're empty
	useEffect(() => {
		if (mealTimes && (!mealTimings || mealTimings.length === 0)) {
			setMealTimes(mealTimes);
		}
	}, [mealTimes, mealTimings, setMealTimes]);

	const handleTimeChange = (index: number, time: string) => {
		updateMealTime(index, time);
	};

	const handleSubmit = () => {
		nextStep();
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">Meal Schedule</h1>
				<p className="text-gray-500 mb-6">
					Select your preferred time for each meal
				</p>

				<div className="space-y-5">
					{mealTimings.map((meal, index) => (
						<div
							key={`${meal.name}-${index}`}
							className="border border-gray-200 rounded-lg p-4"
						>
							{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
							<label className="block text-base font-medium text-gray-700 mb-2">
								{meal.name}
							</label>
							<div className="flex items-center">
								<Clock className="h-5 w-5 text-gray-400 mr-2" />
								<input
									type="time"
									value={meal.time}
									onChange={(e) => handleTimeChange(index, e.target.value)}
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mt-8 flex flex-col gap-3">
				<Button
					onClick={handleSubmit}
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
