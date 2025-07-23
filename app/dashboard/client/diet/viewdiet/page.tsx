export const dynamic = 'force-dynamic';

import { fetchTodaysDiet } from './_actions/get-todays-diet';
import TodaysDiet from './_components/todays-diet';

export default async function ViewDietPage() {
	const todaysDiet = await fetchTodaysDiet();
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
	});

	// Placeholder badges/info (to be replaced with real user/trainer/gym info)
	const userGoal = 'Muscle Gain'; // TODO: fetch from user profile
	const dietaryPref = 'Vegetarian'; // TODO: fetch from user profile
	const trainerName = todaysDiet.dietPlan?.trainer?.name || 'Your Trainer';
	const _gymName = 'FitLife Gym'; // TODO: fetch from user profile

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 px-0 sm:px-4 max-w-full sm:max-w-4xl mx-auto">
			{/* Header (screenshot-test area) */}
			<header className="pt-6 pb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between   bg-blue-50/40 rounded-lg mb-4">
				<div className="flex flex-col gap-4 w-full">
					<div className="flex flex-col gap-2 items-center sm:flex-row sm:items-center sm:gap-3 sm:justify-start">
						<div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center mb-2 sm:mb-0">
							<svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Meal plan icon"><title>Meal plan icon</title><path d="M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7" /><circle cx="12" cy="7" r="4" /></svg>
						</div>
						<h1 className="text-2xl font-bold text-slate-800 text-center sm:text-left">Today's Diet Plan</h1>
						<span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium uppercase tracking-wide text-center sm:text-left w-fit mx-auto sm:mx-0 mt-2 sm:mt-0">{today}</span>
					</div>
					<div className="flex flex-col gap-2 items-center sm:flex-row sm:gap-2 sm:justify-start mt-2 sm:mt-0">
						<div className="flex flex-row gap-2">
							<span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded">{userGoal}</span>
							<span className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded">{dietaryPref}</span>
						</div>
						<span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded mt-2 sm:mt-0">created by {trainerName}</span>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mt-2">
				<TodaysDiet todaysDiet={todaysDiet} />
			</main>

			{/* Footer */}
			<footer className="mt-8 mb-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
				<span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
				<span>Updated daily based on your fitness goals</span>
				<span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
				{/* TODO: Add quick actions (refresh, contact trainer) here */}
			</footer>
		</div>
	);
}
