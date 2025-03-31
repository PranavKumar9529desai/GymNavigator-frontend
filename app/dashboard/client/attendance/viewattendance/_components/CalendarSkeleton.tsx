'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarSkeleton() {
	// Generate unique keys for skeleton items
	const generateKey = (prefix: string, index: number) => `${prefix}-${index}`;

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6">
			{/* Header Section */}
			<div className="flex flex-col items-center space-y-4">
				<div className="w-full flex items-center justify-between px-4 sm:justify-center sm:space-x-8">
					<Skeleton className="h-10 w-10 rounded-full" />
					<div className="flex flex-col items-center space-y-2">
						<Skeleton className="h-8 w-36 sm:w-48" />
					</div>
					<Skeleton className="h-10 w-10 rounded-full" />
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="px-2 sm:px-4">
				{/* Days of week */}
				<div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
					{Array(7)
						.fill(0)
						.map((_, i) => (
							<Skeleton key={generateKey('day', i)} className="h-6 w-full" />
						))}
				</div>

				{/* Calendar grid */}
				<div className="grid grid-cols-7 gap-1 sm:gap-3">
					{Array(35)
						.fill(0)
						.map((_, i) => (
							<Skeleton
								key={generateKey('cell', i)}
								className="w-full aspect-square rounded-xl"
							/>
						))}
				</div>
			</div>

			{/* Legend and Progress */}
			<div className="mt-8 flex flex-col space-y-6 sm:flex-row sm:space-y-0 justify-between items-center p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
				<div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6">
					{Array(4)
						.fill(0)
						.map((_, i) => (
							<div
								key={generateKey('legend', i)}
								className="flex items-center space-x-3"
							>
								<Skeleton className="w-5 h-5 rounded-lg" />
								<Skeleton className="w-16 sm:w-20 h-5" />
							</div>
						))}
				</div>
				<Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
			</div>
		</div>
	);
}
