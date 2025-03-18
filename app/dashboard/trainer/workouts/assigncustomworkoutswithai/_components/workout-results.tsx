"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Award, CalendarDays, CheckCheck, CheckCircle, ChevronLeft, ChevronRight, Clock, Dumbbell, FlameIcon, Pencil, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  Exercise,
  WorkoutPlan,
  WorkoutSchedule,
} from "../_actions/generate-ai-workout";

interface WorkoutResultsProps {
  workoutPlan: WorkoutPlan;
  onSave: (plan: WorkoutPlan) => void;
  onDiscard: () => void;
  isLoading?: boolean;
}

export default function WorkoutResults({
  workoutPlan,
  onSave,
  onDiscard,
  isLoading = false,
}: WorkoutResultsProps) {
  const [plan, setPlan] = useState<WorkoutPlan>(workoutPlan);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(plan.schedules[0]?.dayOfWeek || "Monday");
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    onSave(plan);
  };

  const updateSchedule = (index: number, updatedSchedule: WorkoutSchedule) => {
    const newSchedules = [...plan.schedules];
    newSchedules[index] = updatedSchedule;
    setPlan({ ...plan, schedules: newSchedules });
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      "Monday": "from-blue-500 to-blue-600",
      "Tuesday": "from-purple-500 to-purple-600",
      "Wednesday": "from-green-500 to-green-600",
      "Thursday": "from-amber-500 to-amber-600",
      "Friday": "from-rose-500 to-rose-600",
      "Saturday": "from-teal-500 to-teal-600",
      "Sunday": "from-orange-500 to-orange-600",
    };
    return colors[day] || "from-gray-500 to-gray-600";
  };

  const getDayLightColor = (day: string) => {
    const colors: Record<string, string> = {
      "Monday": "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10",
      "Tuesday": "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10",
      "Wednesday": "from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10",
      "Thursday": "from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10",
      "Friday": "from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/10",
      "Saturday": "from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10",
      "Sunday": "from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10",
    };
    return colors[day] || "from-gray-100 to-gray-50 dark:from-gray-900/20 dark:to-gray-800/10";
  };

  const getExerciseTypeIcon = (exerciseName: string) => {
    // Determine icon based on exercise name
    if (/bench|press|push/i.test(exerciseName)) return "💪";
    if (/squat|leg|lunge/i.test(exerciseName)) return "🦵";
    if (/pull|row|curl/i.test(exerciseName)) return "🏋️";
    if (/run|sprint|cardio/i.test(exerciseName)) return "🏃";
    if (/plank|core|crunch/i.test(exerciseName)) return "⭐";
    return "🔄";
  };

  // Get the current schedule
  const currentSchedule = plan.schedules.find(s => s.dayOfWeek === activeTab) || plan.schedules[0];

  return (
    <div className="space-y-8">
      {/* Workout header with title and description */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white to-slate-50/80 dark:from-gray-900 dark:to-gray-950/80 p-6 shadow-sm"
      >
        <div className="absolute top-0 right-0 h-32 w-32 opacity-5 pointer-events-none">
          <Dumbbell className="h-full w-full" strokeWidth={1} />
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1">
            {editMode ? (
              <Input
                value={plan.name}
                onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                className="font-bold text-xl py-2 mb-3"
                aria-label="Workout name"
              />
            ) : (
              <h2 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                <Award className="h-6 w-6 text-primary" />
                {plan.name}
              </h2>
            )}
            
            <div className="text-muted-foreground text-sm mt-2">
              {editMode ? (
                <Textarea
                  value={plan.description || ""}
                  onChange={(e) =>
                    setPlan({ ...plan, description: e.target.value })
                  }
                  className="mt-2 min-h-[80px]"
                  placeholder="Add a description for this workout plan"
                  aria-label="Workout description"
                />
              ) : (
                <p className="ml-8 text-base">{plan.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(false)}
                  className="h-10 px-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  <X className="h-4 w-4 mr-1.5" /> Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setEditMode(false)}
                  className="h-10 px-4"
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" /> Done
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(true)}
                className="h-10 px-4 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Pencil className="h-4 w-4 mr-1.5" /> Edit
              </Button>
            )}
          </div>
        </div>
        
        {/* Workout stats badges */}
        {plan.schedules.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
              <Dumbbell className="h-3.5 w-3.5" />
              {plan.schedules.length} workout days
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
              <CalendarDays className="h-3.5 w-3.5" />
              Weekly plan
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {Math.round(plan.schedules.reduce((avg, s) => avg + s.duration, 0) / plan.schedules.length)} min avg
            </Badge>
          </div>
        )}
      </motion.div>
      
      {/* Workout schedule tabs */}
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center mb-1"
        >
          <h3 className="font-medium text-lg">Weekly Schedule</h3>
          <div className="ml-auto flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => scrollTabs('left')}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => scrollTabs('right')}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
        
        <ScrollArea className="w-full pb-4">
          <div ref={tabsRef} className="flex space-x-2 overflow-x-auto pb-1 hide-scrollbar">
            {plan.schedules.map((schedule) => (
              <motion.div
                key={schedule.dayOfWeek}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => setActiveTab(schedule.dayOfWeek)}
                  className={`flex flex-col items-center justify-center h-24 w-20 rounded-xl border text-sm transition-all ${
                    activeTab === schedule.dayOfWeek
                      ? `border-transparent ring-2 ring-primary bg-gradient-to-br ${getDayLightColor(schedule.dayOfWeek)}`
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 text-white bg-gradient-to-br ${
                    getDayColor(schedule.dayOfWeek)
                  }`}>
                    {schedule.dayOfWeek.slice(0, 1)}
                  </div>
                  <span className="font-medium">{schedule.dayOfWeek.slice(0, 3)}</span>
                  <span className="text-xs opacity-70 mt-0.5">{schedule.muscleTarget.split(" ")[0]}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Current day workout details */}
      <AnimatePresence mode="wait">
        {currentSchedule && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border bg-white dark:bg-gray-950 overflow-hidden shadow-sm"
          >
            {/* Workout header */}
            <div className={`p-5 bg-gradient-to-br ${getDayLightColor(currentSchedule.dayOfWeek)} border-b relative overflow-hidden`}>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="inline-flex items-center justify-center bg-gradient-to-br text-white rounded-full h-8 w-8 shadow-sm ${getDayColor(currentSchedule.dayOfWeek)}">
                      <Dumbbell className="h-4 w-4" />
                    </span>
                    {currentSchedule.muscleTarget}
                  </h3>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                    <span className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      {currentSchedule.duration} minutes
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <FlameIcon className="h-4 w-4 text-orange-500" />
                      ~{currentSchedule.calories} calories
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Exercise list */}
            <div className="p-4">
              <div className="space-y-3">
                {currentSchedule.exercises.map((exercise, index) => (
                  <motion.div
                    key={`${exercise.name}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="border hover:border-primary/30 rounded-xl p-5 transition-all hover:shadow-md group bg-gradient-to-br from-transparent to-muted/10"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium flex gap-2 items-center">
                        <span className={`bg-gradient-to-br ${getDayColor(currentSchedule.dayOfWeek)} opacity-90 text-white text-sm rounded-full h-8 w-8 flex items-center justify-center font-bold shrink-0 group-hover:opacity-100 transition-all shadow-sm`}>
                          {index + 1}
                        </span>
                        <span className="flex gap-2">
                          <span className="text-lg select-none opacity-90 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                            {getExerciseTypeIcon(exercise.name)}
                          </span>
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {exercise.name}
                          </span>
                        </span>
                      </h4>
                      <span className="text-sm font-medium bg-muted/80 group-hover:bg-primary/10 group-hover:text-primary px-3 py-1.5 rounded-full transition-colors">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </div>
                    <p className="text-sm mt-3 ml-10 text-muted-foreground group-hover:text-foreground/80 transition-colors">{exercise.description}</p>
                  </motion.div>
                ))}
                <div className="w-full flex justify-center pt-4">
                  <Badge variant="outline" className="flex items-center gap-2 py-2 px-4">
                    <CheckCheck className="h-4 w-4 text-green-600" />
                    Complete All Exercises
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t"
      >
        <Button 
          variant="outline" 
          onClick={onDiscard} 
          className="h-12 sm:h-11 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          Discard Plan
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isLoading} 
          className="h-12 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Workout Plan
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
