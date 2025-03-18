"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Clock, Calendar, Edit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UserData } from "../_actions/get-user-by-id";

// Initialize with null - will be populated when the AI generates a workout
const workoutData = null;

interface WorkoutPreviewProps {
  user: UserData | null;
  generatedWorkout?: any; // Replace with your proper workout type
}

export default function WorkoutPreview({ user, generatedWorkout: propWorkout }: WorkoutPreviewProps) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState(workoutData);
  
  // Update local state when prop changes
  useEffect(() => {
    if (propWorkout) {
      setGeneratedWorkout(propWorkout);
    }
  }, [propWorkout]);

  const handleAssignWorkout = () => {
    if (!user || !generatedWorkout) return;
    
    setIsAssigning(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(`Assigning workout to ${user.name} (ID: ${user.id})`);
      setIsAssigning(false);
      setAssigned(true);
    }, 1500);
  };

  if (!generatedWorkout) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
        <div className="bg-muted/30 p-6 rounded-full mb-4">
          <Dumbbell className="h-12 w-12 text-muted-foreground/70" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-medium mb-2">No Workout Generated Yet</h3>
        <p className="text-muted-foreground max-w-md">
          {user 
            ? "Complete the form and click \"Generate AI Workout\" to create a personalized workout plan."
            : "Select a client first, then complete the form to generate a personalized workout plan."
          }
        </p>
      </div>
    );
  }

  if (assigned) {
    return (
      <Alert className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-5 w-5" />
        <AlertTitle className="text-green-800">Workout Successfully Assigned!</AlertTitle>
        <AlertDescription className="text-green-700">
          "{generatedWorkout.name}" has been assigned to {user?.name}. They'll be notified about their new workout plan.
        </AlertDescription>
        <Button 
          variant="outline" 
          className="mt-4 border-green-200 bg-green-100/50 text-green-800 hover:bg-green-100 hover:text-green-900"
          onClick={() => setAssigned(false)}
        >
          Create Another Workout
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold">{generatedWorkout.name}</h3>
        <p className="text-sm text-muted-foreground">{generatedWorkout.description}</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Dumbbell className="h-3 w-3" />
          {generatedWorkout.goal}
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {generatedWorkout.duration} minutes
        </Badge>
        <Badge variant="secondary">{generatedWorkout.experience}</Badge>
        {generatedWorkout.days.map((day) => (
          <Badge key={day} variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {day}
          </Badge>
        ))}
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {generatedWorkout.exercises.map((exercise) => (
          <AccordionItem key={exercise.id} value={exercise.id}>
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex justify-between w-full pr-2 text-left">
                <div className="font-medium">{exercise.name}</div>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  {exercise.sets} sets × {exercise.reps} reps
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="border rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Sets</div>
                  <div className="font-medium">{exercise.sets}</div>
                </div>
                <div className="border rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Reps</div>
                  <div className="font-medium">{exercise.reps}</div>
                </div>
                <div className="border rounded-md p-2">
                  <div className="text-xs text-muted-foreground">Rest</div>
                  <div className="font-medium">{exercise.rest}</div>
                </div>
              </div>
              {exercise.notes && (
                <div className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium text-foreground">Notes:</span> {exercise.notes}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-4 w-4" /> Edit
        </Button>
        <Button 
          onClick={handleAssignWorkout} 
          disabled={isAssigning || !user}
          className="px-6"
        >
          {isAssigning ? "Assigning..." : "Assign to Client"}
        </Button>
      </div>
    </div>
  );
}
