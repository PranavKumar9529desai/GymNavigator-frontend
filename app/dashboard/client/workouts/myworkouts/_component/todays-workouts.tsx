"use client";

import { Activity, CheckCircle2, ChevronDown, ChevronUp, Dumbbell, Flame, Target, Timer } from "lucide-react";
import { useState } from "react";
import type { AssignedWorkout } from "../_actions/get-todays-workout";
import { RestDay } from "./rest-day";

interface TodaysWorkoutsProps {
	workouts: AssignedWorkout[];
}

export const TodaysWorkouts = ({ workouts: initialWorkouts }: TodaysWorkoutsProps) => {
	const [workouts] = useState<AssignedWorkout[]>(initialWorkouts);
	const [expandedWorkout, setExpandedWorkout] = useState<string | null>(
		workouts.length > 0 ? workouts[0].id : null
	);

	const toggleExpand = (id: string) => {
		setExpandedWorkout(expandedWorkout === id ? null : id);
	};

	// Calculate total exercises across all workouts
	const totalExercises = workouts.reduce(
		(total, workout) => total + workout.workout.exercises.length, 
		0
	);

	// If no workouts, show rest day component
	if (workouts.length === 0) {
		return <RestDay />;
	}

	return (
		<div className="w-full">
			{/* Header Section with Gradient Background */}
			<div className="relative mb-6 rounded-2xl overflow-hidden">
				<div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
					<div className="flex items-center gap-3 mb-2">
						<div className="bg-white/20 p-2 rounded-full">
							<Dumbbell className="w-5 h-5 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white">Today's Workout</h2>
					</div>
					<p className="text-blue-100">Complete your assigned exercises to track your progress</p>
					
					{/* Stats Summary */}
					<div className="flex flex-wrap gap-4 mt-4">
						<div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center gap-2">
							<Target className="w-4 h-4" />
							<span>{workouts.length} {workouts.length === 1 ? 'Workout' : 'Workouts'}</span>
						</div>
						<div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center gap-2">
							<Flame className="w-4 h-4" />
							<span>{totalExercises} {totalExercises === 1 ? 'Exercise' : 'Exercises'}</span>
						</div>
					</div>
				</div>
				
				{/* Decorative wave */}
				<div className="absolute bottom-0 left-0 right-0">
					<svg 
						xmlns="http://www.w3.org/2000/svg" 
						viewBox="0 0 1440 80" 
						className="w-full h-6"
						aria-hidden="true"
						role="img"
					>
						<title>Decorative wave pattern</title>
						<path 
							fill="#ffffff" 
							fillOpacity="1" 
							d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" 
						/>
					</svg>
				</div>
			</div>

			<div className="space-y-6">
				{workouts.map((assignedWorkout) => (
					<div
						key={assignedWorkout.id}
						className="bg-white rounded-xl border border-gray-100 overflow-hidden"
					>
						{/* Workout Header - Always visible */}
						<button 
							type="button"
							className={`w-full text-left p-5 border-b border-gray-100 transition-colors ${
								expandedWorkout === assignedWorkout.id ? "bg-blue-50" : ""
							}`}
							onClick={() => toggleExpand(assignedWorkout.id)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									toggleExpand(assignedWorkout.id);
								}
							}}
							aria-expanded={expandedWorkout === assignedWorkout.id}
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-gray-900 mb-1">
										{assignedWorkout.workout.name}
									</h3>
									<p className="text-gray-600 text-base line-clamp-2">
										{assignedWorkout.workout.description}
									</p>
								</div>
								<div className="flex flex-col items-end gap-2 ml-2">
									{assignedWorkout.isCompleted ? (
										<span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm whitespace-nowrap">
											<CheckCircle2 className="w-4 h-4" />
											Completed
										</span>
									) : (
										<span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm whitespace-nowrap">
											In Progress
										</span>
									)}
									{expandedWorkout === assignedWorkout.id ? (
										<ChevronUp className="w-5 h-5 text-gray-500" />
									) : (
										<ChevronDown className="w-5 h-5 text-gray-500" />
									)}
								</div>
							</div>
						</button>

						{/* Exercises List - Expandable */}
						{expandedWorkout === assignedWorkout.id && (
							<div className="p-5">
								<h4 className="text-lg font-medium text-gray-900 mb-4">Exercises</h4>
								<div className="space-y-5">
									{assignedWorkout.workout.exercises.map((exercise, index) => (
										<div
											key={exercise.id}
											className={`overflow-hidden rounded-lg transition-all ${
												index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"
											}`}
										>
											{/* Exercise number badge */}
											<div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium">
												Exercise {index + 1} of {assignedWorkout.workout.exercises.length}
											</div>
											
											<div className="p-4">
												{/* Mobile-optimized layout */}
												<div className="flex flex-col gap-4">
													{exercise.exercise.image_url ? (
														<img
															src={exercise.exercise.image_url}
															alt={exercise.exercise.name}
															className="w-full h-48 rounded-lg object-cover"
														/>
													) : (
														<div className="flex items-center justify-center w-full h-48 bg-gray-200 rounded-lg">
															<Dumbbell className="w-10 h-10 text-gray-400" />
														</div>
													)}
													
													<div className="flex-1">
														<div className="flex flex-col justify-between gap-2 mb-3">
															<h5 className="font-medium text-gray-900 text-lg">
																{exercise.exercise.name}
															</h5>
															<span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">
																{exercise.exercise.MuscleGroup.name}
															</span>
														</div>
														
														{/* Exercise details */}
														<div className="grid grid-cols-2 gap-3 text-base text-gray-600 mb-3">
															<div className="flex items-center gap-2 bg-white/50 p-3 rounded">
																<Dumbbell className="w-5 h-5 text-blue-600" />
																<span>{exercise.sets} × {exercise.reps}</span>
															</div>
															<div className="flex items-center gap-2 bg-white/50 p-3 rounded">
																<Timer className="w-5 h-5 text-blue-600" />
																<span>{exercise.rest}s rest</span>
															</div>
														</div>
														
														{exercise.notes && (
															<p className="text-base text-gray-600 mt-3 italic bg-white/70 p-3 rounded">
																"{exercise.notes}"
															</p>
														)}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
