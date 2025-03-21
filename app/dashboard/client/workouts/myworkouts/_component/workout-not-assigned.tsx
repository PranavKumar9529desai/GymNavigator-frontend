import { AlertTriangle, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import NoWorkoutAssignedImage from '../_assests/no-workout-assigned-2.webp';

export const WorkoutNotAssigned = () => {
  return (
    <div className="w-full">
      {/* Header Section with Gradient Background */}
      <div className="relative mb-6 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Today's Workout</h2>
          </div>
          <p className="text-blue-100">Complete your assigned exercises to track your progress</p>
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

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 text-center">
          <div className="mx-auto relative w-full aspect-square mb-6" style={{ maxWidth: '280px' }}>
            <Image
              src={NoWorkoutAssignedImage}
              alt="No workouts assigned"
              fill
              className="object-contain mix-blend-multiply"
              style={{
                filter: 'contrast(1.1) brightness(1.05)',
                transform: 'scale(1.2)',
              }}
              priority
            />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-amber-50 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No Workouts Assigned</h3>
          </div>

          <p className="text-gray-600 mx-auto text-base">
            Your trainer hasn't assigned any workouts to you yet. Check back later or contact your
            trainer for more information.
          </p>
        </div>
      </div>
    </div>
  );
};
