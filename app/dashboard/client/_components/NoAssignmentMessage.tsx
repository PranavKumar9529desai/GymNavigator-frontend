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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col px-4 py-8 md:justify-center my-20 md:my-0">
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="relative w-64 h-64 mx-auto mb-6">
          <Image
            src={type === "workout" ? NoWorkout : NoDiet}
            alt={title}
            fill
            priority
            className="object-contain mix-blend-multiply dark:mix-blend-soft-light opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-lg px-2 py-3 mb-3">
          <div className="flex items-center justify-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
            <p className="text-red-600 font-medium text-left">{message}</p>
          </div>
        </div>

        {/* <p className="text-sm text-gray-600">{action}</p> */}
      </div>
    </div>
  );
}
