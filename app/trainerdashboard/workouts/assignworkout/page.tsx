import { getUsersAssignedToTrainer } from './GetuserassignedTotrainers';
import { getAllWorkoutPlans } from './Getworkout';
import UserWorkoutAssignment from './UserWorkoutAssignment';

export default async function Page() {
  const [users, workoutPlansResponse] = await Promise.all([
    getUsersAssignedToTrainer(),
    getAllWorkoutPlans(),
  ]);

  // Calculate status cards data
  const statusCards = [
    {
      title: 'Total Users',
      value: users.length,
      iconName: 'users',
      gradient: 'blue',
    },
    {
      title: 'Assigned Workouts',
      value: users.filter((u) => u.hasActiveWorkoutPlan).length,
      iconName: 'dumbbell',
      gradient: 'green',
    },
    {
      title: 'Pending Assignments',
      value: users.filter((u) => !u.hasActiveWorkoutPlan).length,
      iconName: 'target',
      gradient: 'red',
    },
  ];

  return (
    <div className="container mx-auto">
      <UserWorkoutAssignment
        Users={users}
        statusCards={statusCards}
        workoutPlans={workoutPlansResponse.workoutPlans}
      />
    </div>
  );
}
