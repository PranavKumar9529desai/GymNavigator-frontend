"use client";

import { useState } from "react";
import { Pencil, CheckCircle, Save, X, Dumbbell, CalendarDays, Clock, FlameIcon, Award, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  WorkoutPlan,
  WorkoutSchedule,
  Exercise,
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

  const handleSave = () => {
    onSave(plan);
  };

  const updateSchedule = (index: number, updatedSchedule: WorkoutSchedule) => {
    const newSchedules = [...plan.schedules];
    newSchedules[index] = updatedSchedule;
    setPlan({ ...plan, schedules: newSchedules });
  };

  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      "Monday": "from-blue-500/20 to-blue-500/5",
      "Tuesday": "from-purple-500/20 to-purple-500/5",
      "Wednesday": "from-green-500/20 to-green-500/5",
      "Thursday": "from-amber-500/20 to-amber-500/5",
      "Friday": "from-rose-500/20 to-rose-500/5",
      "Saturday": "from-teal-500/20 to-teal-500/5",
      "Sunday": "from-orange-500/20 to-orange-500/5",
    };
    return colors[day] || "from-gray-500/20 to-gray-500/5";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold mb-1">
            {editMode ? (
              <Input
                value={plan.name}
                onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                className="font-bold text-xl py-2"
                aria-label="Workout name"
              />
            ) : (
              <span className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {plan.name}
              </span>
            )}
          </h2>
          <div className="text-muted-foreground text-sm">
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
              <p className="ml-7">{plan.description}</p>
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
                className="h-10 px-4"
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
              className="h-10 px-4"
            >
              <Pencil className="h-4 w-4 mr-1.5" /> Edit
            </Button>
          )}
        </div>
      </div>
      
      {plan.schedules.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
            <Dumbbell className="h-3 w-3" />
            {plan.schedules.length} workout days
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            Weekly plan
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {Math.round(plan.schedules.reduce((avg, s) => avg + s.duration, 0) / plan.schedules.length)} min avg
          </Badge>
        </div>
      )}

      <ScrollArea className="w-full pb-4 -mx-1 px-1">
        <Tabs defaultValue={plan.schedules[0]?.dayOfWeek || "Monday"} className="w-full">
          <TabsList className="mb-4 w-full h-12 overflow-x-auto flex-nowrap justify-start">
            {plan.schedules.map((schedule) => (
              <TabsTrigger 
                key={schedule.dayOfWeek} 
                value={schedule.dayOfWeek}
                className="flex-1 min-w-[100px] h-10 px-4"
              >
                <div>
                  <div>{schedule.dayOfWeek}</div>
                  <div className="text-xs opacity-70 font-normal">{schedule.muscleTarget}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {plan.schedules.map((schedule, scheduleIndex) => (
            <TabsContent key={schedule.dayOfWeek} value={schedule.dayOfWeek} className="focus-visible:outline-none focus-visible:ring-0 mt-2">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-b border-b relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10 z-0 pointer-events-none" />
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="inline-flex items-center justify-center bg-background/80 border backdrop-blur-sm text-foreground rounded-full h-7 w-7 shadow-sm">
                          <Dumbbell className="h-3.5 w-3.5" />
                        </span>
                        {schedule.muscleTarget}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {schedule.duration} minutes
                        </span>
                        <span className="flex items-center gap-1">
                          <FlameIcon className="h-3.5 w-3.5 text-orange-500" />
                          ~{schedule.calories} calories
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {schedule.exercises.map((exercise, index) => (
                      <div
                        key={`${exercise.name}-${index}`}
                        className="border hover:border-primary/20 rounded-lg p-4 transition-all hover:shadow-sm group bg-gradient-to-br from-transparent to-muted/30"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium flex gap-2 items-center">
                            <span className="bg-primary/10 text-primary text-sm rounded-full h-7 w-7 flex items-center justify-center font-semibold shrink-0 group-hover:bg-primary/20 transition-colors">
                              {index + 1}
                            </span>
                            <span className="flex gap-2">
                              <span className="text-lg select-none opacity-80" aria-hidden="true">
                                {getExerciseTypeIcon(exercise.name)}
                              </span>
                              {exercise.name}
                            </span>
                          </h4>
                          <span className="text-sm text-foreground/80 bg-muted px-2.5 py-1 rounded-full font-medium">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                        <p className="text-sm mt-2.5 ml-9 text-muted-foreground">{exercise.description}</p>
                      </div>
                    ))}
                    <div className="w-full flex justify-center pt-2">
                      <Badge variant="outline" className="flex items-center gap-1.5 py-1.5">
                        <CheckCheck className="h-3.5 w-3.5 text-green-600" />
                        Workout Complete
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </ScrollArea>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onDiscard} 
          className="h-11 sm:h-10"
        >
          Discard
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isLoading} 
          className="h-11 sm:h-10 bg-green-600 hover:bg-green-700"
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
      </div>
    </div>
  );
}
