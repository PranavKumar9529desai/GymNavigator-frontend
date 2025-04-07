"use client";

import { useEffect, useState } from "react";
import { useHealthProfileStore } from "./_store/health-profile-store";
import { submitHealthProfile } from "./_actions/use-health-profile-mutation";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { gymTheme } from "@/styles/theme";
import type { HealthMetrics } from "./calculate-health-data/health-data-types";

// Form step components
import GenderForm from "./_components/gender-form";
import AgeForm from "./_components/age-form";
import WeightForm from "./_components/weight-form";
import HeightForm from "./_components/height-form";
import GoalForm from "./_components/goal-form";
import TargetWeightForm from "./_components/target-weight-form";
import ActivityForm from "./_components/activity-form";
import DietaryPreferencesForm from "./_components/dietary-preferences-form";
import NonVegDaysForm from "./_components/non-veg-days-form";
import AllergiesForm from "./_components/allergies-form";
import MealTimesForm from "./_components/meal-times-form";
import MedicalConditionsForm from "./_components/medical-conditions-form";
import ReligiousPreferencesForm from "./_components/religious-preferences-form";
import SuccessForm from "./_components/success-form";

// Progress indicator component
const ProgressIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full bg-gradient-to-r ${gymTheme.colors.gradients.primaryBlue}`}
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function HealthProfileFormPage() {
  const {
    currentStep,
    totalSteps,
    dietaryPreference,
    resetForm,
    ...formState
  } = useHealthProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Determine whether to show non-veg days form based on dietary preference
  const isNonVegetarian = dietaryPreference === "non-vegetarian";

  // Reset form when component unmounts
  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitHealthProfile(formState);
      if (result.success) {
        // Store the health metrics for the success page
        if (result.healthMetrics) {
          setHealthMetrics(result.healthMetrics);
        }
        
        // Show success toast
        toast({
          title: "Success!",
          description: "Your health profile has been saved.",
          variant: "default",
        });
        
        // Set completed state to display success form
        setIsCompleted(true);
      } else {
        toast({
          title: "Something went wrong",
          description:
            result.error ||
            "Failed to save your health profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting health profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modified to return a Promise to match expected type
  const handleNextStep = async (): Promise<void> => {
    useHealthProfileStore.getState().nextStep();
    return Promise.resolve();
  };

  // Calculate effective total steps based on dietary preference
  const effectiveTotalSteps = isNonVegetarian ? totalSteps : totalSteps - 1;

  // Adjust step display for non-vegetarians (include non-veg days form)
  const getDisplayStep = (step: number) => {
    // If not non-vegetarian and past step 7 (dietary preferences), adjust the display step
    if (!isNonVegetarian && step > 7) {
      return step - 1;
    }
    return step;
  };

  // Handle automatic step advancement when dietary preference changes
  useEffect(() => {
    // If the user is on the non-veg days step (step 8) but is not non-vegetarian,
    // automatically advance them to the next step (meal times)
    if (currentStep === 8 && !isNonVegetarian) {
      useHealthProfileStore.getState().nextStep();
    }
  }, [currentStep, isNonVegetarian]);

  // Get actual form based on current step and dietary preference
  const getFormForStep = (step: number) => {
    // For non-vegetarians, show all steps normally
    if (isNonVegetarian) {
      switch (step) {
        case 1: return <GenderForm />;
        case 2: return <AgeForm />;
        case 3: return <HeightForm />;
        case 4: return <WeightForm />;
        case 5: return <ActivityForm />;
        case 6: return <GoalForm />;
        case 7: return <DietaryPreferencesForm />;
        case 8: return <NonVegDaysForm />;
        case 9: return <MealTimesForm />;
        case 10: return <AllergiesForm />;
        case 11: return <MedicalConditionsForm onSubmit={handleNextStep} isSubmitting={false} />;
        case 12: return <ReligiousPreferencesForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} isLast={true} />;
        default: return <GenderForm />;
      }
    } 
    // For vegetarians and vegans, skip the non-veg days form
    else {
      switch (step) {
        case 1: return <GenderForm />;
        case 2: return <AgeForm />;
        case 3: return <HeightForm />;
        case 4: return <WeightForm />;
        case 5: return <ActivityForm />;
        case 6: return <GoalForm />;
        case 7: return <DietaryPreferencesForm />;
        // Skip step 8 (NonVegDaysForm)
        case 8: return <MealTimesForm />;
        case 9: return <AllergiesForm />;
        case 10: return <MedicalConditionsForm onSubmit={handleNextStep} isSubmitting={false} />;
        case 11: return <ReligiousPreferencesForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} isLast={true} />;
        default: return <GenderForm />;
      }
    }
  };

  // If form is completed, show the success form
  if (isCompleted) {
    return <SuccessForm healthMetrics={healthMetrics} />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <ProgressIndicator
        currentStep={getDisplayStep(currentStep)}
        totalSteps={effectiveTotalSteps}
      />
      {getFormForStep(currentStep)}
    </div>
  );
}
