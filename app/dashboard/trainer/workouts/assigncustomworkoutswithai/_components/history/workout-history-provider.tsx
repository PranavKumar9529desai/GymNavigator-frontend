'use client';

import { useEffect, useState } from 'react';
import type { WorkoutHistoryItem } from '../../_actions/get-workout-history';
import { getWorkoutHistory } from '../../_actions/get-workout-history';
import WorkoutHistory from './workout-history';

interface WorkoutHistoryProviderProps {
	userId: string;
	serverFallbackHistory: WorkoutHistoryItem[];
	onViewWorkout?: (workout: WorkoutHistoryItem) => void; // Add prop
}

export function WorkoutHistoryProvider({
	userId,
	serverFallbackHistory,
	onViewWorkout, // Destructure prop
}: WorkoutHistoryProviderProps) {
	const [history, setHistory] = useState<WorkoutHistoryItem[]>(
		serverFallbackHistory,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [dataSource, setDataSource] = useState<'local' | 'server'>('server'); // Default to server

	useEffect(() => {
		async function fetchHistory() {
			setIsLoading(true);
			// Try fetching from server first
			const serverResponse = await getWorkoutHistory(userId);
			if (serverResponse.success && serverResponse.data) {
				setHistory(serverResponse.data);
				setDataSource('server');
			} else {
				// Fallback to local storage (or show error)
				// In this example, we stick with the server fallback if server fails
				console.warn(
					'Failed to fetch server history, using initial fallback.',
					serverResponse.error,
				);
				setHistory(serverFallbackHistory); // Keep using fallback
				setDataSource('server'); // Indicate we attempted server
			}
			setIsLoading(false);
		}

		// Fetch history when userId changes
		if (userId) {
			void fetchHistory();
		} else {
			// Clear history if no user ID
			setHistory([]);
			setIsLoading(false);
		}
	}, [userId, serverFallbackHistory]); // Depend on userId and the fallback

	return (
		<WorkoutHistory
			history={history}
			isLoading={isLoading}
			onViewWorkout={onViewWorkout} // Pass prop down
			dataSource={dataSource}
		/>
	);
}
