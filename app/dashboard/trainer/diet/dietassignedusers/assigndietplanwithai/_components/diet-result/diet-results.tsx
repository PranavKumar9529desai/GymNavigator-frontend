'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assignDietPlan } from '@/app/dashboard/trainer/diet/createdietplan/_actions/assign-diet-plan';
import {
	saveDietPlan,
	type DietPlanInput,
} from '@/app/dashboard/trainer/diet/dietassignedusers/assigndietplanwithai/_actions/save-diet-plan';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Save, Share2, Trash2, Utensils } from 'lucide-react';

// Extend the meal type to include optional ingredients
interface MealWithIngredients {
	id?: number;
	name: string;
	timeOfDay: string;
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
	instructions?: string;
	ingredients?: Array<{
		name: string;
		quantity: number;
		unit: string;
		calories: number;
		protein?: number | null;
		carbs?: number | null;
		fats?: number | null;
	}>;
}

// This represents a diet plan that may not have been saved to the DB yet
interface ExtendedDietPlan {
	id?: number; // Optional because it doesn't exist until saved
	name: string;
	description?: string | null;
	targetCalories: number;
	proteinRatio: number;
	carbsRatio: number;
	fatsRatio: number;
	meals: MealWithIngredients[];
}

interface DietResultsProps {
	dietPlan: ExtendedDietPlan;
	onSuccess: () => void;
	clientName: string;
	userId: string;
	userName?: string;
}

// Define result data type
interface _DietPlanResult {
	id: number;
	name?: string;
	description?: string | null;
	createdAt?: string;
	updatedAt?: string;
	createdByTrainerId?: number;
	meals?: {
		id: number;
		name: string;
		calories?: number;
		[key: string]: unknown;
	}[];
}

