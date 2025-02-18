import { Suspense } from 'react';
import AssignDietToUsers from './AssignDietToUsers';
import { getAllDietPlans } from './GetallDiets';
import { getUsersAssignedToTrainer } from './GetassignedUserDietInfo';

export default async function Page() {
  const [users, dietPlans] = await Promise.all([getUsersAssignedToTrainer(), getAllDietPlans()]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <AssignDietToUsers users={users} dietPlans={dietPlans} />
      </Suspense>
    </div>
  );
}
