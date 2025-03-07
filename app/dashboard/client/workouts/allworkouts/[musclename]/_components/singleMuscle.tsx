"use client";

import type { Excercisetype } from "../actions/getSIngleMuscle";
import { m } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useExercises } from "./hooks/useExercises";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

interface SingleMusclesProps {
  initialExercises: Excercisetype[];
  muscleName: string;
}

export const SingleMuscles = ({
  initialExercises,
  muscleName,
}: SingleMusclesProps) => {
  const { data: exercises = initialExercises } = useExercises(muscleName);

  // Filter exercises by muscle name
  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise?.MuscleGroup?.name?.toLowerCase() === muscleName?.toLowerCase()
  );

  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen "
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white mt-4 mx-4 rounded-2xl shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptLTExLjk5NyAwYy02LjYyNyAwLTEyIDUuMzczLTEyIDEyczUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyLTUuMzczLTEyLTEyLTEyeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
          <m.div
            variants={itemVariants}
            className="relative flex flex-col items-center"
          >
            <span className="px-4 py-1.5 bg-blue-500/20 rounded-full text-blue-100 text-sm font-medium mb-6">
              Workout Guide
            </span>
            <div className="space-y-4 text-center">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                  {muscleName?.charAt(0)?.toUpperCase() + muscleName?.slice(1)}
                </span>
                <span className="ml-4 text-blue-100">Exercises</span>
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                Discover professional-grade exercises designed to target and
                strengthen your {muscleName?.toLowerCase()} muscles effectively.
              </p>
            </div>
          </m.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RecommenedExcercise Excercises={filteredExercises} />
      </div>
    </m.div>
  );
};

const RecommenedExcercise = ({
  Excercises,
}: {
  Excercises: Excercisetype[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");

  const difficultyOptions = [
    { value: "Beginner", icon: "🟢" },
    { value: "Intermediate", icon: "🟡" },
    { value: "Advanced", icon: "🔴" },
  ];

  const filteredExercises = Excercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      !difficultyFilter ||
      (exercise.instructions.length > 500 && difficultyFilter === "Advanced") ||
      (exercise.instructions.length > 200 &&
        difficultyFilter === "Intermediate") ||
      (exercise.instructions.length <= 200 && difficultyFilter === "Beginner");

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className=" rounded-2xl ">
        <div className="p-4 space-y-4">
          {/* Search and Filter Container */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>

            {/* Simple Difficulty Filter */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Difficulty:
              </span>
              <div className="flex gap-2">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setDifficultyFilter(
                        difficultyFilter === option.value ? "" : option.value
                      )
                    }
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                      transition-colors duration-200 border
                      ${
                        difficultyFilter === option.value
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span>{option.icon}</span>
                    <span className="hidden sm:inline">{option.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filter Indicator */}
          {difficultyFilter && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing{" "}
                <span className="font-medium text-blue-700">
                  {difficultyFilter}
                </span>{" "}
                exercises
              </span>
              <button
                type="button"
                onClick={() => setDifficultyFilter("")}
                className="text-red-500 hover:text-red-700 font-medium text-sm"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 px-2 sm:px-6 lg:px-8">
        {filteredExercises.map((excercise) => (
          <m.div
            key={`${excercise.name}-${excercise.MuscleGroup.id}`}
            variants={itemVariants}
            className="h-full"
          >
            <ExcerciseCard
              name={excercise.name}
              img={excercise.img}
              instructions={excercise.instructions}
            />
          </m.div>
        ))}
      </div>
    </div>
  );
};

const ExcerciseCard = ({
  name,
  img,
  instructions,
}: {
  name: string;
  img: string;
  instructions: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Calculate difficulty based on instruction length
  const difficulty =
    instructions.length > 500
      ? "Advanced"
      : instructions.length > 200
      ? "Intermediate"
      : "Beginner";

  const handleClick = () => {
    router.push(`${pathname}/${name}`);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md 
                 transition-all duration-200 border border-gray-100 h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={`${name} exercise`}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-102"
        />
        <div className="absolute bottom-2 right-2 px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm bg-white/50">
          {difficulty}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-1">
          {name}
        </h3>
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-between px-4 py-2.5 text-sm font-medium
                   text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl
                   hover:from-blue-700 hover:to-blue-800 transition-colors duration-200
                   shadow-sm"
        >
          <span>View Exercise</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};
