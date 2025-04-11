"use client";

import Image from "next/image";
import NoDiet from "../_assests/no-diet-assigned.png";
import NoWorkout from "../_assests/no-workouts-assigned.png";
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
      message: "You don't have any workout plans assigned yet.",
      subMessage:
        'You can explore available workouts in the "All Workouts" section. Contact your trainer to get a personalized workout plan.',
    },
    diet: {
      image: "/dashboard/client/_assests/no-diet-assigned.png",
      title: "No Diet Plan Assigned",
      message: "You don't have any diet plans assigned yet.",
      subMessage:
        "Please contact your trainer to get a personalized diet plan.",
    },
  };

  const { image, title, message, subMessage } = content[type];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="relative w-64 h-64 mx-auto mb-6">
          <Image
            src={type === "workout" ? NoWorkout : NoDiet}
            alt={title}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-emerald-600 to-green-500 text-transparent bg-clip-text">
          {title}
        </h2>

        <p className="text-gray-700 mb-2 font-medium">{message}</p>

        <p className="text-sm text-gray-600">{subMessage}</p>
      </div>
    </div>
  );
}
