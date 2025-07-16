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
	const trainerName = 'Trainer John'; // TODO: fetch from user profile
	const gymName = 'FitLife Gym'; // TODO: fetch from user profile

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 px-0 sm:px-4 max-w-full sm:max-w-4xl mx-auto">
			{/* Header */}
			<header className="pt-6 pb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
						<svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Meal plan icon"><title>Meal plan icon</title><path d="M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7" /><circle cx="12" cy="7" r="4" /></svg>
					</div>
					<h1 className="text-2xl font-bold text-slate-800">Today's Diet Plan</h1>
					<span className="ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium uppercase tracking-wide">{today}</span>
				</div>
				<div className="flex gap-2 mt-2 sm:mt-0">
					<span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded">{userGoal}</span>
					<span className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded">{dietaryPref}</span>
					<span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded hidden sm:inline">{trainerName} @ {gymName}</span>
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
