"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import type { UserData } from "../_actions/get-user-by-id";
import { generateAiWorkout, WorkoutPlan } from "../_actions/generate-ai-workout";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  workoutName: z.string().min(3, {
    message: "Workout name must be at least 3 characters.",
  }),
  goal: z.string().min(1, {
    message: "Please select a workout goal.",
  }),
  experience: z.string().min(1, {
    message: "Please select experience level.",
  }),
  duration: z.number().min(10).max(120),
  specialInstructions: z.string().optional(),
});

interface WorkoutFormProps {
  user: UserData | null;
  onWorkoutGenerated?: (plan: WorkoutPlan) => void;
}

export default function WorkoutForm({ user, onWorkoutGenerated }: WorkoutFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);

  // Pre-fill goal if user has one in health profile
  const userGoal = user?.healthProfile?.goal?.toLowerCase() || "";
  const mappedGoal = 
    userGoal.includes("strength") ? "strength" :
    userGoal.includes("muscle") || userGoal.includes("hypertrophy") ? "hypertrophy" :
    userGoal.includes("endurance") ? "endurance" :
    userGoal.includes("weight") || userGoal.includes("fat") ? "weight-loss" :
    userGoal.includes("tone") || userGoal.includes("lean") ? "toning" : 
    "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutName: user ? `Custom Plan for ${user.name}` : "",
      goal: mappedGoal,
      experience: "intermediate", // Default value
      duration: 45,
      specialInstructions: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Error",
        description: "Please select a client first",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Map form values to workout generation params
      const params = {
        userId: user.id,
        goals: values.goal,
        fitnessLevel: values.experience,
        preferredDays: ["Monday", "Wednesday", "Friday"], // Default to MWF schedule
        workoutDuration: values.duration,
        focusAreas: [], // Can be extended in future
        // healthConditions: user.healthProfile?.healthConditions || [],
      };
      
      const result = await generateAiWorkout(params);
      
      if (result.success && result.workoutPlan) {
        // Set the workout plan with the name from the form
        const workoutPlan = {
          ...result.workoutPlan,
          name: values.workoutName,
        };
        
        setGeneratedWorkout(workoutPlan);
        
        // Notify parent component
        if (onWorkoutGenerated) {
          onWorkoutGenerated(workoutPlan);
        }
        
        toast({
          title: "Success",
          description: "AI workout plan generated successfully!",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate workout plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating workout:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating the workout",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="workoutName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Shred Program" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="strength">Strength Building</SelectItem>
                    <SelectItem value="hypertrophy">Muscle Growth</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="toning">Toning</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Duration: {field.value} minutes</FormLabel>
              <FormControl>
                <Slider
                  min={10}
                  max={120}
                  step={5}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Choose workout duration between 10-120 minutes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any specific requirements or preferences for this workout"
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isGenerating || !user}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Workout...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Workout
            </>
          )}
        </Button>
        
        {!user && (
          <p className="text-sm text-center text-muted-foreground">
            Select a client to create a personalized workout plan
          </p>
        )}
      </form>
    </Form>
  );
}
