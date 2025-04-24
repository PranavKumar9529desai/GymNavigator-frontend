import { Skeleton } from '@/components/ui/skeleton';

export default function ViewDietLoading() {
	return (
		<div className="py-4">
			<h1 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-600 to-green-500 text-transparent bg-clip-text">
				Today's Diet Plan
			</h1>

			<div className="space-y-6">
				{/* Diet summary skeleton */}
				<div className="border-b border-gray-100 pb-4">
					<div className="h-52 bg-gray-50 animate-pulse rounded-lg" />
					<div className="mt-3 grid grid-cols-4 gap-2">
						{[...Array(4)].map((_, i) => (
							<div
								key={`nutrition-skeleton-${i as number}`}
								className="flex flex-col items-center"
							>
								<div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
								<div className="mt-1 h-3 w-8 bg-gray-100 animate-pulse rounded" />
							</div>
						))}
					</div>
				</div>

				{/* Meals skeletons */}
				<div>
					<div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-3" />
					<div className="space-y-4">
						{[...Array(4)].map((_, i) => (
							<div
								key={`meal-skeleton-${i as number}`}
								className="border-b border-gray-100 pb-3"
							>
								<div className="border-l-2 border-gray-200 pl-3 mb-2">
									<div className="flex items-center justify-between">
										<div>
											<div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
											<div className="mt-1 h-3 w-20 bg-gray-100 animate-pulse rounded" />
										</div>
										<div className="h-6 w-6 bg-gray-100 animate-pulse rounded-full" />
									</div>
								</div>
								<div className="py-2 grid grid-cols-4 gap-2">
									{[...Array(4)].map((_, j) => (
										<div
											key={`meal-nutrition-skeleton-${i as number}-${j as number}`}
											className="flex flex-col items-center"
										>
											<div className="h-3 w-8 bg-gray-200 animate-pulse rounded" />
											<div className="mt-1 h-2 w-6 bg-gray-100 animate-pulse rounded" />
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mt-6 text-center text-xs text-gray-500">
				<span>Updated daily based on your fitness goals</span>
			</div>
		</div>
	);
}
