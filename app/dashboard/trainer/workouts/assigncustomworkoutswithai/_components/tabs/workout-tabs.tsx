'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Dumbbell, Loader2, Sparkles } from 'lucide-react';
import { Suspense, useState } from 'react';
import type { UserData } from '../../_actions/get-user-by-id';
import type { WorkoutHistoryItem } from '../../_actions/get-workout-history';
import { useWorkoutViewStore } from '../../_store/workout-view-store';
import ClientWorkoutGenerator from '../client display/client-workout-generator';
import { WorkoutHistoryProvider } from '../history/workout-history-provider';
import WorkoutResults from '../workout-result/workout-results';

interface WorkoutTabsProps {
	userId: string;
	user: UserData | null;
	serverFallbackHistory: WorkoutHistoryItem[];
}

// Loading skeleton for the generate tab
function GenerateWorkoutSkeleton() {
	return (
		<div className="space-y-6 p-6">
			{/* Form header skeleton */}
			<div className="space-y-4">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-72" />
			</div>

			{/* Form fields skeleton */}
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={`field-${i}`} className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full" />
					</div>
				))}
			</div>

			{/* Submit button skeleton */}
			<div className="flex justify-end">
				<Skeleton className="h-10 w-32" />
			</div>
		</div>
	);
}

// Loading skeleton for the history tab
function HistorySkeleton() {
	return (
		<div className="space-y-6 p-6">
			<h3 className="text-xl font-medium">Previously Generated Workouts</h3>
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={`history-${i}`} className="p-4 border rounded-lg space-y-3">
						<div className="flex justify-between items-start">
							<Skeleton className="h-6 w-1/3" />
							<Skeleton className="h-5 w-20" />
						</div>
						<Skeleton className="h-4 w-3/4" />
						<div className="flex flex-wrap gap-2">
							<Skeleton className="h-8 w-24" />
							<Skeleton className="h-8 w-32" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default function WorkoutTabs({
	userId,
	user,
	serverFallbackHistory,
}: WorkoutTabsProps) {
	const [activeTab, setActiveTab] = useState<
		'generate' | 'history' | 'workout'
	>('generate');

	const {
		currentWorkout,
		showWorkoutDetails,
		setShowWorkoutDetails,
		reset: resetWorkoutView,
	} = useWorkoutViewStore();

	const handleTabChange = (value: string) => {
		const newTab = value as 'generate' | 'history' | 'workout';
		setActiveTab(newTab);

		if (newTab !== 'workout') {
			resetWorkoutView();
			setShowWorkoutDetails(false);
		} else {
			if (currentWorkout) {
				setShowWorkoutDetails(true);
			}
		}
	};

	const handleBackToHistory = () => {
		resetWorkoutView();
		setActiveTab('history');
		setShowWorkoutDetails(false);
	};

	const handleWorkoutGeneratedOrViewed = () => {
		setActiveTab('workout');
	};

	const planToShow = currentWorkout
		? 'workoutPlan' in currentWorkout
			? currentWorkout.workoutPlan
			: currentWorkout
		: null;

	const clientName = currentWorkout
		? 'clientName' in currentWorkout
			? currentWorkout.clientName
			: user?.name
		: user?.name;

	return (
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			className="space-y-8"
		>
			<div className="sticky top-0 z-10 pb-4 pt-2 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-lg">
				<div className="container max-w-5xl mx-auto px-4">
					<div className="flex justify-center">
						<TabsList className="w-full max-w-md bg-gradient-to-r from-indigo-50/80 via-blue-50/80 to-indigo-50/80 dark:from-indigo-950/80 dark:via-blue-950/80 dark:to-indigo-950/80 border border-indigo-100/50 dark:border-indigo-800/30 shadow-md rounded-lg p-1.5">
							<TabsTrigger
								value="generate"
								className="flex-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-600/90 data-[state=active]:via-blue-600/80 data-[state=active]:to-indigo-700/90 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md py-2"
							>
								<Sparkles className="h-4 w-4 mr-2" />
								Generate
							</TabsTrigger>
							<TabsTrigger
								value="history"
								className="flex-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-600/90 data-[state=active]:via-blue-600/80 data-[state=active]:to-indigo-700/90 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md py-2"
							>
								<Dumbbell className="h-4 w-4 mr-2" />
								History
							</TabsTrigger>
							<TabsTrigger
								value="workout"
								disabled={!currentWorkout && !showWorkoutDetails}
								className="flex-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-600/90 data-[state=active]:via-blue-600/80 data-[state=active]:to-indigo-700/90 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md py-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Loader2 className="h-4 w-4 mr-2" />
								Workout
							</TabsTrigger>
						</TabsList>
					</div>
				</div>
			</div>

			<TabsContent
				value="generate"
				className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
			>
				<div className="container max-w-5xl mx-auto px-4">
					<Suspense fallback={<GenerateWorkoutSkeleton />}>
						<ClientWorkoutGenerator
							user={user}
							onWorkoutGenerated={handleWorkoutGeneratedOrViewed}
						/>
					</Suspense>
				</div>
			</TabsContent>

			<TabsContent
				value="history"
				className="focus-visible:outline-none focus-visible:ring-0"
			>
				<div className="container max-w-5xl mx-auto px-4">
					<Suspense fallback={<HistorySkeleton />}>
						<div className="space-y-6">
							<div className="bg-gradient-to-br from-indigo-50/50 via-blue-50/30 to-indigo-50/50 dark:from-indigo-950/50 dark:via-blue-950/30 dark:to-indigo-950/50 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-800/20 mb-6">
								<h3 className="text-xl font-medium">
									Previously Generated Workouts
								</h3>
								<p className="text-sm text-muted-foreground mt-1">
									View and load your previously created workout plans
								</p>
							</div>
							<WorkoutHistoryProvider
								userId={userId}
								serverFallbackHistory={serverFallbackHistory}
								onViewWorkout={handleWorkoutGeneratedOrViewed}
							/>
						</div>
					</Suspense>
				</div>
			</TabsContent>

			<TabsContent
				value="workout"
				className="focus-visible:outline-none focus-visible:ring-0"
			>
				<div className="container max-w-5xl mx-auto px-4">
					{planToShow ? (
						<div className="space-y-6">
							<div className="bg-gradient-to-br from-indigo-50/50 via-blue-50/30 to-indigo-50/50 dark:from-indigo-950/50 dark:via-blue-950/30 dark:to-indigo-950/50 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-800/20 flex items-center justify-between">
								<Button
									variant="ghost"
									size="sm"
									className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
									onClick={handleBackToHistory}
								>
									<ChevronLeft className="h-4 w-4" />
									<span>Back to history</span>
								</Button>
								<div className="text-sm">
									Workout for:{' '}
									<span className="font-medium text-indigo-700 dark:text-indigo-400">
										{clientName || 'Selected Client'}
									</span>
								</div>
							</div>

							<WorkoutResults
								workoutPlan={planToShow}
								onDiscard={handleBackToHistory}
								userId={userId}
								userName={clientName}
							/>
						</div>
					) : (
						<div className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm border border-indigo-100/50 dark:border-indigo-800/30 rounded-lg shadow-sm">
							<div className="flex flex-col items-center justify-center py-16 text-center px-4">
								<div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center mb-4 shadow-inner">
									<Dumbbell className="h-8 w-8 text-indigo-600/70 dark:text-indigo-400/70" />
								</div>
								<h3 className="text-xl font-medium mb-2">
									No Workout Selected
								</h3>
								<p className="text-muted-foreground max-w-md mb-6">
									Please select a workout from your history or generate a new
									one to view it here.
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => setActiveTab('history')}
										className="gap-1 border-indigo-200 dark:border-indigo-800/30"
									>
										<ChevronLeft className="h-4 w-4" />
										Go to History
									</Button>
									<Button
										variant="default"
										onClick={() => setActiveTab('generate')}
										className="gap-1 bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-indigo-700/90 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md"
									>
										<Sparkles className="h-4 w-4" />
										Generate New Workout
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</TabsContent>
		</Tabs>
	);
}
