"use client";

import { toast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import type {
  WorkoutPlan,
  WorkoutSchedule,
} from "../../_actions/generate-ai-workout";
import { refineWorkout } from "../../_actions/refine-workout";
import { useWorkoutChatStore } from "../../_store/workout-chat-store";
import { useWorkoutViewStore } from "../../_store/workout-view-store";

import ActionButtons from "./action-buttons";
import FeedbackSection from "./feedback-section";
import WeeklyScheduleTabs from "./weekly-schedule-tabs";
import WorkoutDayDetails from "./workout-day-details";
import WorkoutHeader from "./workout-header";

interface WorkoutResultsProps {
  workoutPlan: WorkoutPlan;
  onSave: (plan: WorkoutPlan) => void;
  onDiscard: () => void;
  isLoading?: boolean;
  userId: string;
  userName?: string;
}

export default function WorkoutResults({
  workoutPlan,
  onSave,
  onDiscard,
  isLoading = false,
  userId,
  userName = "Client", // Default name if not provided
}: WorkoutResultsProps) {
  const [plan, setPlan] = useState<WorkoutPlan>(workoutPlan);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(
    plan.schedules[0]?.dayOfWeek || "Monday"
  );
  const tabsRef = useRef<HTMLDivElement>(null);

  // Fetch state and actions from Zustand stores
  const {
    conversationHistory,
    isSubmittingFeedback,
    feedbackError,
    showFeedbackChat,
    initializeConversation,
    addUserMessage,
    addAIMessage,
    setSubmittingFeedback,
    setFeedbackError,
    toggleFeedbackChat,
    setShowFeedbackChat,
    saveWorkoutToHistory
  } = useWorkoutChatStore();

  const {
    activeWorkout,
    isAssigning,
    assignmentError,
    assignWorkout
  } = useWorkoutViewStore();

  // Initialize conversation with initial workout
  useEffect(() => {
    initializeConversation(workoutPlan);
  }, [workoutPlan, initializeConversation]);

  const handleSave = async () => {
    try {
      // Save workout with conversation history to localStorage
      const workoutId = saveWorkoutToHistory(plan, userId, userName);
      
      // If we have an active workout from history, assign it
      if (activeWorkout) {
        await assignWorkout(activeWorkout);
      }
      
      // Call the parent's onSave with the updated plan
      onSave(plan);
      
      // Show success toast
      toast({
        title: "Workout Saved",
        description: "Workout plan has been saved and assigned successfully.",
      });
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Error Saving",
        description: "There was a problem saving your workout plan.",
        variant: "destructive",
      });
    }
  };

  const updateSchedule = (index: number, updatedSchedule: WorkoutSchedule) => {
    const newSchedules = [...plan.schedules];
    newSchedules[index] = updatedSchedule;
    setPlan({ ...plan, schedules: newSchedules });
  };

  // Handle feedback submission
  const handleSendFeedback = async (feedback: string) => {
    try {
      setFeedbackError(null);
      setSubmittingFeedback(true);

      // Add user's feedback to conversation history
      addUserMessage(feedback);

      // Call server action to refine workout
      const result = await refineWorkout({
        userId,
        originalWorkoutPlan: plan,
        feedback,
        conversationHistory: conversationHistory.map(({ type, message, timestamp }) => ({
          type,
          message,
          timestamp,
        })),
      });

      if (result.success && result.workoutPlan) {
        // Add AI's response to conversation history
        addAIMessage(
          "I've refined the workout plan based on your feedback. Here's the updated version!",
          result.workoutPlan
        );
        
        setPlan(result.workoutPlan);

        toast({
          title: "Workout Plan Updated",
          description:
            "The AI has refined your workout plan based on your feedback.",
        });
      } else {
        setFeedbackError(result.error || "Failed to refine workout");
        toast({
          title: "Error",
          description: result.error || "Failed to refine workout plan",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setFeedbackError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Get the current schedule
  const currentSchedule =
    plan.schedules.find((s) => s.dayOfWeek === activeTab) || plan.schedules[0];

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      // Increase the scroll amount for better UX
      const scrollAmount = direction === "left" ? -200 : 200;
      
      // Use scrollTo with smooth behavior
      const currentScroll = tabsRef.current.scrollLeft;
      tabsRef.current.scrollTo({ 
        left: currentScroll + scrollAmount, 
        behavior: "smooth" 
      });
      
      // Add logging to help debug
      console.log(`Scrolling ${direction}: ${currentScroll} -> ${currentScroll + scrollAmount}`);
    }
  };

  return (
    <div className="space-y-8">
      <WorkoutHeader
        plan={plan}
        setPlan={setPlan}
        editMode={editMode}
        setEditMode={setEditMode}
        showFeedbackChat={showFeedbackChat}
        setShowFeedbackChat={setShowFeedbackChat}
      />

      {showFeedbackChat && (
        <FeedbackSection
          plan={plan}
          feedbackError={feedbackError}
          isSubmittingFeedback={isSubmittingFeedback}
          conversationHistory={conversationHistory}
          onSendFeedback={handleSendFeedback}
        />
      )}

      <WeeklyScheduleTabs
        plan={plan}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabsRef={tabsRef}
        scrollTabs={scrollTabs}
      />

      {currentSchedule && (
        <WorkoutDayDetails currentSchedule={currentSchedule} />
      )}

      <ActionButtons
        onSave={handleSave}
        onDiscard={onDiscard}
        isLoading={isLoading || isAssigning}
        showFeedbackChat={showFeedbackChat}
        toggleFeedback={toggleFeedbackChat}
      />
    </div>
  );
}
