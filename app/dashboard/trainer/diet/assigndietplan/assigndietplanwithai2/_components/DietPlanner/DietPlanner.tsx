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
    
    const handleGenerateDiet = async (location: { country: string; state: string }) => {
        toast.info("Generating diet plans for the week...");
        
        startTransition(async () => {
            try {
                // Generate diet plans for all days of the week directly using server action
                const result = await generateDietWithAI2(
                    userId,
                    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    location
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
                <div className="flex flex-col justify-center items-center p-8 bg-white rounded-lg shadow-sm border border-blue-100">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-blue-700 font-medium">Generating personalized diet plans...</p>
                    <p className="text-sm text-blue-500 mt-2">This may take a moment as we create the perfect meal plan</p>
                </div>
            )}
            
            {!isPending && dietPlans && dietPlans[activeDay] && (
                <div className="mt-4 bg-white rounded-lg shadow-sm border border-blue-50 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100">
                        <h2 className="text-xl font-semibold text-blue-800">{activeDay} Meal Plan</h2>
                    </div>
                    <div className="p-4">
                        <DietDisplay dietPlan={dietPlans[activeDay]} />
                    </div>
                </div>
            )}
            
            {!isPending && dietPlans && !dietPlans[activeDay] && (
                <div className="bg-white rounded-lg shadow-sm border border-blue-50 p-6 text-center">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-gray-600 mb-4">No diet plan available for {activeDay}.</p>
                    <Button 
                        onClick={() => handleGenerateDiet({ country: "", state: "" })} 
                        variant="outline" 
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                        Generate diet plan
                    </Button>
                </div>
            )}
            
            {!isPending && !dietPlans && (
                <div className="bg-white rounded-lg shadow-sm border border-blue-50 p-6 text-center">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 mb-2">Ready to create a personalized nutrition plan?</p>
                    <p className="text-sm text-gray-500 mb-4">Click "Generate Diet Plan" to create a customized plan based on the user's profile.</p>
                </div>
            )}
        </div>
    );
}