'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { WorkoutPlan } from '../../_actions/generate-ai-workout';
import type { UserData } from '../../_actions/get-user-by-id';
import { useWorkoutViewStore } from '../../_store/workout-view-store';
import WorkoutForm from '../workout-form/workout-form';
import WorkoutResults from '../workout-result/workout-results';
import ClientDisplay from './client-display';

interface ClientWorkoutGeneratorProps {
	user: UserData | null;
	onWorkoutGenerated?: () => void;
}

export default function ClientWorkoutGenerator({
	user,
	onWorkoutGenerated,
}: ClientWorkoutGeneratorProps) {
	const { loadGeneratedPlan } = useWorkoutViewStore();
	const [showResults, setShowResults] = useState(false);

	const handleWorkoutGenerated = (plan: WorkoutPlan) => {
		loadGeneratedPlan(plan);
		setShowResults(true);
		onWorkoutGenerated?.();
	};

	const handleDiscardWorkout = () => {
		setShowResults(false);
	};

	const { currentWorkout } = useWorkoutViewStore.getState();
	const planToShow =
		currentWorkout && !('clientName' in currentWorkout) ? currentWorkout : null;

	return (
		<div className="space-y-6">
			{!showResults ? (
				<motion.div
					className="grid gap-6 md:grid-cols-5"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="md:col-span-2">
						<ClientDisplay user={user} />
					</div>
					<div className="md:col-span-3 border rounded-lg p-5 sm:p-6 bg-white dark:bg-gray-950">
						<h2 className="text-xl font-medium mb-4">
							Generate AI Workout Plan
						</h2>
						<WorkoutForm
							user={user}
							onWorkoutGenerated={handleWorkoutGenerated}
						/>
					</div>
				</motion.div>
			) : planToShow ? (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="rounded-lg p-3 sm:p-8 dark:bg-gray-950"
				>
					<div className="mb-6">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleDiscardWorkout}
							className="text-muted-foreground hover:text-foreground -ml-2"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to form
						</Button>
					</div>
					<WorkoutResults
						workoutPlan={planToShow}
						onDiscard={handleDiscardWorkout}
						userId={user?.id || ''}
						userName={user?.name}
					/>
				</motion.div>
			) : null}
		</div>
	);
}
