"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import WorkoutForm from "./workout-form";
import WorkoutResults from "./workout-results";
import type { UserData } from "../_actions/get-user-by-id";
import type { WorkoutPlan } from "../_actions/generate-ai-workout";
import { toast } from "@/hooks/use-toast";

interface ClientWorkoutGeneratorProps {
  user: UserData | null;
}

export default function ClientWorkoutGenerator({ user }: ClientWorkoutGeneratorProps) {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleWorkoutGenerated = (plan: WorkoutPlan) => {
    setWorkoutPlan(plan);
  };
  
  const handleSaveWorkout = async (plan: WorkoutPlan) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Here you would call your save workout server action
      // Example: await saveWorkoutPlan({ userId: user.id, plan });
      
      toast({
        title: "Success",
        description: "Workout plan has been saved successfully!",
      });
      
      // Reset state after save
      setWorkoutPlan(null);
    } catch (error) {
      console.error("Error saving workout plan:", error);
      toast({
        title: "Error",
        description: "Failed to save the workout plan",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDiscardWorkout = () => {
    setWorkoutPlan(null);
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">
        Generate Workout for {user?.name || 'Selected Client'}
      </h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {!workoutPlan ? (
          <div className="lg:col-span-2">
            <WorkoutForm 
              user={user} 
              onWorkoutGenerated={handleWorkoutGenerated} 
            />
          </div>
        ) : (
          <div className="lg:col-span-2">
            <WorkoutResults
              workoutPlan={workoutPlan}
              onSave={handleSaveWorkout}
              onDiscard={handleDiscardWorkout}
              isLoading={isSaving}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
