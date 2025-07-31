import { Skeleton } from '@/components/ui/skeleton';

export default function loading() {
	return (
		<div className="p-4">
			{/* Page title skeleton */}
			<Skeleton className="h-8 w-64 mx-auto mb-6" />

			{/* Status cards skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>

			{/* Search and filter controls skeleton */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>

			{/* Table skeleton */}
			<div className="hidden md:block">
				<Skeleton className="h-[400px] w-full" />
			</div>

			{/* Mobile cards skeleton */}
			<div className="md:hidden space-y-4">
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>
		</div>
	);
}
