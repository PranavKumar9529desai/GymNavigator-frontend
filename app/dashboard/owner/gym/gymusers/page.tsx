import GymUsersClient from "./_components/GymUsersClient";

export default async function Page() {
	// Data fetching will be handled in the client component for SSR/CSR flexibility
	return (
		<>
			<h1 className="text-3xl font-bold text-center pt-4">
				Gym Users & Trainers
			</h1>
			<GymUsersClient />
		</>
	);
}
