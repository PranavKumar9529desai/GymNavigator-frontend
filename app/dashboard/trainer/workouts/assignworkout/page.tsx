import { getUsersAssignedToTrainer } from './_actions/GetuserassignedTotrainers';
import { getWorkoutPlans } from './_actions/Getworkout';
import UserWorkoutAssignment from './UserWorkoutAssignment';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function AssignWorkoutPage() {
	const [users, workoutPlans] = await Promise.all([
		getUsersAssignedToTrainer(),
		getWorkoutPlans(),
	]);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* <Suspense fallback={<Loading />}>
				<UserWorkoutAssignment Users={users} workoutPlans={workoutPlans} />
			</Suspense> */}
		</div>
	);
}
