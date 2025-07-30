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
				<div className="mb-8">
					<div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-8">
						{/* Left side - Logo skeleton */}
						<div className="flex justify-center lg:justify-start">
							<Skeleton className="h-28 w-28 rounded-full md:h-36 md:w-36" />
						</div>

						{/* Right side - Gym details skeleton */}
						<div className="flex-1 text-center lg:text-left">
							{/* Gym name skeleton */}
							<div className="mb-2">
								<Skeleton className="h-8 w-48 mx-auto lg:mx-0 md:h-12" />
							</div>

							{/* Address skeleton */}
							<div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-32" />
							</div>

							{/* Contact grid skeleton */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
								<div className="flex items-center gap-3">
									<Skeleton className="h-6 w-6" />
									<div className="space-y-1">
										<Skeleton className="h-3 w-20" />
										<Skeleton className="h-4 w-32" />
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Skeleton className="h-6 w-6" />
									<div className="space-y-1">
										<Skeleton className="h-3 w-24" />
										<Skeleton className="h-4 w-28" />
									</div>
								</div>
								<div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
									<Skeleton className="h-6 w-6" />
									<div className="space-y-1">
										<Skeleton className="h-3 w-20" />
										<Skeleton className="h-4 w-36" />
									</div>
								</div>
							</div>
						</div>
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
					<div className="mt-6 space-y-4">
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
