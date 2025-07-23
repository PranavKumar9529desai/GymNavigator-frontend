import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="mx-auto">
			<div className="p-4 md:p-6 bg-gradient-to-b from-blue-50/50 to-white rounded-lg">
				<Skeleton className="h-10 w-1/2 mb-6" />
				<div className="flex flex-col md:flex-row gap-6">
					<div className="w-full md:w-1/3">
						<Skeleton className="h-48" />
					</div>
					<div className="w-full md:w-2/3">
						<Skeleton className="h-48" />
					</div>
				</div>
			</div>
		</div>
	);
}
