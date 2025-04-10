// src/app/diet-page/components/DietPlanner.tsx
"use client"; // Needed for useState and event handling

import React, { useState, useTransition } from 'react';
import { DietControls } from '../DietPlanner/DietControls'; // Adjust path if needed
import { DietDisplay } from './DietDisplay/DietDisplay';   // Adjust path if needed
import { generateDietWithAI2 } from '../../_actions/generate-diet-with-ai2';
import { type DietPlan } from '../../_actions/generate-ai-diet';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";
import { useSearchParams } from 'next/navigation';

// Define Meal interface to work with the diet plan data
interface Meal {
    id: string | number;
    name: string;
    time: string;
    description: string;
    instructions: string[];
    protein: string;
    fat: string;
    carbs: string;
}

// Helper to convert from API diet plan meal to display meal
const convertToDisplayMeal = (meal: DietPlan['meals'][0]): Meal => {
    return {
        id: meal.id,
        name: meal.name,
        time: meal.timeOfDay,
        description: `${meal.calories} calories`,
        instructions: meal.instructions.split('. ').filter(Boolean),
        protein: `${Math.round(meal.protein)}g (${Math.round(meal.protein * 4 * 100 / meal.calories)}%)`,
        fat: `${Math.round(meal.fats)}g (${Math.round(meal.fats * 9 * 100 / meal.calories)}%)`,
        carbs: `${Math.round(meal.carbs)}g (${Math.round(meal.carbs * 4 * 100 / meal.calories)}%)`,
    };
};

export function DietPlanner() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId') || 'defaultUserId';
    
    const [isPending, startTransition] = useTransition();
    const [dietPlans, setDietPlans] = useState<Record<string, Meal[]> | null>(null);
    const [activeDay, setActiveDay] = useState<string>("Monday");
    
    const handleDayChange = (day: string) => {
        setActiveDay(day);
    };
    
    const handleGenerateDiet = async () => {
        toast.info("Generating diet plans for the week...");
        
        startTransition(async () => {
            try {
                // Generate diet plans for all days of the week directly using server action
                const result = await generateDietWithAI2(
                    userId,
                    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                );
                
                if (!result.success || !result.data) {
                    throw new Error(result.error || "Failed to generate diet plans");
                }
                
                // Convert the diet plans to the format required by DietDisplay
                const formattedDietPlans: Record<string, Meal[]> = {};
                
                Object.entries(result.data).forEach(([day, plan]) => {
                    formattedDietPlans[day] = plan.meals.map(convertToDisplayMeal);
                });
                
                setDietPlans(formattedDietPlans);
                toast.success("Diet plans generated successfully!");
            } catch (error) {
                console.error("Error generating diet plans:", error);
                toast.error("Failed to generate diet plans. Please try again.");
            }
        });
    };
    
    return (
        <div className="w-full space-y-6">
            <DietControls 
                onGenerate={handleGenerateDiet} 
                activeDay={activeDay}
                onDayChange={handleDayChange}
            />
            
            {isPending && (
                <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="ml-2 text-blue-600">Generating personalized diet plans...</p>
                </div>
            )}
            
            {!isPending && dietPlans && dietPlans[activeDay] && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2 text-blue-700">{activeDay} Diet Plan</h2>
                    <DietDisplay dietPlan={dietPlans[activeDay]} />
                </div>
            )}
            
            {!isPending && dietPlans && !dietPlans[activeDay] && (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No diet plan available for {activeDay}.</p>
                    <Button onClick={handleGenerateDiet} variant="outline" className="mt-4">
                        Generate diet plan
                    </Button>
                </div>
            )}
            
            {!isPending && !dietPlans && (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Click "Generate Diet Plan" to create a personalized plan based on the user's profile.</p>
                </div>
            )}
        </div>
    );
}