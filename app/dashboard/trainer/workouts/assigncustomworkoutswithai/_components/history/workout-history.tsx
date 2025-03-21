'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock,
  Dumbbell,
  Goal,
  Grid3x3,
  ListFilter,
  MessageSquare,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { WorkoutPlan, WorkoutSchedule } from '../../_actions/generate-ai-workout';
import type { WorkoutHistoryItem } from '../../_actions/get-workout-history';
import { useWorkoutChatStore } from '../../_store/workout-chat-store';
import Exercise from './exercise';

// Define interfaces for handling alternative property names
interface WorkoutPlanWithAlternativeNames extends Partial<WorkoutPlan> {
  title?: string; // Alternative to 'name'
}

interface WorkoutScheduleWithAlternativeNames extends Partial<WorkoutSchedule> {
  focus?: string; // Alternative to 'muscleTarget'
}

// Define workout difficulty levels with corresponding colors
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800',
  moderate: 'bg-blue-100 text-blue-800',
  challenging: 'bg-orange-100 text-orange-800',
  intense: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

// Mapping for muscle target icons
const MUSCLE_ICONS: Record<string, React.ReactNode> = {
  'Upper Body': <Target className="h-3 w-3" />,
  'Lower Body': <Dumbbell className="h-3 w-3" />,
  'Full Body': <Activity className="h-3 w-3" />,
  Core: <Target className="h-3 w-3" />,
  Arms: <Dumbbell className="h-3 w-3" />,
  Legs: <Dumbbell className="h-3 w-3" />,
  Chest: <Target className="h-3 w-3" />,
  Back: <Target className="h-3 w-3" />,
};

interface WorkoutHistoryProps {
  history: WorkoutHistoryItem[];
  isLoading?: boolean;
  onViewWorkout?: (workout: WorkoutHistoryItem) => void;
  dataSource: 'local' | 'server';
}

// Helper function to get workout name regardless of field structure
function getWorkoutTitle(workoutPlan: WorkoutPlan | WorkoutPlanWithAlternativeNames): string {
  return (
    workoutPlan.name || (workoutPlan as WorkoutPlanWithAlternativeNames).title || 'Untitled Workout'
  );
}

// Helper function to determine workout focus/target area
function getWorkoutFocus(schedule: WorkoutSchedule | WorkoutScheduleWithAlternativeNames): string {
  return (
    schedule.muscleTarget || (schedule as WorkoutScheduleWithAlternativeNames).focus || 'General'
  );
}

// Helper function to determine workout difficulty
function getWorkoutDifficulty(workout: WorkoutHistoryItem): string {
  const exercisesCount = workout.workoutPlan.schedules.reduce(
    (sum, day) => sum + day.exercises.length,
    0,
  );
  const avgDuration =
    workout.workoutPlan.schedules.reduce((sum, day) => sum + (day.duration || 0), 0) /
    workout.workoutPlan.schedules.length;

  if (exercisesCount > 30 || avgDuration > 60) return 'intense';
  if (exercisesCount > 20 || avgDuration > 45) return 'challenging';
  if (exercisesCount > 10 || avgDuration > 30) return 'moderate';
  return 'easy';
}

