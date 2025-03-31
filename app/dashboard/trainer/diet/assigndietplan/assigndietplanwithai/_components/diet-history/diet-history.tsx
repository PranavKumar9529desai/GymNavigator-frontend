'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import {
	Calendar,
	Check,
	ChevronRight,
	RefreshCw,
	Search,
	UtensilsCrossed,
} from 'lucide-react';
import React, { useState } from 'react';
import type { DietHistoryItem } from '../../_store/diet-view-store';
import { useDietHistoryQuery } from './use-diet-history';

interface DietHistoryProps {
	onSelectDiet: (diet: DietHistoryItem) => void;
	userId: string;
}

export function DietHistory({ onSelectDiet, userId }: DietHistoryProps) {
	const [searchQuery, setSearchQuery] = useState('');

	// Use React Query hook for fetching diet history
	const {
		data: history = [],
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
	} = useDietHistoryQuery(userId);

	const filteredHistory = React.useMemo(() => {
		if (!searchQuery.trim()) return history;

		const query = searchQuery.toLowerCase();
		return history.filter(
			(item) =>
				item.dietPlan.name.toLowerCase().includes(query) ||
				item.dietPlan.description?.toLowerCase().includes(query),
		);
	}, [history, searchQuery]);

	// Show loading state
	if (isLoading && !history.length) {
		return (
			<div className="flex justify-center items-center p-8">
				<RefreshCw className="h-6 w-6 animate-spin" />
			</div>
		);
	}

	// Show error state
	if (isError) {
		return (
			<div className="space-y-4">
				{history.length > 0 && (
					<div className="flex justify-between items-center">
						<p className="text-sm text-amber-500">
							<span className="font-medium">Note:</span> Using locally saved
							diets
						</p>
						<Button variant="outline" size="sm" onClick={() => refetch()}>
							<RefreshCw className="h-3 w-3 mr-1" /> Sync with server
						</Button>
					</div>
				)}

				{history.length > 0 ? (
					<DietHistoryList
						diets={filteredHistory}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						onSelectDiet={onSelectDiet}
					/>
				) : (
					<div className="p-6 text-center">
						<p className="text-red-500 mb-4">
							{error instanceof Error
								? error.message
								: 'Error loading diet history'}
						</p>
						<Button variant="outline" onClick={() => refetch()}>
							<RefreshCw className="h-4 w-4 mr-2" /> Try Again
						</Button>
					</div>
				)}
			</div>
		);
	}

	// Show fetching state with current data
	if (isFetching && history.length > 0) {
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<p className="text-sm text-muted-foreground">
						Refreshing diet history...
					</p>
					<RefreshCw className="h-4 w-4 animate-spin" />
				</div>
				<DietHistoryList
					diets={filteredHistory}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					onSelectDiet={onSelectDiet}
				/>
			</div>
		);
	}

	// No diets found
	if (filteredHistory.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-medium">No diet plans saved yet</h3>
				<p className="text-sm text-muted-foreground mt-2 mb-4">
					Generate and save a diet plan to see it here
				</p>
			</div>
		);
	}

	// Normal state with data
	return (
		<div className="space-y-4">
			{isFetching && (
				<div className="flex justify-end">
					<RefreshCw className="h-4 w-4 animate-spin" />
				</div>
			)}
			<DietHistoryList
				diets={filteredHistory}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onSelectDiet={onSelectDiet}
			/>
		</div>
	);
}

interface DietHistoryListProps {
	diets: DietHistoryItem[];
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	onSelectDiet: (diet: DietHistoryItem) => void;
}

function DietHistoryList({
	diets,
	searchQuery,
	setSearchQuery,
	onSelectDiet,
}: DietHistoryListProps) {
	return (
		<div className="space-y-4">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search diet plans..."
					className="pl-10"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<div className="grid gap-4">
				{diets.length === 0 ? (
					<div className="text-center p-6">
						<p className="text-muted-foreground">
							No matching diet plans found
						</p>
					</div>
				) : (
					diets.map((item) => (
						<Card
							key={item.id}
							className="overflow-hidden hover:border-green-300 transition-colors cursor-pointer"
							onClick={() => onSelectDiet(item)}
						>
							<CardContent className="p-0">
								<div className="flex items-start gap-3 p-4">
									<div className="flex-shrink-0 p-2 bg-green-100 rounded-md">
										<Calendar className="h-5 w-5 text-green-600" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-start gap-2">
											<h3 className="font-semibold truncate">
												{item.dietPlan.name}
											</h3>
											<div className="flex items-center text-sm text-muted-foreground">
												<span className="whitespace-nowrap">
													{formatDistanceToNow(new Date(item.createdAt), {
														addSuffix: true,
													})}
												</span>
												<ChevronRight className="h-4 w-4 ml-1" />
											</div>
										</div>
										<p className="text-sm text-muted-foreground line-clamp-2 mt-1">
											{item.dietPlan.description || 'No description'}
										</p>
										<div className="flex gap-2 mt-2">
											<div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
												<Check className="h-3 w-3 mr-1" />
												{item.dietPlan.meals.length} meals
											</div>
											<div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
												{Math.round(item.dietPlan.targetCalories)} calories
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
