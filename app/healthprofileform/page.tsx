'use client';

import { useToast } from '@/hooks/use-toast';
import { gymTheme } from '@/styles/theme';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { submitHealthProfile } from './_actions/use-health-profile-mutation';
import { useHealthProfileStore } from './_store/health-profile-store';

import ActivityForm from './_components/activity-form';
import AgeForm from './_components/age-form';
// Form step components
import GenderForm from './_components/gender-form';
import GoalForm from './_components/goal-form';
import HeightForm from './_components/height-form';
import MedicalConditionsForm from './_components/medical-conditions-form';
import AllergiesForm from './_components/allergies-form';
import DietaryPreferencesForm from './_components/dietary-preferences-form';
import NonVegDaysForm from './_components/non-veg-days-form';
import MealTimesForm from './_components/meal-times-form';
import ReligiousPreferencesForm from './_components/religious-preferences-form';
import TargetWeightForm from './_components/target-weight-form';
import WeightForm from './_components/weight-form';

// Progress indicator component
const ProgressIndicator = ({
	currentStep,
	totalSteps,
}: { currentStep: number; totalSteps: number }) => {
	const { gender, dietaryPreference } = useHealthProfileStore();

	// Adjust total steps if user is not non-vegetarian (skipping the non-veg days form)
	const adjustedTotalSteps =
		dietaryPreference === 'non-vegetarian' ? totalSteps : totalSteps - 1;

	// Only show progress after gender is selected (first step completed)
	// If gender is null, show 0%, otherwise calculate based on completed steps
	const progressPercentage = !gender
		? 0
		: Math.floor(((currentStep - 1) / adjustedTotalSteps) * 100);

	return (
		<div className="w-full mb-8">
			<div className="flex justify-between mb-2">
				<span className="text-sm text-gray-500">
					Step {currentStep} of {adjustedTotalSteps}
				</span>
				<span className="text-sm font-medium">{progressPercentage}%</span>
			</div>
			<div className="w-full bg-gray-200 rounded-full h-2.5">
				<div
					className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
					style={{ width: `${progressPercentage}%` }}
				/>
			</div>
		</div>
	);
};

export default function HealthProfileFormPage() {
	const { currentStep, totalSteps, resetForm, ...formState } =
		useHealthProfileStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	// Reset form when component unmounts
	useEffect(() => {
		return () => resetForm();
	}, [resetForm]);

	// Skip non-veg days form if user is not non-vegetarian
	useEffect(() => {
		const { dietaryPreference } = useHealthProfileStore.getState();
		if (currentStep === 11 && dietaryPreference !== 'non-vegetarian') {
			// Skip to step 12 if not a non-vegetarian
			useHealthProfileStore.getState().nextStep();
		}
	}, [currentStep]);

	const handleFormSubmit = async () => {
		setIsSubmitting(true);
		try {
			const result = await submitHealthProfile(formState);
			if (result.success) {
				toast({
					title: 'Success!',
					description: 'Your health profile has been saved.',
					variant: 'default',
				});
				// Navigate to dashboard or appropriate page
				router.push('/dashboard');
			} else {
				toast({
					title: 'Something went wrong',
					description:
						result.error ||
						'Failed to save your health profile. Please try again.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred. Please try again.',
				variant: 'destructive',
			});
			console.error('Error submitting health profile:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Modified to return a Promise to match expected type
	const handleNextStep = async (): Promise<void> => {
		useHealthProfileStore.getState().nextStep();
		return Promise.resolve();
	};

	// Render the current step component
	const renderStep = () => {
		const { dietaryPreference } = useHealthProfileStore();
		const _isNonVegetarian = dietaryPreference === 'non-vegetarian';

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
				return <GoalForm />;
			case 7:
				return <ActivityForm />;
			case 8:
				return (
					<MedicalConditionsForm
						onSubmit={handleNextStep}
						isSubmitting={false}
					/>
				);
			case 9:
				return <AllergiesForm />;
			case 10:
				return <DietaryPreferencesForm />;
			case 11:
				// Show NonVegDaysForm (useEffect will handle skipping)
				return <NonVegDaysForm />;
			case 12:
				return <MealTimesForm />;
			case 13:
				return (
					<ReligiousPreferencesForm
						onSubmit={handleFormSubmit}
						isSubmitting={isSubmitting}
						isLast={true}
					/>
				);
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