export default function WorkoutHistory({
  history,
  isLoading = false,
  onViewWorkout,
  // dataSource,
}: WorkoutHistoryProps) {
  const { toast } = useToast();
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDay, setSelectedDay] = useState<{
    workoutId: string;
    dayIndex: number;
  } | null>(null);
  const { initializeConversation, reset } = useWorkoutChatStore();

  const toggleExpand = (id: string) => {
    // If we're viewing exercises for a day in this workout, close that view first
    if (selectedDay?.workoutId === id) {
      setSelectedDay(null);
    }
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const handleDayClick = (workoutId: string, dayIndex: number) => {
    setSelectedDay({ workoutId, dayIndex });
  };

  const closeSelectedDay = () => {
    setSelectedDay(null);
  };

  const handleViewWorkout = (workout: WorkoutHistoryItem) => {
    try {
      // Reset the current conversation first
      reset();

      // If conversation history exists, restore it instead of just initializing
      if (workout.conversationHistory && workout.conversationHistory.length > 0) {
        // Load the entire conversation history
        for (const message of workout.conversationHistory) {
          if (message.type === 'ai' && message.workout) {
            initializeConversation(message.workout);
          }
        }
      } else {
        // Fallback to just initializing with the workout plan
        initializeConversation(workout.workoutPlan);
      }

      if (onViewWorkout) {
        onViewWorkout(workout);
      }
    } catch (error) {
      console.error('Error viewing workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workout details',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="py-12 text-center bg-muted/20 rounded-lg">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">You haven't generated any workouts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Basic stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Total Workouts</div>
          <div className="text-2xl font-semibold">{history.length}</div>
        </div>
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Latest Workout</div>
          <div className="text-lg font-semibold truncate">
            {history.length > 0
              ? formatDistanceToNow(new Date(history[0].createdAt), {
                  addSuffix: true,
                })
              : 'None'}
          </div>
        </div>
        {/* <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Data Source</div>
          <div className="text-2xl font-semibold truncate capitalize">{dataSource}</div>
        </div> */}
      </div>

      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="h-9 w-9"
          >
            <ListFilter className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-9 w-9"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Workout list */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
        {history.map((item) => {
          const difficulty = getWorkoutDifficulty(item);
          const difficultyClass =
            DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] ||
            DIFFICULTY_COLORS.default;
          const isShowingDayExercises = selectedDay?.workoutId === item.id;

          return (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden bg-background hover:border-primary/30 transition-colors"
            >
              {/* Workout Header - Always visible */}
              <button
                type="button"
                className={`p-4 w-full text-left cursor-pointer hover:bg-muted/10 transition-colors ${
                  isShowingDayExercises ? 'bg-muted/10' : ''
                }`}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{getWorkoutTitle(item.workoutPlan)}</h4>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${difficultyClass}`}>
                        {difficulty}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.workoutPlan.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="bg-muted px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Goal className="h-3 w-3" />
                    <span>{item.clientName || 'Client'}</span>
                  </div>
                  <div className="bg-muted px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span>
                      {item.workoutPlan.schedules.length} day
                      {item.workoutPlan.schedules.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="bg-muted px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {Math.max(...item.workoutPlan.schedules.map((s) => s.duration || 0))} min
                    </span>
                  </div>
                  {item.conversationHistory && item.conversationHistory.length > 0 && (
                    <div className="bg-muted px-2.5 py-1 rounded-full flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{item.conversationHistory.length} messages</span>
                    </div>
                  )}
                </div>
              </button>

              {/* Schedule Summary or Day Exercise Detail */}
              {expandedItemId === item.id && (
                <div className="p-4 pt-0 border-t border-dashed">
                  {!isShowingDayExercises ? (
                    <div className="mt-3 space-y-2">
                      <h5 className="text-sm font-medium">Schedule Summary:</h5>
                      <div className="space-y-1.5">
                        {item.workoutPlan.schedules.map((day, idx) => {
                          const focus = getWorkoutFocus(day);
                          const _icon = MUSCLE_ICONS[focus] || <Target className="h-3 w-3" />;

                          return (
                            <div
                              key={`${item.id}-day-${day.dayOfWeek}`}
                              // type="button"
                              className="text-xs flex items-center bg-muted/30 px-3 py-2 rounded cursor-pointer hover:bg-muted/60 transition-colors w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDayClick(item.id, idx);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.stopPropagation();
                                  handleDayClick(item.id, idx);
                                }
                              }}
                            >
                              <div className="font-medium w-20">{day.dayOfWeek}:</div>
                              <div className="flex items-center mr-2">
                                {_icon}
                                <span className="ml-1 text-muted-foreground">{focus}</span>
                              </div>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {day.exercises.length} exercises • {day.duration || '?'} min
                              </span>
                              <ChevronRight className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {/* Day exercise details */}
                      {(() => {
                        const dayIndex = selectedDay?.dayIndex ?? 0;
                        const day = item.workoutPlan.schedules[dayIndex];
                        const focus = getWorkoutFocus(day);
                        const _icon = MUSCLE_ICONS[focus] || <Target className="h-3 w-3" />;

                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    closeSelectedDay();
                                  }}
                                >
                                  <ChevronRight className="h-4 w-4 -rotate-180" />
                                </Button>
                                <h5 className="text-sm font-medium flex items-center">
                                  <span>
                                    {day.dayOfWeek} - {focus}
                                  </span>
                                </h5>
                              </div>
                              <div className="text-xs flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{day.duration || '?'} min</span>
                              </div>
                            </div>

                            <div className="space-y-2 mt-2">
                              {day.exercises.map((exercise, exIndex) => (
                                <Exercise
                                  key={`${exercise.name}-${exIndex}`}
                                  exercise={exercise}
                                  index={exIndex}
                                  variant="default"
                                  showIndex={true}
                                />
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Show conversation summary if it exists */}
                  {!isShowingDayExercises &&
                    item.conversationHistory &&
                    item.conversationHistory.length > 1 && (
                      <div className="mt-3 space-y-2">
                        <h5 className="text-sm font-medium flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Conversation History:</span>
                        </h5>
                        <div className="text-xs bg-muted/30 px-3 py-2 rounded max-h-24 overflow-y-auto">
                          {item.conversationHistory.slice(1).map((message, idx) => (
                            <div key={idx as number} className="mb-1">
                              <span
                                className={`font-medium ${
                                  message.type === 'user' ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              >
                                {message.type === 'user' ? 'You: ' : 'AI: '}
                              </span>
                              <span className="truncate line-clamp-1">{message.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Load button - always at the bottom */}
                  <div className="mt-4">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewWorkout(item);
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Load This Workout</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
