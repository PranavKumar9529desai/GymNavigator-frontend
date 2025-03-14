import { TodaysWorkouts } from './_component/todays-workouts';
import { WorkoutNotAssigned } from './_component/workout-not-assigned';

export default function ViewWorkoutPage() {
  // This would typically come from a data fetch to check if workouts exist
  const hasWorkouts = false;

  return (
    <div className="">
      <div className="">{hasWorkouts ? <TodaysWorkouts /> : <WorkoutNotAssigned />}</div>
    </div>
  );
}