export default function DietResults({
	dietPlan,
	onSuccess,
	clientName = 'Client',
	userId,
	userName,
}: DietResultsProps) {
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState('');
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [isAssigning, setIsAssigning] = useState(false);
	const [assignMessage, setAssignMessage] = useState('');
	const [assignSuccess, setAssignSuccess] = useState(false);
	const [dietPlanId, setDietPlanId] = useState<number | undefined>(
		dietPlan.id,
	);
	const router = useRouter();

	// Transform diet plan to the format expected by saveDietPlan
	const transformDietPlanForCreation = (
		plan: ExtendedDietPlan,
	): DietPlanInput => {
		// Transform meals to match the DietPlanInput type (without id field)
		const transformedMeals = plan.meals.map((meal, index) => ({
			name: meal.name,
			timeOfDay: meal.timeOfDay,
			calories: meal.calories,
			protein: meal.protein,
			carbs: meal.carbs,
			fats: meal.fats,
			instructions: meal.instructions || null,
			order: index + 1,
			ingredients: meal.ingredients || [],
		}));

		return {
			name: plan.name,
			description: plan.description || null,
			targetCalories: plan.targetCalories,
			proteinRatio: plan.proteinRatio,
			carbsRatio: plan.carbsRatio,
			fatsRatio: plan.fatsRatio,
			meals: transformedMeals,
		};
	};

	const handleSave = async () => {
		setIsSaving(true);
		setSaveMessage('');
		setSaveSuccess(false);

		try {
			// Transform the diet plan
			const transformedDietPlan = transformDietPlanForCreation(dietPlan);
			console.log('Sending diet plan to backend:', transformedDietPlan);

			const result = await saveDietPlan(transformedDietPlan);

			console.log('Save result from backend:', result);

			if (result.success && result.dietPlanId) {
				setSaveSuccess(true);
				setSaveMessage('Diet plan created successfully!');
				toast.success('Diet plan created successfully!');
				setDietPlanId(result.dietPlanId);
				router.refresh();

				// Call the onSuccess callback if provided
				if (onSuccess) {
					onSuccess();
				}
			} else {
				console.error('Failed to save diet plan:', result);
				setSaveSuccess(false);
				setSaveMessage(result.message || 'Failed to create diet plan');
				toast.error(result.message || 'Failed to create diet plan');
			}
		} catch (error) {
			console.error('Error saving diet plan:', error);
			setSaveSuccess(false);
			setSaveMessage('An unexpected error occurred while saving');
			toast.error('An unexpected error occurred while saving the diet plan');
		} finally {
			setIsSaving(false);
		}
	};

	const handleAssignDietPlan = async () => {
		if (!dietPlanId) {
			console.log('dietplan id is , userid is ', dietPlanId, userId);
			setAssignMessage('Please save the diet plan first before assigning');
			setAssignSuccess(false);
			toast.error('Please save the diet plan first before assigning');
			return;
		}

		setIsAssigning(true);
		setAssignMessage('');
		setAssignSuccess(false);

		try {
			console.log('dietplan id is , userid is', dietPlanId, userId);
			const result = await assignDietPlan({
				userId: Number(userId),
				dietPlanId: dietPlanId,
			});

			if (result.success) {
				setAssignSuccess(true);
				setAssignMessage(
					`Diet plan successfully assigned to ${userName || clientName}!`,
				);
				// Show success toast notification
				toast.success(
					`Diet plan successfully assigned to ${userName || clientName}!`,
					{},
				);
				router.refresh();
			} else {
				setAssignSuccess(false);
				setAssignMessage(result.error || 'Failed to assign diet plan');
				// Show error toast notification
				toast.error(result.error || 'Failed to assign diet ');
			}
		} catch (error) {
			console.error('Error assigning diet plan:', error);
			setAssignSuccess(false);
			setAssignMessage(
				'An unexpected error occurred while assigning diet plan',
			);
			// Show error toast notification
			toast.error('An unexpected error occurred while assigning diet plan');
		} finally {
			setIsAssigning(false);
		}
	};

	return (
		<div className="space-y-8">
			{/* Header with save/discard buttons */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Generated Diet Plan for{' '}
						<span className="text-indigo-500">{clientName}</span>
					</h2>
					<p className="text-gray-500 dark:text-gray-400">
						Review, save, and assign the diet plan to your client.
					</p>
				</div>

				<div className="flex gap-2">
					<Button
						variant="outline"
						className="gap-1 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-gray-300"
						onClick={handleSave}
						disabled={isSaving || dietPlanId !== undefined}
					>
						<Save className="h-4 w-4" />
						{isSaving ? 'Saving...' : 'Save Diet Plan'}
					</Button>
					<Button
						className="gap-1 bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-indigo-700/90 hover:from-indigo-600 hover:to-blue-600 text-white"
						onClick={handleAssignDietPlan}
						disabled={isAssigning || dietPlanId === undefined}
					>
						<Share2 className="h-4 w-4" />
						{isAssigning ? 'Assigning...' : 'Assign to Client'}
					</Button>
				</div>
			</div>

			{saveMessage && (
				<div
					className={`p-3 rounded-md ${
						saveSuccess
							? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30'
							: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30'
					}`}
				>
					{saveMessage}
				</div>
			)}

			{/* Diet summary */}
			<Card className="bg-white/70 dark:bg-gray-950/70  border border-green-100/50 dark:border-green-800/30">
				<CardHeader className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-950/50 dark:via-emerald-950/30 dark:to-green-950/50 border-b border-green-100/50 dark:border-green-800/30">
					<CardTitle className="text-xl">Diet Plan Summary</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
						<div>
							<p className="text-sm text-gray-500">Target Calories</p>
							<p className="text-lg font-semibold">
								{dietPlan.targetCalories} kcal
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">Protein</p>
							<p className="text-lg font-semibold">{dietPlan.proteinRatio}%</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">Carbs</p>
							<p className="text-lg font-semibold">{dietPlan.carbsRatio}%</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">Fats</p>
							<p className="text-lg font-semibold">{dietPlan.fatsRatio}%</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Meals */}
			<div className="space-y-6">
				{dietPlan.meals.map((meal) => (
					<Card
						key={meal.id}
						className="bg-white/70 dark:bg-gray-950/70 border border-blue-100/50 dark:border-blue-800/30"
					>
						<CardHeader className="bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-blue-50/50 dark:from-blue-950/50 dark:via-sky-950/30 dark:to-blue-950/50 border-b border-blue-100/50 dark:border-blue-800/30">
							<div className="flex items-center gap-3">
								<Utensils className="h-5 w-5" />
								<div>
									<CardTitle className="text-base font-medium">
										{meal.name}
									</CardTitle>
									<p className="text-sm text-gray-500">{meal.timeOfDay}</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-4">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
								<span>{meal.calories} kcal</span>
								<span>Protein: {meal.protein}g</span>
								<span>Carbs: {meal.carbs}g</span>
								<span>Fats: {meal.fats}g</span>
							</div>
							{meal.instructions && (
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{meal.instructions}
								</p>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Bottom action buttons (mobile friendly duplication) */}
			<div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
				<Button
					variant="outline"
					className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
					onClick={() => onSuccess()}
				>
					<Trash2 className="h-4 w-4" />
					Discard
				</Button>
				<Button
					className="gap-1"
					onClick={handleSave}
					disabled={isSaving || dietPlanId !== undefined}
				>
					<Save className="h-4 w-4" />
					{isSaving ? 'Saving...' : 'Save Diet Plan'}
				</Button>
				<Button
					className="gap-1 bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-indigo-700/90 hover:from-indigo-600 hover:to-blue-600 text-white"
					onClick={handleAssignDietPlan}
					disabled={isAssigning || dietPlanId === undefined}
				>
					<Share2 className="h-4 w-4" />
					{isAssigning ? 'Assigning...' : 'Assign to Client'}
				</Button>
			</div>

			{/* Display assignment message */}
			{assignMessage && (
				<div
					className={`p-3 rounded-md mt-2 ${
						assignSuccess
							? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/30'
							: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30'
					}`}
				>
					{assignMessage}
				</div>
			)}
		</div>
	);
}
