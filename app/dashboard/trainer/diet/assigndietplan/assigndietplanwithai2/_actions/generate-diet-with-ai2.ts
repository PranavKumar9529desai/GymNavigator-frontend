'use server';

import { generateAIDiet, type DietPlan } from './generate-ai-diet';

interface DietPlansByDay {
  [day: string]: DietPlan;
}

interface LocationInfo {
  country: string;
  state: string;
}

/**
 * Generates diet plans for multiple days of the week
 * Uses the AI-powered diet generator
 */
export async function generateDietWithAI2(
  userId: string,
  days?: string[],
  location?: LocationInfo
): Promise<{ success: boolean; data?: DietPlansByDay; error?: string }> {
  try {
    // If no specific days provided, generate for all days of the week
    const daysToGenerate = days || [
      "Monday", 
      "Tuesday", 
      "Wednesday", 
      "Thursday", 
      "Friday", 
      "Saturday", 
      "Sunday"
    ];
    
    // Generate diet plans for each day
    const dietPlans: DietPlansByDay = {};
    
    for (const day of daysToGenerate) {
      try {
        // Generate a diet plan for this day
        const dietPlan = await generateAIDiet(
          userId,
          undefined, // Let AI calculate target calories based on profile
          `This is a diet plan for ${day}. Consider typical ${day} activities and meal timing preferences.`,
          location
        );
        
        // Add day identification to the diet plan
        dietPlans[day] = {
          ...dietPlan,
          id: Date.now() + Object.keys(dietPlans).length, // Generate a unique ID
          name: `${day} Diet Plan: ${dietPlan.name}`,
        };
      } catch (error) {
        console.error(`Error generating diet plan for ${day}:`, error);
        dietPlans[day] = createFallbackDietPlan(day);
      }
    }
    
    return {
      success: true,
      data: dietPlans
    };
  } catch (error) {
    console.error("Error generating diet plans:", error);
    return {
      success: false,
      error: "Failed to generate diet plans"
    };
  }
}

/**
 * Creates a fallback diet plan if AI generation fails
 */
function createFallbackDietPlan(day: string): DietPlan {
  return {
    id: Date.now(),
    name: `${day} Diet Plan`,
    description: "A balanced diet plan for your goals.",
    targetCalories: 2000,
    proteinRatio: 0.3,
    carbsRatio: 0.4,
    fatsRatio: 0.3,
    meals: [
      {
        id: 1,
        name: "Breakfast",
        timeOfDay: "8:00 AM",
        calories: 500,
        protein: 30,
        carbs: 50,
        fats: 15,
        instructions: "Prepare a balanced breakfast with protein and complex carbs."
      },
      {
        id: 2,
        name: "Lunch",
        timeOfDay: "12:30 PM",
        calories: 700,
        protein: 40,
        carbs: 70,
        fats: 20,
        instructions: "Enjoy a nutritious lunch with lean protein and vegetables."
      },
      {
        id: 3,
        name: "Dinner",
        timeOfDay: "7:00 PM",
        calories: 600,
        protein: 35,
        carbs: 60,
        fats: 18,
        instructions: "Have a light dinner with protein and vegetables."
      },
      {
        id: 4,
        name: "Snack",
        timeOfDay: "4:00 PM",
        calories: 200,
        protein: 10,
        carbs: 20,
        fats: 5,
        instructions: "Enjoy a healthy snack to maintain energy levels."
      }
    ]
  };
} 