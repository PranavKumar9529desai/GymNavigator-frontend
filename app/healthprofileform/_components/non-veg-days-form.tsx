'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function NonVegDaysForm() {
	const { nonVegDays, toggleNonVegDay, nextStep, prevStep } =
		useHealthProfileStore();

	// Check if at least one day is selected
	const anyDaySelected = nonVegDays.some((day) => day.selected);

	const handleToggleDay = (day: string) => {
		toggleNonVegDay(day);
	};

	const handleSubmit = () => {
		// If no days are selected, select all days as a default
		if (!anyDaySelected) {
			nonVegDays.forEach((day) => {
				if (!day.selected) {
					toggleNonVegDay(day.day);
				}
			});
		}
		nextStep();
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">
					Non-Vegetarian Days
				</h1>
				<p className="text-gray-500 mb-6">
					Select the days when you prefer to have non-vegetarian meals
				</p>

				<div className="space-y-4">
					{nonVegDays.map((day) => (
						<div key={day.day} className="flex items-center space-x-3">
							<Checkbox
								id={`day-${day.day}`}
								checked={day.selected}
								onCheckedChange={() => handleToggleDay(day.day)}
								className="border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<label
								htmlFor={`day-${day.day}`}
								className="text-base font-medium text-gray-700 cursor-pointer"
							>
								{day.day}
							</label>
						</div>
					))}

					{/* Add a "Select All" option */}
					<div className="pt-3 border-t border-gray-200">
						<Button
							variant="outline"
							type="button"
							onClick={() =>
								nonVegDays.forEach((day) => {
									if (!day.selected) toggleNonVegDay(day.day);
								})
							}
							className="mr-2"
						>
							Select All
						</Button>
						<Button
							variant="outline"
							type="button"
							onClick={() =>
								nonVegDays.forEach((day) => {
									if (day.selected) toggleNonVegDay(day.day);
								})
							}
						>
							Clear All
						</Button>
					</div>
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
