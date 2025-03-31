import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Utensils } from 'lucide-react';

export default function DietSkeleton() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Header with skeleton buttons */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<Skeleton className="h-8 w-48 mb-2 bg-slate-300/80 dark:bg-slate-700/80" />
					<Skeleton className="h-4 w-64 bg-slate-300/80 dark:bg-slate-700/80" />
				</div>

				<div className="flex gap-2">
					<Skeleton className="h-10 w-24 bg-slate-300/80 dark:bg-slate-700/80" />
					<Skeleton className="h-10 w-32 bg-green-300/60 dark:bg-green-700/60" />
				</div>
			</div>

			{/* Diet summary */}
			<Card className="bg-white/70 dark:bg-gray-950/70 border border-green-100/50 dark:border-green-800/30">
				<CardHeader className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-950/50 dark:via-emerald-950/30 dark:to-green-950/50 border-b border-green-100/50 dark:border-green-800/30">
					<CardTitle className="text-xl">Diet Plan Summary</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						{[1, 2, 3].map((index) => (
							<div
								key={index}
								className="p-3 bg-green-50/50 dark:bg-green-900/20 rounded-md border border-green-100/50 dark:border-green-800/30 text-center"
							>
								<div className="text-sm text-muted-foreground mb-1">
									<Skeleton className="h-4 w-20 mx-auto bg-slate-300/80 dark:bg-slate-700/80" />
								</div>
								<div className="text-xl font-semibold">
									<Skeleton className="h-6 w-16 mx-auto bg-slate-300/80 dark:bg-slate-700/80" />
								</div>
							</div>
						))}
					</div>

					<div className="space-y-6">
						<h3 className="font-medium text-lg flex items-center gap-2 text-green-800 dark:text-green-300">
							<Utensils className="h-5 w-5" />
							<span>Daily Meal Plan</span>
						</h3>

						<div className="space-y-4">
							{[1, 2, 3, 4].map((index) => (
								<Card
									key={index}
									className="overflow-hidden border border-green-100/50 dark:border-green-800/30"
								>
									<CardHeader className="py-3 px-4 bg-green-50/70 dark:bg-green-900/30">
										<div className="flex justify-between items-center">
											<Skeleton className="h-5 w-24 bg-slate-300/80 dark:bg-slate-700/80" />
											<Skeleton className="h-4 w-16 bg-slate-300/80 dark:bg-slate-700/80" />
										</div>
									</CardHeader>
									<CardContent className="p-4">
										<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
											{[1, 2, 3, 4].map((i) => (
												<div key={i} className="text-sm">
													<Skeleton className="h-4 w-20 mb-1 bg-slate-300/80 dark:bg-slate-700/80" />
													<Skeleton className="h-4 w-12 bg-slate-300/80 dark:bg-slate-700/80" />
												</div>
											))}
										</div>

										<div className="mt-2">
											<Skeleton className="h-4 w-24 mb-1 bg-slate-300/80 dark:bg-slate-700/80" />
											<Skeleton className="h-4 w-full mb-1 bg-slate-300/80 dark:bg-slate-700/80" />
											<Skeleton className="h-4 w-4/5 bg-slate-300/80 dark:bg-slate-700/80" />
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bottom action buttons */}
			<div className="flex justify-end gap-2 pt-2">
				<Skeleton className="h-10 w-24 bg-slate-300/80 dark:bg-slate-700/80" />
				<Skeleton className="h-10 w-32 bg-green-300/60 dark:bg-green-700/60" />
			</div>
		</div>
	);
}
