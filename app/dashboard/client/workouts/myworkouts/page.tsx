import { Suspense } from "react";
import { getTodaysWorkout } from "./_actions/get-todays-workout";
import { RestDay } from "./_component/rest-day";
import { TodaysWorkouts } from "./_component/todays-workouts";

export default async function MyWorkoutsPage() {
	try {
		const workouts = await getTodaysWorkout();

		return (
			<Suspense fallback={<div>Loading...</div>}>
				{workouts.length === 0 ? <RestDay /> : <TodaysWorkouts workouts={workouts} />}
			</Suspense>
		);
	} catch (error) {
		console.error("Error in MyWorkoutsPage:", error);
		return (
			<div className="w-full">
				<div className="relative mb-6 rounded-2xl overflow-hidden">
					<div className="bg-gradient-to-r from-red-500 to-orange-600 p-6">
						<div className="flex items-center gap-3 mb-2">
							<div className="bg-white/20 p-2 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-5 h-5 text-white"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-label="Warning icon"
								>
									<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
									<line x1="12" y1="9" x2="12" y2="13" />
									<line x1="12" y1="17" x2="12.01" y2="17" />
								</svg>
							</div>
							<h2 className="text-2xl font-bold text-white">Error Loading Workouts</h2>
						</div>
						<p className="text-red-100">
							{error instanceof Error ? error.message : "Failed to load today's workouts"}
						</p>
					</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-100 p-6">
					<div className="text-center">
						<p className="text-gray-600 mb-4">
							We encountered an error while trying to load your workouts. Please try again later.
						</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}
}
