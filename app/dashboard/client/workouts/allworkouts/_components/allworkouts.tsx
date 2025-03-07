"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { Activity, ArrowRight, Dumbbell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import getAllMuscles, { type MuscleGroup } from "../actions/getAllMuscles";
import { useQuery } from "@tanstack/react-query";

// Simplified animations for better mobile performance
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const categories = [
  { name: "All", icon: Activity },
  { name: "Upper Body", icon: Dumbbell },
  { name: "Lower Body", icon: Dumbbell },
  { name: "Core", icon: Dumbbell },
];

const upperBodyMuscles = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Traps",
  "Forearms",
];
const lowerBodyMuscles = ["Quads", "Hamstrings", "Calves", "Glutes"];
const coreMuscles = ["Abs", "Obliques", "Lower Back"];

export const Allworkouts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredMuscles, setFilteredMuscles] = useState<MuscleGroup[]>([]);
  const Router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["muscles"],
    queryFn: async () => {
      const data = await getAllMuscles();
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  const muscles = data?.muscles || [];

  useEffect(() => {
    if (!muscles.length) return;

    let filtered = [...muscles];

    if (selectedCategory === "Upper Body") {
      filtered = filtered.filter((m) => upperBodyMuscles.includes(m.name));
    } else if (selectedCategory === "Lower Body") {
      filtered = filtered.filter((m) => lowerBodyMuscles.includes(m.name));
    } else if (selectedCategory === "Core") {
      filtered = filtered.filter((m) => coreMuscles.includes(m.name));
    }

    filtered = filtered.filter((muscle) =>
      muscle.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredMuscles(filtered);
  }, [searchTerm, muscles, selectedCategory]);

  const handleMuscleClick = (muscleName: string) => {
    Router.push(
      `/dashboard/client/workouts/allworkouts/${muscleName.toLowerCase()}`
    );
  };

  console.log("filteredMuscles", filteredMuscles);

  return (
    <section className="space-y-8">
      {/* Search and Filters */}
      <div className=" z-10 p-4">
        <nav aria-label="Workout categories" className="mb-4">
          <div className="grid grid-cols-2 md:flex md:flex-row gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors",
                  "w-full md:w-auto",
                  selectedCategory === category.name
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                )}
                type="button"
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="search"
            placeholder="Search muscle groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2"
            aria-label="Search muscle groups"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div role="alert" className="p-4 text-center text-red-500">
          <p className="text-xl font-semibold">Error loading workouts</p>
          <p className="text-sm">
            {error instanceof Error ? error.message : error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMuscles?.length === 0 ? (
            <p className="col-span-full text-center py-8 text-gray-500">
              No workouts found matching your criteria
            </p>
          ) : (
            filteredMuscles.map((muscle) => (
              <article
                key={muscle.name}
                onClick={() => handleMuscleClick(muscle.name)}
                className="group cursor-pointer rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-blue-500 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={muscle.image_url as string}
                    alt={`${muscle.name} exercises`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <span className="px-3 py-1 bg-blue-500/90 rounded-full text-sm text-white">
                      {selectedCategory}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/90 rounded-full text-sm text-white">
                      {muscle.exercises?.length || 0} Exercises
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-500 transition-colors">
                    {muscle.name.charAt(0).toUpperCase() +
                      muscle.name.slice(1).toLowerCase()}
                  </h2>
                  <p className="text-gray-600 mt-2 mb-4">
                    Master your {muscle.name.toLowerCase()} with our curated
                    exercises
                  </p>
                  <div className="flex items-center text-blue-500 group-hover:text-blue-600">
                    Explore Workouts
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
};
