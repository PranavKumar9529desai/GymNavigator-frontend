"use client";

import { useState } from "react";
import { Pencil, CheckCircle, Save, X } from "lucide-react";
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
import type {
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

  const handleSave = () => {
    onSave(plan);
  };

  const updateSchedule = (index: number, updatedSchedule: WorkoutSchedule) => {
    const newSchedules = [...plan.schedules];
    newSchedules[index] = updatedSchedule;
    setPlan({ ...plan, schedules: newSchedules });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {editMode ? (
              <Input
                value={plan.name}
                onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                className="font-bold text-xl"
              />
            ) : (
              plan.name
            )}
          </h2>
          <p className="text-muted-foreground">
            {editMode ? (
              <Textarea
                value={plan.description || ""}
                onChange={(e) =>
                  setPlan({ ...plan, description: e.target.value })
                }
                className="mt-2"
              />
            ) : (
              plan.description
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(false)}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setEditMode(false)}
              >
                <CheckCircle className="h-4 w-4 mr-1" /> Done
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={plan.schedules[0]?.dayOfWeek || "Monday"}>
        <TabsList className="mb-4">
          {plan.schedules.map((schedule) => (
            <TabsTrigger key={schedule.dayOfWeek} value={schedule.dayOfWeek}>
              {schedule.dayOfWeek}
            </TabsTrigger>
          ))}
        </TabsList>

        {plan.schedules.map((schedule, scheduleIndex) => (
          <TabsContent key={schedule.dayOfWeek} value={schedule.dayOfWeek}>
            <Card>
              <CardHeader>
                <CardTitle>{schedule.muscleTarget}</CardTitle>
                <CardDescription>
                  {schedule.duration} minutes • ~{schedule.calories} calories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedule.exercises.map((exercise, index) => (
                    <div
                      key={exercise.name + index}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">
                          {index + 1}. {exercise.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {exercise.sets} sets • {exercise.reps}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{exercise.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onDiscard}>
          Discard
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>Saving...</>
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
