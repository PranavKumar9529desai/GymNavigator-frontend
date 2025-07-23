import DietManagement from './_components/view-all-diet';
import { getAllViewDietPlans } from './_action/get-all-view-diets';

export default async function Page() {
	// Fetch diet plans data using server action
	const dietPlans = await getAllViewDietPlans();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
			<DietManagement dietPlans={dietPlans} />
		</div>
	);
}
