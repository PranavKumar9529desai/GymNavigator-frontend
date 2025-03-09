import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Allworkouts } from "./_components/allworkouts";
import fetchMuscles from "./actions/getAllMuscles";

export const metadata: Metadata = {
	title: "All Workouts | Gym Navigator",
	description:
		"Explore our comprehensive collection of workouts organized by muscle groups. Find exercises tailored to your fitness goals.",
};

export default async function AllWorkoutsPage() {
	// Fetch data server-side
	const { muscles } = await fetchMuscles();
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["muscles"],
		queryFn: fetchMuscles,
	});

	return (
		<main className="min-h-screen">
			<div className="max-w-7xl mx-auto py-8">
				<header className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900">All Workouts</h1>
					<p className="mt-2 text-gray-600">
						Discover exercises tailored to your fitness journey
					</p>
				</header>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Allworkouts initialMuscles={muscles} />
				</HydrationBoundary>
			</div>
		</main>
	);
}
