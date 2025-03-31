"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CheckCircle,
	Clock,
	Save,
	Trash2,
	UserCheck,
	Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { attachDietPlanToUser } from "../../../_actions /AttachDietPlanToUser";
import type { DietPlan } from "../../../_actions /GetallDiets";
import type { DietPlanInput } from "../../_actions/save-diet-plan";
import { useSaveToBackendMutation } from "../diet-history/use-diet-history";

// Extend the meal type to include optional ingredients
interface MealWithIngredients {
	id: number;
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

// Extend DietPlan to ensure it has the right meal type
interface ExtendedDietPlan extends Omit<DietPlan, "meals"> {
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
	clientName = "Client",
	userId,
	userName,
}: DietResultsProps) {
	const [saveMessage, setSaveMessage] = useState("");
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [isAssigning, setIsAssigning] = useState(false);
	const [assignMessage, setAssignMessage] = useState("");
	const [assignSuccess, setAssignSuccess] = useState(false);

	// Use the new backend-only mutation hook
	const saveToBackendMutation = useSaveToBackendMutation();

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
		setSaveMessage("");
		setSaveSuccess(false);

		try {
			// Transform the diet plan
			const transformedDietPlan = transformDietPlanForCreation(dietPlan);
			console.log("Sending diet plan to backend:", transformedDietPlan);
			
			// Use the backend-only mutation to save the diet plan
			const result = await saveToBackendMutation.mutateAsync({
				dietPlan: transformedDietPlan,
			});

			console.log("Save result from backend:", result);

			if (result.success) {
				setSaveSuccess(true);
				setSaveMessage("Diet plan created successfully!");
				toast.success("Diet plan created successfully!");

				// Update the local diet plan with the ID from the backend
				if (result.dietPlanId) {
					console.log("Diet plan ID from backend:", result.dietPlanId);
					dietPlan.id = result.dietPlanId;
				} else {
					console.warn("No diet plan ID returned from backend");
				}

				// Call the onSuccess callback if provided
				if (onSuccess) {
					setTimeout(() => {
						onSuccess();
					}, 1500);
				}
			} else {
				console.error("Failed to save diet plan:", result);
				setSaveSuccess(false);
				setSaveMessage(result.message || "Failed to create diet plan");
				toast.error(result.message || "Failed to create diet plan");
			}
		} catch (error) {
			console.error("Error saving diet plan:", error);
			setSaveSuccess(false);
			setSaveMessage("An unexpected error occurred while saving");
			toast.error("An unexpected error occurred while saving the diet plan");
		}
	};

	const handleAssignDietPlan = async () => {
		if (!dietPlan.id) {
			console.log("dietplan id is , userid is ", dietPlan.id, userId);
			setAssignMessage("Please save the diet plan first before assigning");
			setAssignSuccess(false);
			toast.error("Please save the diet plan first before assigning");
			return;
		}

		setIsAssigning(true);
		setAssignMessage("");
		setAssignSuccess(false);

		try {
			console.log("dietplan id is , userid is", dietPlan.id, userId);
			const result = await attachDietPlanToUser(userId, dietPlan.id.toString());

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
			} else {
				setAssignSuccess(false);
				setAssignMessage(result.message || "Failed to assign diet plan");
				// Show error toast notification
				toast.error(result.message || "Failed to assign diet ");
			}
		} catch (error) {
			console.error("Error assigning diet plan:", error);
			setAssignSuccess(false);
			setAssignMessage(
				"An unexpected error occurred while assigning diet plan",
			);
			// Show error toast notification
			toast.error("An unexpected error occurred while assigning diet plan");
		} finally {
			setIsAssigning(false);
		}
	};

	return (
		<div className="space-y-8">
			{/* Header with save/discard buttons */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-2xl font-bold">{dietPlan.name}</h2>
					<p className="text-muted-foreground">{dietPlan.description}</p>
				</div>

				<div className="flex gap-2">
					<Button
						variant="outline"
						className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
						onClick={() => onSuccess()}
					>
						<Trash2 className="h-4 w-4" />
						<span>Discard</span>
					</Button>

					<Button
						variant="default"
						className="gap-1 bg-gradient-to-br from-green-600/90 via-emerald-600/80 to-green-700/90 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
						onClick={handleSave}
						disabled={saveToBackendMutation.isPending || saveSuccess}
					>
						{saveToBackendMutation.isPending ? (
							<>
								<Clock className="h-4 w-4 animate-spin" />
								<span>Saving...</span>
							</>
						) : saveSuccess ? (
							<>
								<CheckCircle className="h-4 w-4" />
								<span>Saved</span>
							</>
						) : (
							<>
								<Save className="h-4 w-4" />
								<span>Save Diet Plan</span>
							</>
						)}
					</Button>
				</div>
			</div>

			{saveMessage && (
				<div
					className={`p-3 rounded-md ${
						saveSuccess
							? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30"
							: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30"
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="p-3 bg-green-50/50 dark:bg-green-900/20 rounded-md border border-green-100/50 dark:border-green-800/30 text-center">
							<div className="text-sm text-muted-foreground mb-1">
								Daily Calories
							</div>
							<div className="text-xl font-semibold text-green-700 dark:text-green-300">
								{dietPlan.targetCalories} kcal
							</div>
						</div>

						<div className="p-3 bg-green-50/50 dark:bg-green-900/20 rounded-md border border-green-100/50 dark:border-green-800/30 text-center">
							<div className="text-sm text-muted-foreground mb-1">Protein</div>
							<div className="text-xl font-semibold text-green-700 dark:text-green-300">
								{Math.round(dietPlan.proteinRatio * 100)}%
							</div>
						</div>

						<div className="p-3 bg-green-50/50 dark:bg-green-900/20 rounded-md border border-green-100/50 dark:border-green-800/30 text-center">
							<div className="text-sm text-muted-foreground mb-1">
								Meals per Day
							</div>
							<div className="text-xl font-semibold text-green-700 dark:text-green-300">
								{dietPlan.meals.length}
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<h3 className="font-medium text-lg flex items-center gap-2 text-green-800 dark:text-green-300">
							<Utensils className="h-5 w-5" />
							<span>Daily Meal Plan</span>
						</h3>

						<div className="space-y-4">
							{dietPlan.meals.map((meal) => (
								<Card
									key={meal.id}
									className="overflow-hidden border border-green-100/50 dark:border-green-800/30"
								>
									<CardHeader className="py-3 px-4 bg-green-50/70 dark:bg-green-900/30">
										<div className="flex justify-between items-center">
											<CardTitle className="text-base font-medium">
												{meal.name}
											</CardTitle>
											<span className="text-xs text-muted-foreground">
												{meal.timeOfDay}
											</span>
										</div>
									</CardHeader>
									<CardContent className="p-4">
										<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
											<div className="text-sm">
												<span className="text-muted-foreground">Calories:</span>{" "}
												<span className="font-medium">
													{meal.calories} kcal
												</span>
											</div>
											<div className="text-sm">
												<span className="text-muted-foreground">Protein:</span>{" "}
												<span className="font-medium">{meal.protein}g</span>
											</div>
											<div className="text-sm">
												<span className="text-muted-foreground">Carbs:</span>{" "}
												<span className="font-medium">{meal.carbs}g</span>
											</div>
											<div className="text-sm">
												<span className="text-muted-foreground">Fats:</span>{" "}
												<span className="font-medium">{meal.fats}g</span>
											</div>
										</div>

										{meal.instructions && (
											<div className="mt-2 text-sm">
												<div className="text-muted-foreground font-medium mb-1">
													Instructions:
												</div>
												<p className="text-sm">{meal.instructions}</p>
											</div>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bottom action buttons (mobile friendly duplication) */}
			<div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
				<Button
					variant="outline"
					className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
					onClick={() => onSuccess()}
				>
					<Trash2 className="h-4 w-4" />
					<span>Discard</span>
				</Button>

				<Button
					variant="default"
					className="gap-1 bg-gradient-to-br from-green-600/90 via-emerald-600/80 to-green-700/90 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
					onClick={handleSave}
					disabled={saveToBackendMutation.isPending || saveSuccess}
				>
					{saveToBackendMutation.isPending ? (
						<>
							<Clock className="h-4 w-4 animate-spin" />
							<span>Saving...</span>
						</>
					) : saveSuccess ? (
						<>
							<CheckCircle className="h-4 w-4" />
							<span>Saved</span>
						</>
					) : (
						<>
							<Save className="h-4 w-4" />
							<span>Save Diet Plan</span>
						</>
					)}
				</Button>

				<Button
					variant="default"
					className="gap-1 bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-indigo-700/90 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md mt-2 sm:mt-0"
					onClick={handleAssignDietPlan}
					disabled={isAssigning || assignSuccess || !dietPlan.id}
				>
					{isAssigning ? (
						<>
							<Clock className="h-4 w-4 animate-spin" />
							<span>Assigning...</span>
						</>
					) : assignSuccess ? (
						<>
							<CheckCircle className="h-4 w-4" />
							<span>Assigned</span>
						</>
					) : (
						<>
							<UserCheck className="h-4 w-4" />
							<span>Assign to {userName || clientName}</span>
						</>
					)}
				</Button>
			</div>

			{/* Display assignment message */}
			{assignMessage && (
				<div
					className={`p-3 rounded-md mt-2 ${
						assignSuccess
							? "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/30"
							: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30"
					}`}
				>
					{assignMessage}
				</div>
			)}
		</div>
	);
}
