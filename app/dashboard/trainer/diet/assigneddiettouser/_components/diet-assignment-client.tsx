"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserHealthProfileCard } from "./user-health-profile-card";
import { DietPlanSelector } from "./diet-plan-selector";
import { AssignmentScheduler } from "./assignment-scheduler";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  HealthProfile: {
    id: number;
    gender: string;
    age: number;
    goal: string;
    activityLevel: string;
    heightValue: number;
    heightUnit: string;
    weightValue: number;
    weightUnit: string;
    dietaryPreference: string;
    allergies: string;
    mealTimes: string;
    medicalConditions: string;
    bmi?: number;
    bmr?: number;
    tdee?: number;
  } | null;
  dietPlan?: {
    id: number;
    name: string;
    description: string;
    meals: any[];
  } | null;
}

interface DietPlan {
  id: number;
  name: string;
  description: string;
  targetCalories?: number;
  proteinPercent?: number;
  carbPercent?: number;
  fatPercent?: number;
  meals: {
    id: number;
    name: string;
    mealTime: string;
    calories?: number;
    proteinPercent?: number;
    carbPercent?: number;
    fatPercent?: number;
    instructions: string;
  }[];
  createdByTrainerId?: number;
}

interface DietAssignmentClientProps {
  userProfile: UserProfile;
  dietPlans: DietPlan[];
  userId: string;
}

interface AssignmentData {
  dietPlanId: number;
  startDate: Date;
  endDate: Date;
  daysOfWeek: string[];
  notes?: string;
}

export function DietAssignmentClient({
  userProfile,
  dietPlans,
  userId,
}: DietAssignmentClientProps) {
  const router = useRouter();
  const [selectedDietPlan, setSelectedDietPlan] = useState<DietPlan | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleBack = () => {
    router.push("/dashboard/trainer/assignedusers");
  };

  const handleDietPlanSelect = (dietPlan: DietPlan) => {
    setSelectedDietPlan(dietPlan);
    setShowScheduler(true);
  };

  const handleAssignDiet = async (assignmentData: AssignmentData) => {
    if (!selectedDietPlan) return;

    setIsAssigning(true);
    try {
      const response = await fetch("/api/trainer/diet/assigndiettouser/enhanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          dietPlanId: selectedDietPlan.id,
          startDate: assignmentData.startDate.toISOString(),
          endDate: assignmentData.endDate.toISOString(),
          daysOfWeek: assignmentData.daysOfWeek,
          notes: assignmentData.notes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Diet Plan Assigned Successfully",
          description: `${selectedDietPlan.name} has been assigned to ${userProfile.name}`,
        });
        
        // Navigate back after successful assignment
        setTimeout(() => {
          router.push("/dashboard/trainer/assignedusers");
        }, 1500);
      } else {
        throw new Error(result.error || "Failed to assign diet plan");
      }
    } catch (error: unknown) {
      console.error("Error assigning diet plan:", error);
      toast({
        title: "Assignment Failed",
        description: error instanceof Error ? error.message : "Failed to assign diet plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleBackToSelection = () => {
    setShowScheduler(false);
    setSelectedDietPlan(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBack();
            }
          }}
          className="p-2 hover:bg-blue-50/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back to assigned users</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Assign Diet Plan
            </h1>
            <p className="text-slate-600">
              Assign a customized diet plan to {userProfile.name}
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            !showScheduler ? "bg-blue-600 text-white" : "bg-green-600 text-white"
          }`}>
            {!showScheduler ? <User className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
          </div>
          <span className="font-medium text-slate-700">
            {!showScheduler ? "1. Select Diet Plan" : "2. Set Schedule"}
          </span>
        </div>
        <div className="h-px bg-slate-300 flex-1" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          showScheduler ? "bg-blue-600 text-white" : "bg-slate-300 text-slate-500"
        }`}>
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {/* Main content */}
      {!showScheduler ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - User Health Profile */}
          <UserHealthProfileCard userProfile={userProfile} />
          
          {/* Right side - Diet Plan Selection */}
          <DietPlanSelector 
            dietPlans={dietPlans}
            userProfile={userProfile}
            onSelectDietPlan={handleDietPlanSelect}
          />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <AssignmentScheduler
            selectedDietPlan={selectedDietPlan!}
            userProfile={userProfile}
            onAssign={handleAssignDiet}
            onBack={handleBackToSelection}
            isLoading={isAssigning}
          />
        </div>
      )}
    </div>
  );
}
