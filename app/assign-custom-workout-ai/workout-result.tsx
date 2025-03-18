"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { refineWorkout } from "./_actions/refine-workout";
import { FeedbackChat } from "./_components/feedback-chat";

interface WorkoutResultProps {
  initialPrompt: string;
  generatedWorkout: string;
  onSave: (workout: string) => Promise<void>;
  onRegenerate: () => Promise<void>;
}

export default function WorkoutResult({
  initialPrompt,
  generatedWorkout,
  onSave,
  onRegenerate,
}: WorkoutResultProps) {
  // State for conversation history
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: "ai" | "user";
    message: string;
    timestamp: Date;
  }>>([]);

  // State for loading and error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Current workout to display (starts with initial generated workout)
  const [currentWorkout, setCurrentWorkout] = useState(generatedWorkout);
  
  // Initialize conversation with AI's first response
  useEffect(() => {
    setConversationHistory([
      {
        type: "ai",
        message: generatedWorkout,
        timestamp: new Date(),
      },
    ]);
    setCurrentWorkout(generatedWorkout);
  }, [generatedWorkout]);

  // Handle feedback submission
  const handleSendFeedback = async (feedback: string) => {
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Add user's feedback to conversation history
      const newHistory = [
        ...conversationHistory,
        {
          type: "user",
          message: feedback,
          timestamp: new Date(),
        },
      ];
      
      setConversationHistory(newHistory);
      
      // Call server action to refine workout
      const result = await refineWorkout({
        initialPrompt,
        currentWorkout,
        feedback,
        conversationHistory: newHistory,
      });
      
      if (result.success && result.workout) {
        // Add AI's response to conversation history
        const updatedHistory = [
          ...newHistory,
          {
            type: "ai",
            message: result.workout,
            timestamp: new Date(),
          },
        ];
        
        setConversationHistory(updatedHistory);
        setCurrentWorkout(result.workout);
      } else {
        setError(result.error || "Failed to refine workout");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Custom Workout Plan</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRegenerate()} 
              disabled={isSubmitting}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button 
              size="sm" 
              onClick={() => onSave(currentWorkout)}
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Plan
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="whitespace-pre-wrap mb-6">
          <h3 className="text-lg font-medium mb-2">Current Workout Plan:</h3>
          <div className="bg-slate-50 p-4 rounded-md">
            {currentWorkout}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Refine Your Workout</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Not satisfied with this workout plan? Provide feedback and get a refined version.
          </p>
          
          <FeedbackChat
            initialWorkout={generatedWorkout}
            onSendFeedback={handleSendFeedback}
            isSubmitting={isSubmitting}
            conversationHistory={conversationHistory}
          />
        </div>
      </CardContent>
    </Card>
  );
}
