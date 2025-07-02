export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { fetchMuscles } from './_actions/get-muscles';
import { Allworkouts } from './_components/allworkouts';

export const metadata: Metadata = {
	title: 'All Workouts | Gym Navigator',
	description:
		'Explore our comprehensive collection of workouts organized by muscle groups. Find exercises tailored to your fitness goals.',
};

export default async function AllWorkoutsPage() {
	const { muscles } = await fetchMuscles();

	return (
		<main className="min-h-screen">
			<div className="max-w-7xl mx-auto py-8">
				<header className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900">All Workouts</h1>
					<p className="mt-2 text-gray-600">
						Discover exercises tailored to your fitness journey
					</p>
				</header>
				<Allworkouts muscles={muscles} />
			</div>
		</main>
	);
}
