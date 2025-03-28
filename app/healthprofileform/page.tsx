'use client';

import { useEffect, useState } from 'react';
import { useHealthProfileStore } from './_store/health-profile-store';
import { submitHealthProfile } from './_actions/use-health-profile-mutation';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Form step components
import GenderForm from './_components/gender-form';
import AgeForm from './_components/age-form';
import WeightForm from './_components/weight-form';
import HeightForm from './_components/height-form';
import TargetWeightForm from './_components/target-weight-form';
import ActivityForm from './_components/activity-form';
import MedicalConditionsForm from './_components/medical-conditions-form';

// Progress indicator component
const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm font-medium">{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function HealthProfileFormPage() {
  const { currentStep, totalSteps, resetForm, ...formState } = useHealthProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  // Reset form when component unmounts
  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitHealthProfile(formState);
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your health profile has been saved.",
          variant: "default",
        });
        // Navigate to dashboard or appropriate page
        router.push('/dashboard');
      } else {
        toast({
          title: "Something went wrong",
          description: result.error || "Failed to save your health profile. Please try again.",
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

  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GenderForm />;
      case 2:
        return <AgeForm />;
      case 3:
        return <HeightForm />;
      case 4:
        return <WeightForm />;
      case 5:
        return <TargetWeightForm />;
      case 6:
        return <ActivityForm />;
      case 7:
        return <MedicalConditionsForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />;
      default:
        return <GenderForm />;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      {renderStep()}
    </div>
  );
}
