import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="container mx-auto p-6 space-y-8">
			{/* Page title skeleton */}
			<Skeleton className="h-8 w-64 mx-auto" />

			{/* Status cards skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>

			{/* Filter and search skeleton */}
			<div className="flex flex-col md:flex-row gap-4 items-start">
				<Skeleton className="h-10 w-full max-w-sm" />
				<Skeleton className="h-10 w-[180px]" />
				<Skeleton className="h-5 w-32 ml-auto" />
			</div>

			{/* Users-Trainers assignment table skeleton */}
			<div className="hidden md:block">
				<Skeleton className="h-[400px] w-full" />
			</div>

			{/* Mobile cards skeleton */}
			<div className="md:hidden space-y-4">
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
			</div>
		</div>
	);
}
