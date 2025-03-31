'use client';

import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createDietPlan } from '../_actions/create-diet-plan';
import type { DietPlanInterface, MealInterface } from './diet-plan-types';
import ProgressSteps from './progress-steps';
import StepOne from './steps/step-one';
import StepThree from './steps/step-three';
import StepTwo from './steps/step-two';

const DEFAULT_DIET_PLAN: DietPlanInterface = {
	name: '',
	description: '',
	targetCalories: 2000,
	macroSplit: {
		protein: 30,
		carbs: 40,
		fats: 30,
	},
	meals: [],
};

const DEFAULT_MEAL: MealInterface = {
	name: '',
	time: '',
	calories: 0,
	protein: 0,
	carbs: 0,
	fats: 0,
	ingredients: [],
	instructions: '',
	order: 0,
};

export default function CreateDietPlan() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [currentStep, setCurrentStep] = useState(() => {
		if (typeof window !== 'undefined') {
			return Number.parseInt(localStorage.getItem('dietPlanStep') || '1');
		}
		return 1;
	});

	const [dietPlan, setDietPlan] = useState<DietPlanInterface>(() => {
		if (typeof window !== 'undefined') {
			const savedPlan = localStorage.getItem('dietPlanData');
			return savedPlan ? JSON.parse(savedPlan) : DEFAULT_DIET_PLAN;
		}
		return DEFAULT_DIET_PLAN;
	});

	const [currentMeal, setCurrentMeal] = useState<MealInterface>(() => {
		if (typeof window !== 'undefined') {
			const savedMeal = localStorage.getItem('currentMealData');
			return savedMeal ? JSON.parse(savedMeal) : DEFAULT_MEAL;
		}
		return DEFAULT_MEAL;
	});

	// Save to localStorage whenever data changes
	useEffect(() => {
		localStorage.setItem('dietPlanStep', currentStep.toString());
		localStorage.setItem('dietPlanData', JSON.stringify(dietPlan));
		localStorage.setItem('currentMealData', JSON.stringify(currentMeal));
	}, [currentStep, dietPlan, currentMeal]);

	// Add checkpoint saving logic
	const saveCheckpoint = (meal: MealInterface) => {
		const checkpoints = JSON.parse(
			localStorage.getItem('dietPlanCheckpoints') || '[]',
		);
		checkpoints.push({
			step: currentStep,
			meal: meal,
			timestamp: new Date().toISOString(),
		});
		localStorage.setItem('dietPlanCheckpoints', JSON.stringify(checkpoints));
		toast.success('Progress saved');
	};

	// Handle submission using server action
	const handleSubmit = async () => {
		try {
			// Validation checks
			if (!dietPlan.name) {
				toast.error('Please enter a plan name');
				return;
			}

			if (dietPlan.meals.length === 0) {
				toast.error('Please add at least one meal');
				return;
			}

			const total =
				dietPlan.macroSplit.protein +
				dietPlan.macroSplit.carbs +
				dietPlan.macroSplit.fats;
			if (total !== 100) {
				toast.error('Macro split percentages must add up to 100%');
				return;
			}

			// Prepare data for submission
			const dietPlanData = {
				name: dietPlan.name,
				description: dietPlan.description,
				targetCalories: dietPlan.targetCalories,
				proteinRatio: dietPlan.macroSplit.protein,
				carbsRatio: dietPlan.macroSplit.carbs,
				fatsRatio: dietPlan.macroSplit.fats,
				meals: dietPlan.meals.map((meal, index) => ({
					name: meal.name,
					timeOfDay: meal.time,
					calories: meal.calories,
					protein: meal.protein,
					carbs: meal.carbs,
					fats: meal.fats,
					instructions: meal.instructions,
					order: index + 1,
					ingredients: meal.ingredients.map((ingredient) => ({
						name: ingredient,
						quantity: 1,
						unit: 'serving',
						calories: 0,
						protein: 0,
						carbs: 0,
						fats: 0,
					})),
				})),
			};

			// Optimistically update UI
			const optimisticId = Date.now();

			// Add optimistic data to the cache with proper typing
			queryClient.setQueryData(
				['dietPlans'],
				(old: Array<{ id: number }> | undefined) => {
					const optimisticDietPlan = {
						id: optimisticId,
						...dietPlanData,
						isOptimistic: true,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					};

					return old ? [...old, optimisticDietPlan] : [optimisticDietPlan];
				},
			);

			setIsSubmitting(true);

			// Call the server action
			const result = await createDietPlan(dietPlanData);

			if (result.success) {
				// Clear all stored data
				localStorage.removeItem('dietPlanCheckpoints');
				localStorage.removeItem('dietPlanStep');
				localStorage.removeItem('dietPlanData');
				localStorage.removeItem('currentMealData');

				// Invalidate and refetch relevant queries
				queryClient.invalidateQueries({ queryKey: ['dietPlans'] });

				toast.success(result.message);
				router.push('/dashboard/trainer/diet/assigndietplan');
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			console.error('Error submitting diet plan:', error);
			toast.error('Failed to create diet plan');
		} finally {
			setIsSubmitting(false);
		}
	};

	const addMeal = () => {
		if (currentMeal.name && currentMeal.time) {
			setDietPlan((prev) => ({
				...prev,
				meals: [...prev.meals, currentMeal],
			}));
			// Save checkpoint after adding meal
			saveCheckpoint(currentMeal);
			setCurrentMeal({
				name: '',
				time: '',
				calories: 0,
				protein: 0,
				carbs: 0,
				fats: 0,
				ingredients: [],
				instructions: '',
				order: 0,
			});
		}
	};

	const removeMeal = (index: number) => {
		setDietPlan((prev) => ({
			...prev,
			meals: prev.meals.filter((_, i) => i !== index),
		}));
	};

	return (
		<div className="container mx-auto p-6">
			<ProgressSteps currentStep={currentStep} />

			<AnimatePresence mode="wait">
				{currentStep === 1 && (
					<StepOne dietPlan={dietPlan} setDietPlan={setDietPlan} />
				)}

				{currentStep === 2 && (
					<StepTwo dietPlan={dietPlan} setDietPlan={setDietPlan} />
				)}

				{currentStep === 3 && (
					<StepThree
						dietPlan={dietPlan}
						// setDietPlan={setDietPlan}
						currentMeal={currentMeal}
						setCurrentMeal={setCurrentMeal}
						addMeal={addMeal}
						removeMeal={removeMeal}
						saveCheckpoint={saveCheckpoint}
					/>
				)}
			</AnimatePresence>

			<div className="flex justify-between mt-8">
				<Button
					onClick={() => setCurrentStep((current) => Math.max(current - 1, 1))}
					disabled={currentStep === 1}
				>
					Previous
				</Button>
				{currentStep === 3 ? (
					<Button
						onClick={handleSubmit}
						variant="default"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
								Creating...
							</>
						) : (
							<>
								<Save className="w-4 h-4 mr-2" />
								Save Diet Plan
							</>
						)}
					</Button>
				) : (
					<Button
						onClick={() =>
							setCurrentStep((current) => Math.min(current + 1, 3))
						}
					>
						Next
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				)}
			</div>
		</div>
	);
}
