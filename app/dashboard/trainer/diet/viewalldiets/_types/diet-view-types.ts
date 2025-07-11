export interface DietPlanCreator {
  id: string;
  name: string;
  avatar: string | null;
}

export interface DietPlanMacros {
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietPlanViewData {
  id: number;
  name: string;
  description: string;
  creator: DietPlanCreator;
  createdDate: string;
  status: "active" | "draft";
  totalCalories: number;
  macros: DietPlanMacros;
  assignedMembers: number;
  mealCount: number;
  hasAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data?: T;
  error?: string;
}

export type GetAllDietsForViewResponse = ApiResponse<DietPlanViewData[]>;
