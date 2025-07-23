import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingShowQR() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="text-center space-y-4 w-full max-w-xs">
				<Skeleton className="h-8 w-2/3 mx-auto mb-2" />
				<Skeleton className="h-4 w-1/2 mx-auto mb-4" />
				<Skeleton className="h-56 w-56 mx-auto rounded-lg" />
				<Skeleton className="h-4 w-3/4 mx-auto mt-4" />
			</div>
		</div>
	);
}
