"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  type DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { toast } from "sonner";
import { createWorkoutPlan } from "./PostCreatedWorkoutplan";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description: string;
  order: number;
}

interface DaySchedule {
  dayOfWeek: string;
  muscleTarget: string;
  duration: number;
  calories: number;
  exercises: Exercise[];
}

interface WorkoutPlanResponse {
  success: boolean;
  message: string;
}

interface WorkoutPlanData {
  name: string;
  description: string;
  schedules: DaySchedule[];
}

// Type guard function to verify response shape
function isWorkoutPlanResponse(
  response: unknown
): response is WorkoutPlanResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    "message" in response &&
    typeof (response as WorkoutPlanResponse).success === "boolean" &&
    typeof (response as WorkoutPlanResponse).message === "string"
  );
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const muscleGroups = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
];

export default function CreateWorkoutPlan() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== "undefined") {
      return Number.parseInt(localStorage.getItem("workoutPlanStep") || "1");
    }
    return 1;
  });

  const [planName, setPlanName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("workoutPlanName") || "";
    }
    return "";
  });

  const [planDescription, setPlanDescription] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("workoutPlanDescription") || "";
    }
    return "";
  });

  const [schedules, setSchedules] = useState<DaySchedule[]>(() => {
    if (typeof window !== "undefined") {
      const savedSchedules = localStorage.getItem("workoutSchedules");
      return savedSchedules ? JSON.parse(savedSchedules) : [];
    }
    return [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("workoutPlanStep", currentStep.toString());
    localStorage.setItem("workoutPlanName", planName);
    localStorage.setItem("workoutPlanDescription", planDescription);
    localStorage.setItem("workoutSchedules", JSON.stringify(schedules));
  }, [currentStep, planName, planDescription, schedules]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const day = selectedDay;
    const items = Array.from(
      schedules.find((s) => s.dayOfWeek === day)?.exercises || []
    );

    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    setSchedules((current) =>
      current.map((schedule) =>
        schedule.dayOfWeek === day
          ? {
              ...schedule,
              exercises: items.map((item, index) => ({
                ...item,
                order: index,
              })),
            }
          : schedule
      )
    );
  };

  // Add checkpoint saving logic
  const saveCheckpoint = (daySchedule: DaySchedule) => {
    const checkpoints = JSON.parse(
      localStorage.getItem("workoutPlanCheckpoints") || "[]"
    );
    checkpoints.push({
      step: currentStep,
      schedule: daySchedule,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("workoutPlanCheckpoints", JSON.stringify(checkpoints));
    toast.success("Progress saved");
  };

  // Modify addExercise to save checkpoint when day is complete
  const addExercise = (day: string) => {
    const newExercise: Exercise = {
      name: "",
      sets: 3,
      reps: "8-12",
      description: "",
      order: schedules.find((s) => s.dayOfWeek === day)?.exercises?.length || 0,
    };

    setSchedules((current) => {
      const existingSchedule = current.find((s) => s.dayOfWeek === day);
      if (existingSchedule) {
        const updatedSchedule = {
          ...existingSchedule,
          exercises: [...existingSchedule.exercises, newExercise],
        };
        // Save checkpoint when day has 3 or more exercises
        if (updatedSchedule.exercises.length >= 3) {
          saveCheckpoint(updatedSchedule);
        }
        return current.map((schedule) =>
          schedule.dayOfWeek === day ? updatedSchedule : schedule
        );
      }
      const newSchedule = {
        dayOfWeek: day,
        muscleTarget: "",
        duration: 60,
        calories: 400,
        exercises: [newExercise],
      };
      return [...current, newSchedule];
    });
  };

  const updateExercise = (
    dayOfWeek: string,
    index: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    setSchedules((current) =>
      current.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? {
              ...schedule,
              exercises: schedule.exercises.map((ex, i) =>
                i === index ? { ...ex, [field]: value } : ex
              ),
            }
          : schedule
      )
    );
  };

  // Clear localStorage after successful submission
  const handleSubmit = async () => {
    try {
      // Validate schedules data
      if (!schedules.length) {
        toast.error("Please add at least one workout schedule");
        return;
      }

      // Prepare the workout plan data
      const workoutPlanData: WorkoutPlanData = {
        name: planName,
        description: planDescription,
        schedules: schedules.map((schedule) => ({
          dayOfWeek: schedule.dayOfWeek,
          muscleTarget: schedule.muscleTarget,
          duration: schedule.duration,
          calories: schedule.calories,
          exercises: schedule.exercises.map((exercise, index) => ({
            ...exercise,
            order: index,
          })),
        })),
      };

      const response = await createWorkoutPlan(workoutPlanData);

      if (!isWorkoutPlanResponse(response)) {
        throw new Error("Invalid response format from server");
      }

      if (response.success) {
        // Clear all stored data
        localStorage.removeItem("workoutPlanCheckpoints");
        localStorage.removeItem("workoutPlanStep");
        localStorage.removeItem("workoutPlanName");
        localStorage.removeItem("workoutPlanDescription");
        localStorage.removeItem("workoutSchedules");

        toast.success(response.message);
        // Optionally redirect to workout plans list
        router.push("/dashboard/trainer/workouts/assignworkout");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error submitting workout plan");
      console.error(error);
    }
  };

  // Add restore checkpoint function

  return (
    <div className="container mx-auto p-6">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2].map((step) => (
            <div
              key={step}
              className={`flex items-center ${
                currentStep >= step ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${
                    currentStep >= step
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }`}
              >
                {step}
              </div>
              {step < 2 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <m.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Create Workout Plan</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="planName"
                    className="block text-sm font-medium mb-2"
                  >
                    Plan Name
                  </label>
                  <Input
                    id="planName"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="e.g., Beginner Strength Training"
                  />
                </div>
                <div>
                  <label
                    htmlFor="planDescription"
                    className="block text-sm font-medium mb-2"
                  >
                    Description
                  </label>
                  <Textarea
                    id="planDescription"
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    placeholder="Describe the workout plan..."
                    rows={4}
                  />
                </div>
              </div>
            </m.div>
          )}

          {/* Step 2: Schedule Selection */}
          {currentStep === 2 && (
            <m.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Workout Schedule</h2>
              <div className="grid grid-cols-7 gap-4">
                {daysOfWeek.map((day) => (
                  <Card
                    key={day}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedDay === day ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    <p className="text-sm font-medium text-center">{day}</p>
                  </Card>
                ))}
              </div>

              {selectedDay && (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-4">
                      <Select
                        onValueChange={(value) =>
                          setSchedules((current) =>
                            current.map((schedule) =>
                              schedule.dayOfWeek === selectedDay
                                ? { ...schedule, muscleTarget: value }
                                : schedule
                            )
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select muscle group" />
                        </SelectTrigger>
                        <SelectContent>
                          {muscleGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Duration (minutes)"
                        className="w-32"
                        onChange={(e) =>
                          setSchedules((current) =>
                            current.map((schedule) =>
                              schedule.dayOfWeek === selectedDay
                                ? {
                                    ...schedule,
                                    duration: Number.parseInt(e.target.value),
                                  }
                                : schedule
                            )
                          )
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Calories"
                        className="w-32"
                        onChange={(e) =>
                          setSchedules((current) =>
                            current.map((schedule) =>
                              schedule.dayOfWeek === selectedDay
                                ? {
                                    ...schedule,
                                    calories: Number.parseInt(e.target.value),
                                  }
                                : schedule
                            )
                          )
                        }
                      />
                    </div>

                    <Droppable droppableId="exercises">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {schedules
                            .find((s) => s.dayOfWeek === selectedDay)
                            ?.exercises.map((exercise, index) => (
                              <Draggable
                                key={`${selectedDay}-exercise-${exercise.name}-${index}`}
                                draggableId={`exercise-${index}`}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-4 rounded-lg shadow space-y-3"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1 space-y-3">
                                        <Input
                                          placeholder="Exercise name"
                                          value={exercise.name}
                                          onChange={(e) =>
                                            updateExercise(
                                              selectedDay,
                                              index,
                                              "name",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <div className="flex gap-4">
                                          <div className="w-24">
                                            <Input
                                              type="number"
                                              placeholder="Sets"
                                              value={exercise.sets}
                                              onChange={(e) =>
                                                updateExercise(
                                                  selectedDay,
                                                  index,
                                                  "sets",
                                                  Number.parseInt(
                                                    e.target.value
                                                  )
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <Input
                                              placeholder="Reps (e.g., 8-12)"
                                              value={exercise.reps}
                                              onChange={(e) =>
                                                updateExercise(
                                                  selectedDay,
                                                  index,
                                                  "reps",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                        <Textarea
                                          placeholder="Exercise description"
                                          value={exercise.description}
                                          onChange={(e) =>
                                            updateExercise(
                                              selectedDay,
                                              index,
                                              "description",
                                              e.target.value
                                            )
                                          }
                                          rows={2}
                                        />
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-2"
                                        onClick={() => {
                                          setSchedules((current) =>
                                            current.map((schedule) =>
                                              schedule.dayOfWeek === selectedDay
                                                ? {
                                                    ...schedule,
                                                    exercises:
                                                      schedule.exercises.filter(
                                                        (_, i) => i !== index
                                                      ),
                                                  }
                                                : schedule
                                            )
                                          );
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <Button
                      onClick={() => selectedDay && addExercise(selectedDay)}
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Exercise
                    </Button>
                  </div>
                </DragDropContext>
              )}
            </m.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={() =>
              setCurrentStep((current) => Math.max(current - 1, 1))
            }
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {currentStep === 2 ? (
            <Button onClick={handleSubmit} variant="default">
              <Save className="w-4 h-4 mr-2" />
              Save Workout Plan
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentStep((current) => Math.min(current + 1, 2))
              }
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </m.div>
    </div>
  );
}
