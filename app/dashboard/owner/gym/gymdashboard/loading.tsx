import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="space-y-4 p-4 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 min-h-screen">
			{/* Dashboard Header Skeleton */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Skeleton className="h-9 w-32" />
			</div>

			{/* Key Metrics Skeleton - 4 cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
				{['revenue', 'members', 'attendance', 'trainers'].map((metric) => (
					<div key={metric} className="border border-blue-200 bg-white/80 rounded-lg p-4 shadow-sm">
						<div className="flex items-center justify-between mb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-8 rounded-full" />
						</div>
						<Skeleton className="h-8 w-20 mb-2" />
						<div className="flex items-center gap-1">
							<Skeleton className="h-3 w-3" />
							<Skeleton className="h-3 w-32" />
						</div>
					</div>
				))}
			</div>

			{/* Operational Metrics Skeleton - 2 cards side by side */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Onboarding Pipeline Card */}
				<div className="border border-blue-200 bg-white/80 rounded-lg p-4 shadow-sm">
					<Skeleton className="h-6 w-40 mb-4" />
					<div className="space-y-3">
						{['onboarding', 'health-profile', 'ready', 'fully-onboarded'].map((stage) => (
							<div key={stage} className="space-y-2">
								<div className="flex justify-between items-center">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-5 w-8 rounded-full" />
								</div>
								<Skeleton className="h-2 w-full rounded-full" />
							</div>
						))}
					</div>
				</div>

				{/* Trainer Workload Card */}
				<div className="border border-blue-200 bg-white/80 rounded-lg p-4 shadow-sm">
					<Skeleton className="h-6 w-32 mb-4" />
					<div className="space-y-2">
						{['trainer-1', 'trainer-2', 'trainer-3'].map((trainer) => (
							<div key={trainer} className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-blue-100">
								<div className="space-y-1">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-16" />
								</div>
								<div className="text-right space-y-1">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-3 w-12" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Charts Skeleton - 2 charts side by side */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="border border-blue-200 bg-white/80 rounded-lg p-4 shadow-sm">
					<Skeleton className="h-6 w-32 mb-4" />
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>
				<div className="border border-blue-200 bg-white/80 rounded-lg p-4 shadow-sm">
					<Skeleton className="h-6 w-40 mb-4" />
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>
			</div>

			{/* Recent Activities Skeleton */}
			<div className="border border-blue-200 bg-white/80 rounded-lg p-4 shadow-sm">
				<Skeleton className="h-6 w-36 mb-4" />
				<div className="space-y-3">
					{['activity-1', 'activity-2', 'activity-3', 'activity-4', 'activity-5'].map((activity) => (
						<div key={activity} className="flex items-center gap-3 p-2">
							<Skeleton className="h-8 w-8 rounded-full" />
							<div className="flex-1 space-y-1">
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-3 w-32" />
							</div>
							<Skeleton className="h-4 w-16" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
