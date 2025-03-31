import { Skeleton } from '@/components/ui/skeleton';

export default function DietLoading() {
	return (
		<div className="p-4 bg-white rounded-lg shadow">
			<Skeleton className="h-6 w-48 mb-4" />
			{[1, 2, 3].map((item) => (
				<div key={item} className="mb-4 space-y-3">
					<Skeleton className="h-5 w-32" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
			))}
		</div>
	);
}
