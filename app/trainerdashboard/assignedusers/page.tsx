import { getUsersAssignedToTrainer } from './GetuserassignedTotrainers';
import AssignedUserToTrainer from './AssignedUserToTrainer';
import { Suspense } from 'react';

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
