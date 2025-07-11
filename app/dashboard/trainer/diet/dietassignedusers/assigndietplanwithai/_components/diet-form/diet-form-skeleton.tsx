import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DietFormSkeleton() {
	return (
		<div className="max-w-2xl mx-auto">
			<Card className="bg-white/70 dark:bg-gray-950/70 border border-green-100/50 dark:border-green-800/30">
				<CardContent className="p-6">
					<div className="space-y-6">
						{/* Client Name field */}
						<div>
							<Skeleton className="h-4 w-24 mb-2 bg-slate-300/80 dark:bg-slate-700/80" />
							<Skeleton className="h-10 w-full bg-slate-300/80 dark:bg-slate-700/80" />
						</div>

						{/* Diet Preference */}
						<div>
							<Skeleton className="h-4 w-32 mb-2 bg-slate-300/80 dark:bg-slate-700/80" />
							<Skeleton className="h-10 w-full bg-slate-300/80 dark:bg-slate-700/80" />
						</div>

						{/* Medical Conditions */}
						<div>
							<Skeleton className="h-4 w-40 mb-2 bg-slate-300/80 dark:bg-slate-700/80" />
							<div className="space-y-2">
								{[1, 2, 3, 4, 5].map((index) => (
									<div key={index} className="flex items-center">
										<Skeleton className="h-4 w-4 mr-2 bg-slate-300/80 dark:bg-slate-700/80" />
										<Skeleton className="h-4 w-24 bg-slate-300/80 dark:bg-slate-700/80" />
									</div>
								))}
							</div>
						</div>

						{/* Location */}
						<div>
							<Skeleton className="h-4 w-20 mb-2 bg-slate-300/80 dark:bg-slate-700/80" />
							<Skeleton className="h-10 w-full bg-slate-300/80 dark:bg-slate-700/80" />
						</div>

						{/* Country */}
						<div>
							<Skeleton className="h-4 w-16 mb-2 bg-slate-300/80 dark:bg-slate-700/80" />
							<Skeleton className="h-10 w-full bg-slate-300/80 dark:bg-slate-700/80" />
						</div>

						{/* Additional fields */}
						<div>
							<Skeleton className="h-4 w-36 mb-2 bg-slate-300/80 dark:bg-slate-700/80" />
							<Skeleton className="h-10 w-full bg-slate-300/80 dark:bg-slate-700/80" />
						</div>

						{/* Generate button */}
						<div className="pt-2">
							<Skeleton className="h-10 w-full sm:w-40 mx-auto bg-green-300/60 dark:bg-green-700/60" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
