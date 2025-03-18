"use client";

import { useState } from "react";
import ClientDisplay from "./client-display";
import WorkoutForm from "./workout-form";
import WorkoutResults from "./workout-results";
import type { UserData } from "../_actions/get-user-by-id";
import type { WorkoutPlan } from "../_actions/generate-ai-workout";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6">
      {!workoutPlan ? (
        <motion.div
          className="grid gap-6 md:grid-cols-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="md:col-span-2">
            <ClientDisplay user={user} />
          </div>
          <div className="md:col-span-3 border rounded-lg p-5 sm:p-6 bg-white dark:bg-gray-950">
            <h2 className="text-xl font-medium mb-4">
              Generate AI Workout Plan
            </h2>
            <WorkoutForm 
              user={user} 
              onWorkoutGenerated={handleWorkoutGenerated} 
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border rounded-lg p-5 sm:p-8 bg-white dark:bg-gray-950"
        >
          <div className="mb-6">
            <Button
              variant="ghost" 
              size="sm" 
              onClick={handleDiscardWorkout}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to form
            </Button>
          </div>
          <WorkoutResults
            workoutPlan={workoutPlan}
            onSave={handleSaveWorkout}
            onDiscard={handleDiscardWorkout}
            isLoading={isSaving}
          />
        </motion.div>
      )}
    </div>
  );
}
