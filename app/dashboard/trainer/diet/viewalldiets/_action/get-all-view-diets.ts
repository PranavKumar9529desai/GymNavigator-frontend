import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

export interface ViewDietPlan {
  id: number;
  name: string;
  description?: string | null;
  creator: {
    id: number;
    name: string;
    avatar: string | null;
  };
  createdDate: string; // YYYY-MM-DD format
  status: string;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  assignedMembers: number;
  hasAccess: boolean;
  mealsCount: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export const getAllViewDietPlans = async (): Promise<ViewDietPlan[]> => {
  const trainerAxios = await TrainerReqConfig();
  try {
    const response = await trainerAxios.get('/diet/viewalldietplans');
    console.log('response.data from viewalldietplans', response.data);
    const data = response.data;
    
    if (data.success && data.data) {
      return data.data as ViewDietPlan[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching view diet plans:', error);
    return [];
  }
};
