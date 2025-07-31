import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="container mx-auto p-6 space-y-8">
			{/* Page title skeleton */}
			<Skeleton className="h-8 w-48 mx-auto" />

			{/* Status cards skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>

			{/* Filter controls skeleton */}
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<Skeleton className="h-10 w-full max-w-sm" />
				<Skeleton className="h-10 w-[180px]" />
			</div>

			{/* Trainers table skeleton */}
			<div className="hidden md:block">
				<Skeleton className="h-[400px] w-full" />
			</div>

			{/* Mobile cards skeleton */}
			<div className="md:hidden space-y-4">
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
			</div>
		</div>
	);
}
