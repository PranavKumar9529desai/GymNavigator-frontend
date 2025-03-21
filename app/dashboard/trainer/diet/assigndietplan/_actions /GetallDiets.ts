import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";

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
    instructions?: string;
  }[];
}

export const getAllDietPlans = async () => {
  const trainerAxios = await TrainerReqConfig();
  try {
    const response = await trainerAxios.get("/diet/alldietplans");
    console.log("response.data.dietPlans", response.data.dietPlans);
    const data = response.data;

    if (data.msg === "success") {
      return data.dietPlans as DietPlan[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching diet plans:", error);
    return [];
  }
};
