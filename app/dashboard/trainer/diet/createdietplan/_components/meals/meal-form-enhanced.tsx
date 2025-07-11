import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { type MealInterface, mealTimes } from '../diet-plan-types';

interface MealFormProps {
	currentMeal: MealInterface;
	setCurrentMeal: React.Dispatch<React.SetStateAction<MealInterface>>;
	addMeal: () => void;
}

export default function MealForm({
	currentMeal,
	setCurrentMeal,
	addMeal,
}: MealFormProps) {
	const [newIngredient, setNewIngredient] = useState('');
	const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
	const [scheduledTime, setScheduledTime] = useState('');
	const [showScheduling, setShowScheduling] = useState(false);

	const addIngredient = () => {
		if (newIngredient.trim()) {
			setCurrentMeal((prev) => ({
				...prev,
				ingredients: [...prev.ingredients, newIngredient.trim()],
			}));
			setNewIngredient('');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addIngredient();
		}
	};

	const removeIngredient = (index: number) => {
		setCurrentMeal((prev) => ({
			...prev,
			ingredients: prev.ingredients.filter((_, i) => i !== index),
		}));
	};

	const handleAddMeal = () => {
		// Create enhanced meal with scheduling info if provided
		let enhancedInstructions = currentMeal.instructions;
		
		if (scheduledDate || scheduledTime) {
			const schedulingInfo = [];
			if (scheduledDate) {
				schedulingInfo.push(`Date: ${format(scheduledDate, "yyyy-MM-dd")}`);
			}
			if (scheduledTime) {
				schedulingInfo.push(`Time: ${scheduledTime}`);
			}
			enhancedInstructions = `[Scheduled - ${schedulingInfo.join(', ')}] ${enhancedInstructions}`;
		}

		// Update the current meal with enhanced instructions containing scheduling info
		setCurrentMeal((prev) => ({
			...prev,
			instructions: enhancedInstructions,
		}));

		// Call the original addMeal function
		addMeal();
		
		// Reset scheduling state
		setScheduledDate(undefined);
		setScheduledTime('');
		setShowScheduling(false);
	};

	return (
		<div className="bg-white p-6 rounded-lg border border-slate-200 space-y-6">
			<h3 className="text-lg font-semibold text-slate-800">Add New Meal</h3>
			
			{/* Basic Meal Info */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-2 text-slate-700" htmlFor="meal-name">
						Meal Name
					</label>
					<Input
						id="meal-name"
						value={currentMeal.name}
						onChange={(e) =>
							setCurrentMeal((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
						placeholder="e.g., Breakfast"
						className="border-slate-200 focus:border-blue-400"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-slate-700" htmlFor="meal-time">
						Time of Day
					</label>
					<Select
						onValueChange={(value) =>
							setCurrentMeal((prev) => ({ ...prev, time: value }))
						}
						value={currentMeal.time || undefined}
					>
						<SelectTrigger id="meal-time" className="border-slate-200 focus:border-blue-400">
							<SelectValue placeholder="Select time" />
						</SelectTrigger>
						<SelectContent>
							{mealTimes.map((time) => (
								<SelectItem key={time} value={time}>
									{time}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Meal Scheduling Section */}
			<div className="space-y-4 border-t pt-4 border-slate-100">
				<div className="flex items-center justify-between">
					<Label className="text-sm font-medium text-slate-700">
						Meal Scheduling (Optional)
					</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setShowScheduling(!showScheduling)}
						className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
					>
						<Clock className="h-4 w-4" />
						{showScheduling ? 'Hide Scheduling' : 'Set Schedule'}
					</Button>
				</div>

				{showScheduling && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
						<div className="space-y-2">
							<Label className="text-sm font-medium text-slate-700">Select Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal border-slate-200",
											!scheduledDate && "text-slate-500"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{scheduledDate ? (
											format(scheduledDate, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={scheduledDate}
										onSelect={setScheduledDate}
										disabled={(date) =>
											date < new Date(new Date().setHours(0, 0, 0, 0))
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className="space-y-2">
							<Label htmlFor="scheduled-time" className="text-sm font-medium text-slate-700">
								Exact Time
							</Label>
							<Input
								id="scheduled-time"
								type="time"
								value={scheduledTime}
								onChange={(e) => setScheduledTime(e.target.value)}
								className="w-full border-slate-200 focus:border-blue-400"
							/>
						</div>

						{(scheduledDate || scheduledTime) && (
							<div className="md:col-span-2 p-3 bg-white rounded border border-blue-200">
								<div className="flex items-center gap-2 text-sm text-blue-700">
									<Clock className="h-4 w-4" />
									<span className="font-medium">Scheduled for:</span>
									{scheduledDate && (
										<span>{format(scheduledDate, "MMM dd, yyyy")}</span>
									)}
									{scheduledTime && <span>at {scheduledTime}</span>}
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => {
										setScheduledDate(undefined);
										setScheduledTime('');
									}}
									className="mt-2 text-slate-600 hover:text-slate-800"
								>
									Clear Schedule
								</Button>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Nutrition Info */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div>
					<label className="block text-sm font-medium mb-2 text-slate-700" htmlFor="meal-calories">
						Calories
					</label>
					<Input
						id="meal-calories"
						type="number"
						value={currentMeal.calories || ''}
						onChange={(e) =>
							setCurrentMeal((prev) => ({
								...prev,
								calories: Number.parseInt(e.target.value) || 0,
							}))
						}
						placeholder="Calories"
						className="border-slate-200 focus:border-blue-400"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-slate-700" htmlFor="meal-protein">
						Protein (g)
					</label>
					<Input
						id="meal-protein"
						type="number"
						value={currentMeal.protein || ''}
						onChange={(e) =>
							setCurrentMeal((prev) => ({
								...prev,
								protein: Number.parseInt(e.target.value) || 0,
							}))
						}
						placeholder="Protein in grams"
						className="border-slate-200 focus:border-blue-400"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-slate-700" htmlFor="meal-carbs">
						Carbs (g)
					</label>
					<Input
						id="meal-carbs"
						type="number"
						value={currentMeal.carbs || ''}
						onChange={(e) =>
							setCurrentMeal((prev) => ({
								...prev,
								carbs: Number.parseInt(e.target.value) || 0,
							}))
						}
						placeholder="Carbs in grams"
						className="border-slate-200 focus:border-blue-400"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-slate-700" htmlFor="meal-fats">
						Fats (g)
					</label>
					<Input
						id="meal-fats"
						type="number"
						value={currentMeal.fats || ''}
						onChange={(e) =>
							setCurrentMeal((prev) => ({
								...prev,
								fats: Number.parseInt(e.target.value) || 0,
							}))
						}
						placeholder="Fats in grams"
						className="border-slate-200 focus:border-blue-400"
					/>
				</div>
			</div>

			{/* Ingredients Section */}
			<div className="space-y-3">
				<label className="block text-sm font-medium mb-2 text-slate-700" htmlFor="meal-ingredients">
					Ingredients
				</label>
				<div className="flex gap-2">
					<Input
						id="meal-ingredients"
						value={newIngredient}
						onChange={(e) => setNewIngredient(e.target.value)}
						placeholder="Add ingredient"
						onKeyDown={handleKeyDown}
						className="border-slate-200 focus:border-blue-400"
					/>
					<Button 
						onClick={addIngredient} 
						type="button"
						variant="outline"
						className="border-blue-200 text-blue-600 hover:bg-blue-50"
					>
						Add
					</Button>
				</div>
				<div className="flex flex-wrap gap-2 mt-2">
					{currentMeal.ingredients.map((ingredient) => (
						<div
							key={`ingredient-${ingredient}`}
							className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-2 border border-blue-100"
						>
							<span className="text-slate-700">{ingredient}</span>
							<button
								onClick={() =>
									removeIngredient(currentMeal.ingredients.indexOf(ingredient))
								}
								className="text-slate-500 hover:text-red-500"
								type="button"
								aria-label={`Remove ${ingredient}`}
							>
								×
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Instructions */}
			<div>
				<label className="block text-sm font-medium mb-2 text-slate-700" htmlFor="meal-instructions">
					Instructions
				</label>
				<Textarea
					id="meal-instructions"
					value={currentMeal.instructions}
					onChange={(e) =>
						setCurrentMeal((prev) => ({
							...prev,
							instructions: e.target.value,
						}))
					}
					placeholder="Add preparation instructions"
					rows={3}
					className="border-slate-200 focus:border-blue-400"
				/>
			</div>

			<Button
				onClick={handleAddMeal}
				className="w-full bg-blue-600 hover:bg-blue-700"
				disabled={!currentMeal.name || !currentMeal.time}
			>
				Add Meal to Plan
			</Button>
		</div>
	);
}
