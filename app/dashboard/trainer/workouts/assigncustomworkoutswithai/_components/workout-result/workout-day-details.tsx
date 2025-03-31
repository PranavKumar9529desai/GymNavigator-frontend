import { Badge } from '@/components/ui/badge';
import { CheckCheck, Clock, Dumbbell, FlameIcon } from 'lucide-react';
import type { WorkoutSchedule } from '../../_actions/generate-ai-workout';

interface WorkoutDayDetailsProps {
	currentSchedule: WorkoutSchedule;
}

// Exercise item component to handle layout issues
interface ExerciseItemProps {
	exercise: {
		name: string;
		sets: string | number;
		reps: string | number;
		description: string;
	};
	index: number;
}

function ExerciseItem({ exercise, index }: ExerciseItemProps) {
	return (
		<div className="rounded-xl p-3 sm:p-4 transition-all hover:shadow-md group bg-gradient-to-br from-transparent to-muted/5 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/5">
			<div className="flex flex-col sm:flex-row sm:items-center gap-2">
				<div className="flex items-start gap-2 min-w-0 flex-1">
					<span className="bg-indigo-600 text-white text-sm rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center font-bold shrink-0 shadow-sm mt-0.5">
						{index + 1}
					</span>
					<div className="min-w-0 flex-1">
						<h4 className="font-medium text-sm sm:text-base group-hover:text-indigo-600 transition-colors truncate">
							{exercise.name}
						</h4>
						<p className="text-xs sm:text-sm mt-1 text-muted-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
							{exercise.description}
						</p>
					</div>
				</div>
				<div className="ml-9 sm:ml-0 mt-1 sm:mt-0">
					<span className="text-xs sm:text-sm font-medium bg-muted/80 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 group-hover:text-indigo-600 px-2.5 py-1.5 rounded-full transition-colors inline-block">
						{exercise.sets} × {exercise.reps}
					</span>
				</div>
			</div>
		</div>
	);
}

export default function WorkoutDayDetails({
	currentSchedule,
}: WorkoutDayDetailsProps) {
	return (
		<div className="rounded-xl border bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
			{/* Workout header */}
			<div className="p-4 sm:p-5 bg-indigo-50/50 dark:bg-indigo-900/10 border-b relative overflow-hidden">
				<div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start">
					<div>
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<span className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-full h-8 w-8 shadow-sm">
								<Dumbbell className="h-4 w-4" />
							</span>
							{currentSchedule.muscleTarget}
						</h3>
						<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
							<span className="flex items-center gap-1 text-sm">
								<Clock className="h-4 w-4 text-indigo-600" />
								{currentSchedule.duration} minutes
							</span>
							<span className="flex items-center gap-1 text-sm">
								<FlameIcon className="h-4 w-4 text-indigo-600" />~
								{currentSchedule.calories} calories
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Exercise list */}
			<div className="p-2 sm:p-3">
				<div className="space-y-2">
					{currentSchedule.exercises.map((exercise, index) => (
						<ExerciseItem
							key={`${exercise.name}-${index}`}
							exercise={exercise}
							index={index}
						/>
					))}

					<div className="w-full flex justify-center pt-3 sm:pt-4">
						<Badge
							variant="outline"
							className="flex items-center gap-2 py-1.5 px-3 sm:py-2 sm:px-4 border-indigo-200 dark:border-indigo-800/30"
						>
							<CheckCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
							Complete All Exercises
						</Badge>
					</div>
				</div>
			</div>
		</div>
	);
}
