import { getUsersAssignedToTrainer } from './_actions/GetuserassignedTotrainers';
import UserWorkoutList from './_components/user-workout-list';

export default async function AssignWorkoutPage() {
	const users = await getUsersAssignedToTrainer();

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Assign Workout Plans</h1>
			<UserWorkoutList users={users} />
		</div>
	);
}
