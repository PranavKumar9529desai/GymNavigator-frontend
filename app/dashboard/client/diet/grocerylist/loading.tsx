import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
	return (
		<div className="container py-8 space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Grocery List</h2>
				<Skeleton className="h-10 w-[120px] rounded-md" />
			</div>

			<div className="flex flex-col items-center justify-center py-20">
				<Spinner size="lg" className="text-primary" />
				<p className="mt-4 text-muted-foreground">
					Loading your grocery list...
				</p>
			</div>
		</div>
	);
}
