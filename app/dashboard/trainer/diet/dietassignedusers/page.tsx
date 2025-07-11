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
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
			<main className="p-2 sm:p-6 pt-12">
				<AssignDietToUsers users={users} dietPlans={dietPlans} />
			</main>
		</div>
	);
}
