'use client';

import { useState } from 'react';
import type { WorkoutPlan } from '../../_actions/get-workout-plans';

interface Props {
	workoutPlans: WorkoutPlan[];
	onFilterChange: (filtered: WorkoutPlan[]) => void;
}

export default function WorkoutSearchFilters({
	workoutPlans,
	onFilterChange,
}: Props) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [selectedMuscleTargets, setSelectedMuscleTargets] = useState<string[]>(
		[],
	);

	// Get unique muscle targets and days from all workout plans
	const uniqueMuscleTargets = Array.from(
		new Set(
			workoutPlans.flatMap((plan) =>
				plan.schedules.map((schedule) => schedule.muscleTarget),
			),
		),
	).sort();

	const uniqueDays = Array.from(
		new Set(
			workoutPlans.flatMap((plan) => plan.schedules.map((s) => s.dayOfWeek)),
		),
	).sort();

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		filterWorkouts(query, selectedDays, selectedMuscleTargets);
	};

	const handleDayFilter = (day: string) => {
		const newDays = selectedDays.includes(day)
			? selectedDays.filter((d) => d !== day)
			: [...selectedDays, day];
		setSelectedDays(newDays);
		filterWorkouts(searchQuery, newDays, selectedMuscleTargets);
	};

	const handleMuscleFilter = (muscle: string) => {
		const newMuscles = selectedMuscleTargets.includes(muscle)
			? selectedMuscleTargets.filter((m) => m !== muscle)
			: [...selectedMuscleTargets, muscle];
		setSelectedMuscleTargets(newMuscles);
		filterWorkouts(searchQuery, selectedDays, newMuscles);
	};

	const filterWorkouts = (query: string, days: string[], muscles: string[]) => {
		let filtered = workoutPlans;

		// Search by name or description
		if (query) {
			const lowerQuery = query.toLowerCase();
			filtered = filtered.filter(
				(plan) =>
					plan.name.toLowerCase().includes(lowerQuery) ||
					(plan.description?.toLowerCase() || '').includes(lowerQuery),
			);
		}

		// Filter by selected days
		if (days.length > 0) {
			filtered = filtered.filter((plan) =>
				plan.schedules.some((schedule) => days.includes(schedule.dayOfWeek)),
			);
		}

		// Filter by selected muscle targets
		if (muscles.length > 0) {
			filtered = filtered.filter((plan) =>
				plan.schedules.some((schedule) =>
					muscles.includes(schedule.muscleTarget),
				),
			);
		}

		onFilterChange(filtered);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="space-y-6">
				{/* Search Input */}
				<div>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg
								className="h-5 w-5 text-gray-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<input
							type="text"
							placeholder="Search workout plans..."
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
						/>
					</div>
				</div>

				{/* Active Filters Summary */}
				{(selectedDays.length > 0 || selectedMuscleTargets.length > 0) && (
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span>Active filters:</span>
						<div className="flex flex-wrap gap-2">
							{selectedDays.map((day) => (
								<span
									key={day}
									className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
								>
									{day}
									<button
										type="button"
										onClick={() => handleDayFilter(day)}
										className="ml-1 inline-flex items-center justify-center"
										aria-label={`Remove ${day} filter`}
									>
										<svg
											className="h-3 w-3"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<title>Remove {day} filter</title>
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
								</span>
							))}
							{selectedMuscleTargets.map((muscle) => (
								<span
									key={muscle}
									className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
								>
									{muscle}
									<button
										type="button"
										onClick={() => handleMuscleFilter(muscle)}
										className="ml-1 inline-flex items-center justify-center"
										aria-label={`Remove ${muscle} filter`}
									>
										<svg
											className="h-3 w-3"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<title>Remove {muscle} filter</title>
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
								</span>
							))}
						</div>
					</div>
				)}

				{/* Filter Groups */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Days Filter */}
					<div>
						<h3 className="font-medium mb-3 text-gray-900">Training Days</h3>
						<div className="flex flex-wrap gap-2">
							{uniqueDays.map((day) => (
								<button
									key={day}
									onClick={() => handleDayFilter(day)}
									type="button"
									className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
										selectedDays.includes(day)
											? 'bg-blue-500 text-white shadow-sm'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									{day}
								</button>
							))}
						</div>
					</div>

					{/* Muscle Targets Filter */}
					<div>
						<h3 className="font-medium mb-3 text-gray-900">Muscle Groups</h3>
						<div className="flex flex-wrap gap-2">
							{uniqueMuscleTargets.map((muscle) => (
								<button
									key={muscle}
									onClick={() => handleMuscleFilter(muscle)}
									type="button"
									className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
										selectedMuscleTargets.includes(muscle)
											? 'bg-indigo-500 text-white shadow-sm'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									{muscle}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
