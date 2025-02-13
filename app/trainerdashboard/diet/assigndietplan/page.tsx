import { getUsersAssignedToTrainer } from './GetassignedUserDietInfo';
import { getAllDietPlans } from './GetallDiets';
import AssignDietToUsers from './AssignDietToUsers';
import { Suspense } from 'react';

export default async function Page() {
  const [users, dietPlans] = await Promise.all([
    getUsersAssignedToTrainer(),
    getAllDietPlans(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <AssignDietToUsers users={users} dietPlans={dietPlans} />
      </Suspense>
    </div>
  );
}
