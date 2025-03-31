import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
			{/* Header Section Skeleton */}
			<header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white mt-4 mx-4 rounded-2xl shadow-lg">
				<div className="max-w-7xl mx-auto px-8 py-16 lg:py-20 relative overflow-hidden">
					<div className="relative flex flex-col items-center">
						<Skeleton className="w-32 h-8 mb-6 rounded-full  bg-transparent" />
						<div className="space-y-4 text-center">
							<Skeleton
								className="w-64 h-16 mx-auto rounded-lg bg-transparent"
								aria-label="Exercise title loading"
							/>
							<Skeleton
								className="w-96 h-12 mx-auto rounded-lg bg-transparent"
								aria-label="Exercise description loading"
							/>
						</div>
					</div>
				</div>
			</header>

			{/* Content Section Skeleton */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Search and Filter Bar Skeleton */}
				<div className="z-40 bg-white shadow-sm rounded-2xl border border-gray-100 mb-8">
					<div className="p-4">
						<div className="flex items-center gap-4">
							<Skeleton
								className="flex-1 h-12 rounded-xl"
								aria-label="Search bar loading"
							/>
							<fieldset
								className="hidden md:flex gap-2"
								aria-label="Filter options loading"
							>
								<Skeleton className="w-28 h-12 rounded-xl" />
								<Skeleton className="w-28 h-12 rounded-xl" />
								<Skeleton className="w-28 h-12 rounded-xl" />
							</fieldset>
						</div>
					</div>
				</div>

				{/* Exercise Grid Skeleton */}
				<ul
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0"
					aria-label="Loading exercise cards"
				>
					{[...Array(6)].map((_, i) => (
						<li
							key={i as number}
							className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
							aria-label="Exercise card loading"
						>
							<Skeleton
								className="w-full aspect-[4/3]"
								aria-label="Exercise image loading"
							/>
							<div className="p-6 space-y-4">
								<Skeleton
									className="w-3/4 h-6 rounded-lg"
									aria-label="Exercise name loading"
								/>
								<Skeleton
									className="w-full h-12 rounded-xl"
									aria-label="View exercise button loading"
								/>
							</div>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
