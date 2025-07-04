import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="min-h-screen p-2 md:p-6">
			<div className="mx-auto max-w-6xl">
				{/* Edit button skeleton */}
				<div className="flex justify-end mb-4">
					<Skeleton className="h-10 w-32" />
				</div>

				{/* Gym header skeleton */}
				<div className="mb-6">
					<div className="flex items-center space-x-4 mb-4">
						<Skeleton className="h-16 w-16 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-64" />
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
					</div>
				</div>

				{/* Tabs skeleton */}
				<div className="space-y-4">
					{/* Tab list skeleton */}
					<div className="flex justify-around bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
						<Skeleton className="h-10 w-20" />
						<Skeleton className="h-10 w-20" />
						<Skeleton className="h-10 w-20" />
						<Skeleton className="h-10 w-20" />
					</div>

					{/* Tab content skeleton */}
					<div className="mt-20 space-y-4">
						<Skeleton className="h-8 w-48" />
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
