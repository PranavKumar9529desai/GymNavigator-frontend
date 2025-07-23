import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
			<div className="max-w-7xl mx-auto p-3 sm:p-6">
				<Skeleton className="h-32 mb-4" />
				<Skeleton className="h-64" />
			</div>
		</div>
	);
}
