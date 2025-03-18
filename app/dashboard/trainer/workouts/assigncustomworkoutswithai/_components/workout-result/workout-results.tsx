"use client";

import { toast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import type {
  WorkoutPlan,
  WorkoutSchedule,
} from "../../_actions/generate-ai-workout";
import { refineWorkout } from "../../_actions/refine-workout";

import WorkoutHeader from "./workout-header";
import FeedbackSection from "./feedback-section";
import WeeklyScheduleTabs from "./weekly-schedule-tabs";
import WorkoutDayDetails from "./workout-day-details";
import ActionButtons from "./action-buttons";

interface WorkoutResultsProps {
  workoutPlan: WorkoutPlan;
  onSave: (plan: WorkoutPlan) => void;
  onDiscard: () => void;
  isLoading?: boolean;
  userId: string;
}

export default function WorkoutResults({
  workoutPlan,
  onSave,
  onDiscard,
  isLoading = false,
  userId,
}: WorkoutResultsProps) {
  const [plan, setPlan] = useState<WorkoutPlan>(workoutPlan);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(
    plan.schedules[0]?.dayOfWeek || "Monday"
  );
  const tabsRef = useRef<HTMLDivElement>(null);

  // Feedback state
  const [showFeedbackChat, setShowFeedbackChat] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      type: "ai" | "user";
      message: string;
      workout?: WorkoutPlan;
      timestamp: Date;
    }>
  >([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Initialize conversation with initial workout
  useEffect(() => {
    setConversationHistory([
      {
        type: "ai",
        message:
          "Here's your personalized workout plan. Let me know if you'd like any modifications!",
        workout: workoutPlan,
        timestamp: new Date(),
      },
    ]);
  }, [workoutPlan]);

  const handleSave = () => {
    onSave(plan);
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
      setIsSubmittingFeedback(true);

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
        userId,
        originalWorkoutPlan: plan,
        feedback,
        conversationHistory: newHistory.map(({ type, message, timestamp }) => ({
          type,
          message,
          timestamp,
        })),
      });

      if (result.success && result.workoutPlan) {
        // Add AI's response to conversation history
        const updatedHistory = [
          ...newHistory,
          {
            type: "ai",
            message:
              "I've refined the workout plan based on your feedback. Here's the updated version!",
            workout: result.workoutPlan,
            timestamp: new Date(),
          },
        ];

        setConversationHistory(updatedHistory);
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
      setIsSubmittingFeedback(false);
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

  const toggleFeedbackChat = () => {
    setShowFeedbackChat(!showFeedbackChat);
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
        isLoading={isLoading}
        showFeedbackChat={showFeedbackChat}
        toggleFeedback={toggleFeedbackChat}
      />
    </div>
  );
}
