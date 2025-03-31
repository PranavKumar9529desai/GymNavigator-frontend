import { Suspense } from 'react';
import AssignedUserToTrainer from './AssignedUserToTrainer';
import { getUsersAssignedToTrainer } from './GetuserassignedTotrainers';

export default async function AssignedUsersPage() {
	const users = await getUsersAssignedToTrainer();

	return (
		<div className="min-h-screen bg-gray-50">
			<Suspense fallback={<div>Loading...</div>}>
				<AssignedUserToTrainer users={users} />
			</Suspense>
		</div>
	);
}
