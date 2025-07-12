'use client';

import { useToast } from '@/hooks/use-toast';
import { gymTheme } from '@/styles/theme';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { submitHealthProfileToApi } from './_actions/submit-health-profile';
import { useHealthProfileStore } from './_store/health-profile-store';
import type { HealthMetrics } from './calculate-health-data/health-data-types';

import ActivityForm from './_components/activity-form';
import AgeForm from './_components/age-form';
import AllergiesForm from './_components/allergies-form';
import DietaryPreferencesForm from './_components/dietary-preferences-form';
import FullNameForm from './_components/full-name-form';
import GenderForm from './_components/gender-form';
import GoalForm from './_components/goal-form';
import HeightForm from './_components/height-form';
import MealTimesForm from './_components/meal-times-form';
import MealTimingsForm from './_components/meal-timings-form';
import MedicalConditionsForm from './_components/medical-conditions-form';
import NonVegDaysForm from './_components/non-veg-days-form';
import ReligiousPreferencesForm from './_components/religious-preferences-form';
import SuccessForm from './_components/success-form';
import TargetWeightForm from './_components/target-weight-form';
import WeightForm from './_components/weight-form';
import WhatsappNumberForm from './_components/whatsapp-number-form';

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
				/>
			</div>
		</div>
	);
};

export default function HealthProfileFormPage() {
	const {
		currentStep,
		resetForm,
		dietaryPreference,
		...formState
	} = useHealthProfileStore();
	const [isSubmitting, startTransition] = useTransition();
	const [isCompleted, setIsCompleted] = useState(false);
	const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(
		null,
	);
	const { toast } = useToast();
	const router = useRouter();

	// Determine whether the user is non-vegetarian
	const isNonVegetarian = dietaryPreference === 'non-vegetarian';

	const handleFormSubmit = async () => {
		startTransition(async () => {
			try {
				// Retrieve current state directly from the store
				const currentState = useHealthProfileStore.getState();
				const result = await submitHealthProfileToApi(currentState);

				if (result.success) {
					if (result.data) {
						setHealthMetrics(result.data.healthMetrics);
					}
					toast({
						title: 'Success!',
						description: 'Your health profile has been saved.',
						variant: 'default',
					});
					setIsCompleted(true);
					router.push('/dashboard/');
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
			}
		});
	};

	const handleNextStep = async (): Promise<void> => {
		try {
			useHealthProfileStore.getState().nextStep();
			return Promise.resolve();
		} catch (error) {
			console.error('Error in handleNextStep:', error);
			toast({
				title: 'Error',
				description: 'Failed to proceed to next step. Please try again.',
				variant: 'destructive',
			});
		}
	};

	// Define form step arrays for non-vegetarian and vegetarian flows.
	const forms = useMemo(() => {
		return isNonVegetarian
			? [
					<FullNameForm key="1" />,
					<WhatsappNumberForm key="2" />,
					<GenderForm key="3" />,
					<AgeForm key="4" />,
					<HeightForm key="5" />,
					<WeightForm key="6" />,
					<ActivityForm key="7" />,
					<GoalForm key="8" />,
					<DietaryPreferencesForm key="9" />,
					<NonVegDaysForm key="10" />,
					<MealTimesForm key="11" />,
					<MealTimingsForm key="12" />,
					<AllergiesForm key="13" />,
					<MedicalConditionsForm
						key="14"
						onSubmit={handleNextStep}
						isSubmitting={false}
					/>,
					<ReligiousPreferencesForm
						key="15"
						onSubmit={handleFormSubmit}
						isSubmitting={isSubmitting}
						isLast={true}
					/>,
				]
			: [
					<FullNameForm key="1" />,
					<WhatsappNumberForm key="2" />,
					<GenderForm key="3" />,
					<AgeForm key="4" />,
					<HeightForm key="5" />,
					<WeightForm key="6" />,
					<ActivityForm key="7" />,
					<GoalForm key="8" />,
					<DietaryPreferencesForm key="9" />,
					<MealTimesForm key="10" />,
					<MealTimingsForm key="11" />,
					<AllergiesForm key="12" />,
					<MedicalConditionsForm
						key="13"
						onSubmit={handleNextStep}
						isSubmitting={false}
					/>,
					<ReligiousPreferencesForm
						key="14"
						onSubmit={handleFormSubmit}
						isSubmitting={isSubmitting}
						isLast={true}
					/>,
				];
	}, [isNonVegetarian, isSubmitting]);

	const effectiveTotalSteps = forms.length;

	// Get current form using the currentStep index (1-indexed)
	const currentForm = forms[currentStep - 1];

	if (isCompleted) {
		return <SuccessForm healthMetrics={healthMetrics} />;
	}

	return (
		<div className="max-w-md mx-auto px-4 py-8 pt-2">
			<ProgressIndicator
				currentStep={currentStep}
				totalSteps={effectiveTotalSteps}
			/>
			{currentForm}
		</div>
	);
}
