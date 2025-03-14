import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import NoWorkoutAssignedImage from '../_assests/no-workout-assigned-2.webp';

export const WorkoutNotAssigned = () => {
  return (
    <div className="flex flex-col items-center px-4 text-center">
      <div className="max-w-md relative w-full aspect-square mb-8 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-4 after:blur-xl after:bg-black/20">
        <Image
          src={NoWorkoutAssignedImage}
          alt="No workouts assigned"
          fill
          className="object-contain mix-blend-multiply"
          style={{
            filter: 'contrast(1.1) brightness(1.05)',
            transform: 'scale(1.2)', // Zoom in the image by 40%
          }}
          priority
        />
      </div>

      <div className="flex items-center justify-center gap-2 mb-3">
        <AlertTriangle className="h-6 w-6 text-amber-500" />
        <h2 className="text-xl font-semibold">No Workouts Assigned</h2>
      </div>

      <p className="text-gray-500 max-w-md">
        Your trainer hasn't assigned any workouts to you yet. Check back later or contact your
        trainer for more information.
      </p>
    </div>
  );
};
