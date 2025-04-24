import Link from 'next/link';
import { Suspense } from 'react';
import { getAllDietPlans } from './_actions /GetallDiets';
import { getUsersAssignedToTrainer } from './_actions /GetassignedUserDietInfo';
import AssignDietToUsers from './_components/AssignDietToUsers';

export default async function Page() {
	const [users, dietPlans] = await Promise.all([
		getUsersAssignedToTrainer(),
		getAllDietPlans(),
	]);
	console.log('users', users);
	console.log('dietPlans', dietPlans);
	return (
		<div className="min-h-screen bg-gray-50">
			<main className="p-6">
				<div className="mb-6 flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Assign Diet Plans</h1>
				</div>
				<Suspense fallback={<div>Loading...</div>}>
					<AssignDietToUsers users={users} dietPlans={dietPlans} />
				</Suspense>
			</main>
		</div>
	);
}
