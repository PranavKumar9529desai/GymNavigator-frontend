'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, Dumbbell, Gauge, Loader2, Sparkles, StickyNote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { type WorkoutPlan, generateAiWorkout } from '../../_actions/generate-ai-workout';
import type { UserData } from '../../_actions/get-user-by-id';

const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const formSchema = z.object({
  workoutName: z.string().min(3, {
    message: 'Workout name must be at least 3 characters.',
  }),
  goal: z.string().min(1, {
    message: 'Please select a workout goal.',
  }),
  experience: z.string().min(1, {
    message: 'Please select experience level.',
  }),
  duration: z.number().min(10).max(120),
  workoutDays: z.array(z.string()).min(1, {
    message: 'Select at least one workout day.',
  }),
  specialInstructions: z.string().optional(),
});

interface WorkoutFormProps {
  user: UserData | null;
  onWorkoutGenerated?: (plan: WorkoutPlan) => void;
}

export default function WorkoutForm({ user, onWorkoutGenerated }: WorkoutFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Pre-fill goal if user has one in health profile
  const userGoal = user?.healthProfile?.goal?.toLowerCase() || '';
  const mappedGoal = userGoal.includes('strength')
    ? 'strength'
    : userGoal.includes('muscle') || userGoal.includes('hypertrophy')
      ? 'hypertrophy'
      : userGoal.includes('endurance')
        ? 'endurance'
        : userGoal.includes('weight') || userGoal.includes('fat')
          ? 'weight-loss'
          : userGoal.includes('tone') || userGoal.includes('lean')
            ? 'toning'
            : '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutName: user ? `Custom Plan for ${user.name}` : '',
      goal: mappedGoal,
      experience: 'intermediate', // Default value
      duration: 45,
      workoutDays: ['Monday', 'Wednesday', 'Friday'], // Default MWF schedule
      specialInstructions: '',
    },
  });

  // Get current values for form fields
  const selectedDays = form.watch('workoutDays');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please select a client first',
        variant: 'destructive',
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
        preferredDays: values.workoutDays,
        workoutDuration: values.duration,
        focusAreas: [], // Can be extended in future
        specialInstructions: values.specialInstructions,
      };

      const result = await generateAiWorkout(params);

      if (result.success && result.workoutPlan) {
        // Set the workout plan with the name from the form
        const workoutPlan = {
          ...result.workoutPlan,
          name: values.workoutName,
        };

        // Notify parent component
        if (onWorkoutGenerated) {
          onWorkoutGenerated(workoutPlan);
        }

        toast({
          title: 'Success',
          description: 'AI workout plan generated successfully!',
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: result.error || 'Failed to generate workout plan',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while generating the workout',
        variant: 'destructive',
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
              <FormLabel className="flex items-center gap-2 text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-labelledby="editIconTitle"
                  role="img"
                >
                  <title id="editIconTitle">Edit</title>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Workout Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Summer Shred Program"
                  {...field}
                  className="h-11 focus:border-indigo-600"
                />
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
                <FormLabel className="flex items-center gap-2 text-base">
                  <Dumbbell className="h-4 w-4" />
                  Workout Goal
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 border-gray-200 focus:border-indigo-600 bg-white-500 z-10">
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
                <FormLabel className="flex items-center gap-2 text-base">
                  <Gauge className="h-4 w-4" />
                  Experience Level
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 border-gray-200 focus:border-indigo-600">
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
            <FormItem className="border border-gray-100 rounded-lg p-4 shadow-sm">
              <FormLabel className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Workout Duration
              </FormLabel>
              <div className="pt-2 px-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>10 min</span>
                  <span className="font-medium text-indigo-700">{field.value} min</span>
                  <span>120 min</span>
                </div>
                <FormControl>
                  <Slider
                    min={10}
                    max={120}
                    step={5}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="py-5"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workoutDays"
          render={() => (
            <FormItem className="border border-gray-100 rounded-lg p-4 shadow-sm">
              <FormLabel className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Workout Days
              </FormLabel>
              <FormDescription>
                Select the days to include in the workout plan ({selectedDays.length} days selected)
              </FormDescription>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {daysOfWeek.map((day) => (
                  <FormField
                    key={day.id}
                    control={form.control}
                    name="workoutDays"
                    render={({ field }) => {
                      return (
                        <FormItem key={day.id} className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day.label)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, day.label])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== day.label),
                                    );
                              }}
                              className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-normal cursor-pointer">
                            {day.label.substring(0, 3)}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-base">
                <StickyNote className="h-4 w-4" />
                Special Instructions (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any specific requirements or preferences for this workout"
                  className="resize-none h-24 focus:border-indigo-600"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 mt-2 text-base bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-indigo-700/90 text-white border-0 hover:opacity-90 shadow-md"
          disabled={isGenerating || !user}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Workout...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate AI Workout
            </>
          )}
        </Button>

        {!user && (
          <div className="text-sm text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
            <p className="font-medium">No Client Selected</p>
            <p className="text-amber-700">
              Please select a client first to generate a workout plan
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}
