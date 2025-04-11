"use client";

import Image from "next/image";
import NoDiet from "../_assests/no-diet-assigned.png";
import NoWorkout from "../_assests/no-workouts-assigned.png";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface NoAssignmentMessageProps {
  type: "workout" | "diet";
}

export default function NoAssignmentMessage({
  type,
}: NoAssignmentMessageProps) {
  const content = {
    workout: {
      image: "/dashboard/client/_assests/no-workouts-assigned.png",
      title: "No Workout Plan Assigned",
      message: "Contact your trainer for a personalized workout plan.",
      action: "Check All Workouts section for available exercises"
    },
    diet: {
      image: "/dashboard/client/_assests/no-diet-assigned.png",
      title: "No Diet Plan Assigned",
      message: "Contact your trainer for a personalized diet plan.",
      action: "View nutrition guidelines in the meantime"
    },
  };

  const { image, title, message, action } = content[type];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:items-center md:justify-center px-4 py-20">
      <div className="w-full max-w-3xl mx-auto text-center">
        <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto mb-8 md:mb-12 transition-all duration-300">
          <Image
            src={type === "workout" ? NoWorkout : NoDiet}
            alt={title}
            fill
            priority
            className="object-contain mix-blend-multiply dark:mix-blend-soft-light opacity-90 hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 256px, 384px"
          />
        </div>

        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            {title}
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-4 mb-4 max-w-lg mx-auto transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center justify-center space-x-3">
              <ExclamationTriangleIcon className="h-6 w-6 md:h-7 md:w-7 text-red-500 flex-shrink-0" />
              <p className="text-red-600 font-medium text-left text-base md:text-lg">{message}</p>
            </div>
          </div>

          {/* <p className="text-sm md:text-base text-gray-600 mt-4">{action}</p> */}
        </div>
      </div>
    </div>
  );
}
