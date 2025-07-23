import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { getUsersAssignedToTrainer } from './_actiions/GetuserassignedTotrainers';
import AssignedUserToTrainer from './_components/AssignedUserToTrainer';

export default async function AssignedUsersPage() {
	const assignedUsers = await getUsersAssignedToTrainer();

	return (
		<div className="min-h-screen bg-gray-50">
			<AssignedUserToTrainer assignedUsers={assignedUsers} />
		</div>
	);
}
