'use client';

import {
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Flame,
  Target,
  Timer,
} from 'lucide-react';
import { useState } from 'react';
import type { TodaysWorkout } from '../_actions/get-todays-workout';
import { RestDay } from './rest-day';

interface TodaysWorkoutsProps {
  workout: TodaysWorkout;
}

export const TodaysWorkouts = ({ workout }: TodaysWorkoutsProps) => {
  const [expandedMuscle, setExpandedMuscle] = useState<string | null>(
    workout.muscleGroups.length > 0 ? workout.muscleGroups[0].muscle : null,
  );

  const toggleExpand = (muscle: string) => {
    setExpandedMuscle(expandedMuscle === muscle ? null : muscle);
  };

  // Calculate total exercises across all muscle groups
  const totalExercises = workout.muscleGroups.reduce(
    (total, group) => total + group.exercises.length,
    0,
  );

  // If no workouts, show rest day component
  if (workout.muscleGroups.length === 0) {
    return <RestDay />;
  }

  return (
    <div className="w-full">
      {/* Header Section with Gradient Background */}
      <div className="relative mb-6 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">{workout.day}'s Workout</h2>
          </div>
          <p className="text-blue-100">Track your muscle groups and exercises</p>

          {/* Stats Summary */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>{workout.muscleGroups.length} Muscle Groups</span>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>
                {totalExercises} {totalExercises === 1 ? 'Exercise' : 'Exercises'}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            className="w-full h-6"
            aria-hidden="true"
            role="img"
          >
            <title>Decorative wave pattern</title>
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-6">
        {workout.muscleGroups.map((muscleGroup) => (
          <div
            key={muscleGroup.muscle}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            {/* Muscle Group Header - Always visible */}
            <button
              type="button"
              className={`w-full text-left p-5 border-b border-gray-100 transition-colors ${
                expandedMuscle === muscleGroup.muscle ? 'bg-blue-50' : ''
              }`}
              onClick={() => toggleExpand(muscleGroup.muscle)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleExpand(muscleGroup.muscle);
                }
              }}
              aria-expanded={expandedMuscle === muscleGroup.muscle}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{muscleGroup.muscle}</h3>
                  <p className="text-gray-600 text-base">
                    {muscleGroup.exercises.length}{' '}
                    {muscleGroup.exercises.length === 1 ? 'Exercise' : 'Exercises'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-2">
                  {expandedMuscle === muscleGroup.muscle ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            </button>

            {/* Exercises List - Expandable */}
            {expandedMuscle === muscleGroup.muscle && (
              <div className="p-5">
                <div className="space-y-5">
                  {muscleGroup.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className={`overflow-hidden rounded-lg transition-all ${
                        index % 2 === 0 ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      {/* Exercise number badge */}
                      <div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium">
                        Exercise {index + 1} of {muscleGroup.exercises.length}
                      </div>

                      <div className="p-4">
                        {/* Mobile-optimized layout */}
                        <div className="flex flex-col gap-4">
                          {exercise.exercise.image_url ? (
                            <img
                              src={exercise.exercise.image_url}
                              alt={exercise.exercise.name}
                              className="w-full h-48 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-48 bg-gray-200 rounded-lg">
                              <Dumbbell className="w-10 h-10 text-gray-400" />
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex flex-col justify-between gap-2 mb-3">
                              <h5 className="font-medium text-gray-900 text-lg">
                                {exercise.exercise.name}
                              </h5>
                            </div>

                            {/* Exercise details */}
                            <div className="grid grid-cols-2 gap-3 text-base text-gray-600 mb-3">
                              <div className="flex items-center gap-2 bg-white/50 p-3 rounded">
                                <Dumbbell className="w-5 h-5 text-blue-600" />
                                <span>
                                  {exercise.sets} × {exercise.reps}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/50 p-3 rounded">
                                <Timer className="w-5 h-5 text-blue-600" />
                                <span>{exercise.rest}s rest</span>
                              </div>
                            </div>

                            {exercise.notes && (
                              <p className="text-base text-gray-600 mt-3 italic bg-white/70 p-3 rounded">
                                "{exercise.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
