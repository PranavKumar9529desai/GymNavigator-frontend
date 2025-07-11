import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
			<main className="p-2 sm:p-6 pt-12">
				{/* Header Loading */}
				<div className="space-y-4 mb-10">
					<div className="flex items-center gap-3">
						<Skeleton className="w-6 h-6 rounded-full" />
						<Skeleton className="h-6 w-48" />
					</div>
					<Skeleton className="h-4 w-96" />
				</div>

				{/* Users Section Loading */}
				<div className="space-y-6 mb-10">
					<div className="border-b border-slate-100">
						<div className="w-full flex items-center justify-between py-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-6 w-8" />
							</div>
							<Skeleton className="h-4 w-4" />
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
						{[...Array(6)].map((_, i) => (
							<div key={`user-${i}`} className="p-2 border border-slate-100 rounded hover:bg-blue-50/30 transition-colors">
								<div className="flex items-center gap-3">
									<Skeleton className="w-10 h-10 rounded-full" />
									<div className="space-y-2 flex-1">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-3 w-32" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Diet Plans Section Loading */}
				<div className="space-y-6">
					<div className="border-b border-slate-100">
						<div className="w-full flex items-center justify-between py-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-6 w-8" />
							</div>
							<Skeleton className="h-4 w-4" />
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
						{[...Array(4)].map((_, i) => (
							<div key={`diet-${i}`} className="p-3 border border-blue-100 rounded hover:bg-blue-50/30 transition-colors">
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-5 w-16" />
									</div>
									<div className="space-y-2">
										<Skeleton className="h-3 w-full" />
										<Skeleton className="h-3 w-3/4" />
									</div>
									<div className="flex gap-2">
										<Skeleton className="h-6 w-16" />
										<Skeleton className="h-6 w-20" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
