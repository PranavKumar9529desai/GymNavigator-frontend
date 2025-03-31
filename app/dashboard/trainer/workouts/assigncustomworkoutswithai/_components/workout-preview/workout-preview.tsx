'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, Dumbbell, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { WorkoutPlan } from '../../_actions/generate-ai-workout';
import type { UserData } from '../../_actions/get-user-by-id';

// Define interface for displayed exercise
interface ExerciseDisplay {
	id: string;
	name: string;
	sets: number;
	reps: string;
	rest: string;
	notes?: string;
}

// Define interface for displayed workout
interface WorkoutDisplay {
	name: string;
	description: string;
	goal: string;
	duration: number;
	experience: string;
	days: string[];
	exercises: ExerciseDisplay[];
}

// Initialize with null - will be populated when the AI generates a workout
// const workoutData = null;

interface WorkoutPreviewProps {
	user: UserData | null;
	generatedWorkout?: WorkoutPlan;
}

export default function WorkoutPreview({
	user,
	generatedWorkout: propWorkout,
}: WorkoutPreviewProps) {
	const [isAssigning, setIsAssigning] = useState(false);
	const [assigned, setAssigned] = useState(false);
	const [generatedWorkout, setGeneratedWorkout] =
		useState<WorkoutDisplay | null>(null);

	// Update local state when prop changes
	useEffect(() => {
		if (propWorkout) {
			// Transform WorkoutPlan to WorkoutDisplay format
			const displayWorkout: WorkoutDisplay = {
				name: propWorkout.name,
				description: propWorkout.description || '',
				goal: propWorkout.schedules[0]?.muscleTarget || 'General fitness',
				duration: Math.round(
					propWorkout.schedules.reduce((sum, s) => sum + s.duration, 0) /
						propWorkout.schedules.length,
				),
				experience: 'intermediate', // Default, can be made dynamic
				days: propWorkout.schedules.map((s) => s.dayOfWeek),
				exercises: propWorkout.schedules.flatMap((s) =>
					s.exercises.map((e, i) => ({
						id: `${s.dayOfWeek}-${i}`,
						name: e.name,
						sets: e.sets,
						reps: e.reps,
						rest: '60 sec', // Default, can be made dynamic
						notes: e.description,
					})),
				),
			};

			setGeneratedWorkout(displayWorkout);
		}
	}, [propWorkout]);

	const handleAssignWorkout = () => {
		if (!user || !generatedWorkout) return;

		setIsAssigning(true);

		// Simulate API call
		setTimeout(() => {
			console.log(`Assigning workout to ${user.name} (ID: ${user.id})`);
			setIsAssigning(false);
			setAssigned(true);
		}, 1500);
	};

	if (!generatedWorkout) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
				<div className="bg-muted/30 p-6 rounded-full mb-4">
					<Dumbbell
						className="h-12 w-12 text-muted-foreground/70"
						strokeWidth={1.5}
					/>
				</div>
				<h3 className="text-xl font-medium mb-2">No Workout Generated Yet</h3>
				<p className="text-muted-foreground max-w-md">
					{user
						? 'Complete the form and click "Generate AI Workout" to create a personalized workout plan.'
						: 'Select a client first, then complete the form to generate a personalized workout plan.'}
				</p>
			</div>
		);
	}

	if (assigned) {
		return (
			<Alert className="bg-green-50 border-green-200 text-green-800">
				<CheckCircle className="h-5 w-5" />
				<AlertTitle className="text-green-800">
					Workout Successfully Assigned!
				</AlertTitle>
				<AlertDescription className="text-green-700">
					"{generatedWorkout.name}" has been assigned to {user?.name}. They'll
					be notified about their new workout plan.
				</AlertDescription>
				<Button
					variant="outline"
					className="mt-4 border-green-200 bg-green-100/50 text-green-800 hover:bg-green-100 hover:text-green-900"
					onClick={() => setAssigned(false)}
				>
					Create Another Workout
				</Button>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-1.5">
				<h3 className="text-xl font-semibold">{generatedWorkout.name}</h3>
				<p className="text-sm text-muted-foreground">
					{generatedWorkout.description}
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				<Badge variant="secondary" className="flex items-center gap-1">
					<Dumbbell className="h-3 w-3" />
					{generatedWorkout.goal}
				</Badge>
				<Badge variant="secondary" className="flex items-center gap-1">
					<Clock className="h-3 w-3" />
					{generatedWorkout.duration} minutes
				</Badge>
				<Badge variant="secondary">{generatedWorkout.experience}</Badge>
				{generatedWorkout.days.map((day) => (
					<Badge
						key={day}
						variant="outline"
						className="flex items-center gap-1"
					>
						<Calendar className="h-3 w-3" />
						{day}
					</Badge>
				))}
			</div>

			<Accordion type="single" collapsible className="w-full">
				{generatedWorkout.exercises.map((exercise) => (
					<AccordionItem key={exercise.id} value={exercise.id}>
						<AccordionTrigger className="hover:no-underline py-4 px-4 -mx-4 rounded-md hover:bg-muted/30 transition-colors">
							<div className="flex justify-between w-full pr-2 text-left">
								<div className="font-medium">{exercise.name}</div>
								<div className="text-sm text-muted-foreground hidden sm:block">
									{exercise.sets} sets × {exercise.reps} reps
								</div>
							</div>
						</AccordionTrigger>
						<AccordionContent className="text-sm px-1">
							<div className="grid grid-cols-3 gap-2 mb-2">
								<div className="border rounded-md p-3 text-center">
									<div className="text-xs text-muted-foreground mb-1">Sets</div>
									<div className="font-medium">{exercise.sets}</div>
								</div>
								<div className="border rounded-md p-3 text-center">
									<div className="text-xs text-muted-foreground mb-1">Reps</div>
									<div className="font-medium">{exercise.reps}</div>
								</div>
								<div className="border rounded-md p-3 text-center">
									<div className="text-xs text-muted-foreground mb-1">Rest</div>
									<div className="font-medium">{exercise.rest}</div>
								</div>
							</div>
							{exercise.notes && (
								<div className="text-sm text-muted-foreground mt-3 p-3 bg-muted/20 rounded-md">
									<span className="font-medium text-foreground block mb-1">
										Instructions:
									</span>
									{exercise.notes}
								</div>
							)}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			<div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t mt-6">
				<Button variant="outline" size="sm" className="w-full sm:w-auto h-10">
					<Edit className="h-4 w-4 mr-2" /> Edit Workout
				</Button>
				<Button
					onClick={handleAssignWorkout}
					disabled={isAssigning || !user}
					className="w-full sm:w-auto h-11 sm:h-10 px-6"
					size="default"
				>
					{isAssigning ? (
						<>
							<div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
							Assigning...
						</>
					) : (
						'Assign to Client'
					)}
				</Button>
			</div>
		</div>
	);
}
