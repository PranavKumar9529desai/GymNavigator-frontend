import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { getAssignableUsers } from './_actions/get-assignable-users';
import { getWorkoutPlans } from './_actions/get-workout-plans';
import UserWorkoutAssignment from './_components/UserWorkoutAssignment';

function Spinner() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default async function AssignWorkoutPage() {
	// Fetch data server-side
	const [users, workoutPlans] = await Promise.all([
		getAssignableUsers(),
		getWorkoutPlans(),
	]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Suspense fallback={<Spinner />}>
				<UserWorkoutAssignment
					initialUsers={users}
					initialWorkoutPlans={workoutPlans}
				/>
			</Suspense>
		</div>
	);
}
