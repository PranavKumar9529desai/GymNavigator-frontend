import { notFound } from 'next/navigation';
import {
	type AssignedUser,
	getUsersAssignedToTrainer,
} from '../_actions/GetuserassignedTotrainers';
import { type WorkoutPlan, getAllWorkoutPlans } from '../Getworkout';
import UserWorkoutAssignmentDetails from './_components/UserWorkoutAssignmentDetails';

export default async function AssignWorkoutToUserPage({
	params,
}: {
	params: Promise<{ userid: string }>;
}) {
	const { userid } = await params;

	// Fetch user details and available workout plans
	const [users, workoutPlansResult] = await Promise.all([
		getUsersAssignedToTrainer(),
		getAllWorkoutPlans(),
	]);

	const user = users.find((u) => u.id === userid);

	if (!user) {
		notFound();
	}

	const workoutPlans = workoutPlansResult.workoutPlans || [];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Assign Workout Plan</h1>
			<UserWorkoutAssignmentDetails user={user} workoutPlans={workoutPlans} />
		</div>
	);
}
