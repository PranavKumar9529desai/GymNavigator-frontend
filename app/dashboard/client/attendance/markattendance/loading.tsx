import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarkAttendanceLoading() {
	return (
		<main className="min-h-[calc(100vh-4rem)] bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-center mb-8">
					<Skeleton className="h-9 w-48 mx-auto" />
				</h1>
				<section className="max-w-md mx-auto">
					<Card className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
						<CardHeader className="bg-primary/20 space-y-1 p-6">
							<div className="flex items-center justify-center gap-2">
								<Skeleton className="h-6 w-6 rounded-full" />
								<Skeleton className="h-7 w-32" />
							</div>
							<Skeleton className="h-4 w-48 mx-auto mt-2" />
						</CardHeader>

						<CardContent className="p-6">
							<div className="aspect-square w-full max-w-xs mx-auto">
								<Skeleton className="h-full w-full rounded-lg" />
							</div>
						</CardContent>

						<CardFooter className="bg-muted/10 p-4">
							<Skeleton className="h-4 w-36 mx-auto" />
						</CardFooter>
					</Card>
				</section>
			</div>
		</main>
	);
}
