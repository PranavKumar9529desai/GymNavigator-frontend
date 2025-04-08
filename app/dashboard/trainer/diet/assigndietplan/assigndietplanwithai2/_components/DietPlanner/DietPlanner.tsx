// src/app/diet-page/components/DietPlanner.tsx
"use client"; // Needed for useState and event handling

import React, { useState } from 'react';
import { DietControls } from '../DietPlanner/DietControls'; // Adjust path if needed
import type { Meal } from '../DietPlanner/DietDisplay/MealCard'; // Adjust path if needed
import { DietDisplay } from './DietDisplay/DietDisplay';   // Adjust path if needed

// Example dummy data function (replace with your actual logic/API call)
const generateDummyDiet = (): Meal[] => {
    return [
        {
            id: 1,
            name: "Breakfast",
            time: "7am",
            description: "Eggs and bread",
            instructions: ["take some eggs", "boil them", "eat"],
            protein: "20% (100cal)",
            fat: "30% (120cal)",
            carbs: "50% (140cal)",
        },
        {
            id: 2,
            name: "Lunch",
            time: "12pm", // Corrected to 12pm
            description: "Mixed vegetables", // Capitalized "Mixed"
            instructions: ["take some veggies", "boil them", "eat"],
            protein: "20% (100cal)",
            fat: "30% (120cal)",
            carbs: "50% (140cal)",
        },
        // Add more meals as needed
    ];
};

export function DietPlanner() {
    const [dietPlan, setDietPlan] = useState<Meal[] | null>(null);

    const handleGenerateDiet = () => {
        console.log("Generating diet...");
        // In a real app, you would fetch data or run calculations here
        const generatedPlan = generateDummyDiet();
        setDietPlan(generatedPlan);
    };

    return (
        <div className="w-full space-y-6"> {/* Added extra spacing for cleaner UI */}
            <DietControls onGenerate={handleGenerateDiet} />
            {dietPlan && <DietDisplay dietPlan={dietPlan} />}
        </div>
    );
}