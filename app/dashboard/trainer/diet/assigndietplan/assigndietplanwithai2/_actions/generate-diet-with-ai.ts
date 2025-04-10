"use server";

import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";
import { generateDietPrompt } from "@/lib/AI/prompts/diet-prompts";
import { validateDietPlan } from "@/lib/AI/types/diet-types";
import { HealthProfile, gethealthprofileById } from "./get-healthprofile-by-id";

export interface DietPlan {
	id: number;
	name: string;
	description?: string;
	targetCalories: number;
	proteinRatio: number;
	carbsRatio: number;
	fatsRatio: number;
	meals: {
		id: number;
		name: string;
		timeOfDay: string;
		calories: number;
		protein: number;
		carbs: number;
		fats: number;
		instructions: string;
	}[];
}

interface DietPlansByDay {
  [day: string]: DietPlan;
}

export async function generateDietWithAI(
  userId: string,
  days?: string[]
): Promise<{ success: boolean; data?: DietPlansByDay; error?: string }> {
  try {
    // First, get the health profile
    const healthProfileResult = await gethealthprofileById(userId);
    
    if (!healthProfileResult.success || !healthProfileResult.data) {
      return {
        success: false,
        error: healthProfileResult.error || "Failed to fetch health profile"
      };
    }
    
    const healthProfile = healthProfileResult.data;
    
    // Use the trainer API config
    const trainerAxios = await TrainerReqConfig();
    
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
    
    // Get location information (could be enhanced with user's actual location)
    const location = "Your location";
    const country = "Your country";
    
    // Generate diet plans for each day
    const dietPlans: DietPlansByDay = {};
    
    for (const day of daysToGenerate) {
      // Generate prompt with the complete health profile
      const prompt = generateDietPrompt({
        healthProfile,
        location,
        country,
        specialInstructions: `This is a diet plan for ${day}. Consider typical ${day} activities and meal timing preferences.`
      });
      
      // Call the AI API to generate the diet plan
      const response = await trainerAxios.post("/ai/generate", {
        prompt,
        max_tokens: 2000,
        temperature: 0.7,
      });
      
      // Parse and validate the AI response
      const aiResponse = response.data?.response || response.data;
      let dietPlan;
      
      try {
        // Try to parse the response if it's a string
        if (typeof aiResponse === "string") {
          // Extract JSON from the response if needed
          const jsonMatch = aiResponse.match(/{[\s\S]*}/);
          if (jsonMatch) {
            dietPlan = JSON.parse(jsonMatch[0]);
          } else {
            dietPlan = JSON.parse(aiResponse);
          }
        } else {
          dietPlan = aiResponse;
        }
        
        // Validate the diet plan structure
        const validationResult = validateDietPlan(dietPlan);
        
        if (validationResult.success) {
          // Add day identification to the diet plan
          dietPlans[day] = {
            ...validationResult.data,
            id: Date.now() + Object.keys(dietPlans).length, // Generate a unique ID
            name: `${day} Diet Plan: ${validationResult.data.name}`,
          };
        } else {
          // If validation fails, create a fallback plan
          dietPlans[day] = createFallbackDietPlan(day);
          console.error(`Diet plan validation failed for ${day}:`, validationResult.error);
        }
      } catch (error) {
        console.error(`Error processing AI response for ${day}:`, error);
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

