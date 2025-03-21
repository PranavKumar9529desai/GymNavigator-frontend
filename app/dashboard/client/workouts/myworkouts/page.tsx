import { Suspense } from 'react';
import { getTodaysDiet } from './_actions/get-todays-diet';
import { getTodaysWorkout } from './_actions/get-todays-workout';
import { DietNotAssigned } from './_component/diet-not-assigned';
import { ErrorDisplay } from './_component/error-display';
import { RestDay } from './_component/rest-day';
import { TodaysDiet } from './_component/todays-diet';
import { TodaysWorkouts } from './_component/todays-workouts';
import { WorkoutNotAssigned } from './_component/workout-not-assigned';

export default async function MyWorkoutsPage() {
  try {
    // Fetch both workout and diet data concurrently
    const [workout, dietPlan] = await Promise.all([getTodaysWorkout(), getTodaysDiet()]);

    return (
      <div className="space-y-10">
        <Suspense fallback={<div>Loading workout data...</div>}>
          <section>
            {!workout ? (
              <WorkoutNotAssigned />
            ) : workout.muscleGroups.length === 0 ? (
              <RestDay />
            ) : (
              <TodaysWorkouts workout={workout} />
            )}
          </section>
        </Suspense>

        <Suspense fallback={<div>Loading diet data...</div>}>
          <section>{!dietPlan ? <DietNotAssigned /> : <TodaysDiet dietPlan={dietPlan} />}</section>
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error in MyWorkoutsPage:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load your data';
    return <ErrorDisplay errorMessage={errorMessage} />;
  }
}
