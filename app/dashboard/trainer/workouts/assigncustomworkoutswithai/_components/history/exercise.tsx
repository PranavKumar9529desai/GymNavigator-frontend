"use client";

import { Dumbbell } from "lucide-react";

interface ExerciseProps {
  exercise: {
    name: string;
    sets: string | number;
    reps: string | number;
    description: string;
    weight?: string | number;
    duration?: string | number;
    rest?: string | number;
    muscleGroup?: string;
  };
  index: number;
  variant?: "default" | "compact" | "detailed";
  showMuscleGroup?: boolean;
  showIndex?: boolean;
}

export default function Exercise({
  exercise,
  index,
  variant = "default",
  showMuscleGroup = false,
  showIndex = true,
}: ExerciseProps) {
  // Handle different display variants
  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          {showIndex && (
            <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
              {index + 1}
            </span>
          )}
          <span className="font-medium text-sm truncate max-w-[180px]">
            {exercise.name}
          </span>
        </div>
        <span className="text-xs bg-background/50 px-2 py-1 rounded-full">
          {exercise.sets} × {exercise.reps}
        </span>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className="rounded-xl p-4 transition-all shadow-sm group bg-gradient-to-br from-transparent to-muted/10 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 border">
        <div className="flex items-start gap-3">
          {showIndex ? (
            <span className="bg-indigo-600 text-white text-sm rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-sm mt-0.5">
              {index + 1}
            </span>
          ) : (
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full h-8 w-8 flex items-center justify-center shadow-sm mt-0.5">
              <Dumbbell className="h-4 w-4" />
            </span>
          )}
          <div className="flex-1">
            <h4 className="font-medium text-base group-hover:text-indigo-600 transition-colors">
              {exercise.name}
            </h4>
            
            {showMuscleGroup && exercise.muscleGroup && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full mt-1 inline-block">
                {exercise.muscleGroup}
              </span>
            )}
            
            <p className="text-sm mt-2 text-muted-foreground group-hover:text-foreground/70 transition-colors">
              {exercise.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-full font-medium">
                {exercise.sets} sets × {exercise.reps} reps
              </span>
              
              {exercise.weight && (
                <span className="text-xs bg-muted/50 px-2.5 py-1 rounded-full">
                  {exercise.weight} weight
                </span>
              )}
              
              {exercise.rest && (
                <span className="text-xs bg-muted/50 px-2.5 py-1 rounded-full">
                  {exercise.rest} rest
                </span>
              )}
              
              {exercise.duration && (
                <span className="text-xs bg-muted/50 px-2.5 py-1 rounded-full">
                  {exercise.duration} duration
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="rounded-xl p-3 sm:p-4 transition-all hover:shadow-md group bg-gradient-to-br from-transparent to-muted/5 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          {showIndex && (
            <span className="bg-indigo-600 text-white text-sm rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center font-bold shrink-0 shadow-sm mt-0.5">
              {index + 1}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm sm:text-base group-hover:text-indigo-600 transition-colors truncate">
              {exercise.name}
            </h4>
            <p className="text-xs sm:text-sm mt-1 text-muted-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
              {exercise.description}
            </p>
          </div>
        </div>
        <div className="ml-9 sm:ml-0 mt-1 sm:mt-0">
          <span className="text-xs sm:text-sm font-medium bg-muted/80 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 group-hover:text-indigo-600 px-2.5 py-1.5 rounded-full transition-colors inline-block">
            {exercise.sets} × {exercise.reps}
          </span>
        </div>
      </div>
    </div>
  );
}
