import { Skeleton } from '@/components/ui/skeleton';

export default function QrScanLoading() {
	return (
		<div className="flex justify-center min-h-[80vh] p-4">
			<div className="w-full max-w-md space-y-4">
				{/* Role info skeleton */}
				<div className="flex items-center justify-center gap-2 p-3 mb-4 bg-blue-50 rounded-lg border border-blue-200">
					<Skeleton className="h-5 w-5 rounded" />
					<Skeleton className="h-4 w-32" />
				</div>
				
				{/* QR scanner skeleton */}
				<div className="space-y-4">
					<Skeleton className="h-64 w-full rounded-lg" />
					<Skeleton className="h-4 w-3/4 mx-auto" />
					<Skeleton className="h-4 w-1/2 mx-auto" />
				</div>
			</div>
		</div>
	);
} 