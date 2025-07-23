import { Suspense } from 'react';
import GymUsersClient from './_components/GymUsersClient';
import { unstable_ViewTransition as ViewTransition } from 'react';

export default async function Page() {
	// Data fetching will be handled in the client component for SSR/CSR flexibility
	return (
		<>
			<h1 className="text-3xl font-bold text-center pt-4">
				Gym Users & Trainers
			</h1>
			<ViewTransition>
				<GymUsersClient />
			</ViewTransition>
			{/* <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      </Suspense> */}
		</>
	);
}
