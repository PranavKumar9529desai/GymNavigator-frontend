"use server";

import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";

// Define interfaces for structured data
interface DaySelection {
  day: string;
  selected: boolean;
}

export interface Selection {
  id: string;
  name: string;
  selected: boolean;
}

// Updated HealthProfile interface to reflect the complete profile structure
export interface HealthProfile {
  // basic fields
  weightValue: number;
  heightValue: number;
  gender: string;
  age: number;
  // additional fields from UserHealthprofile
  activityLevel: string;
  heightUnit: string;
  weightUnit: string;
  dietaryPreference: string;
  otherDietaryPreference?: string;
  nonVegDays?: DaySelection[] | string; // Can be parsed array or string
  allergies: Selection[] | string; // Can be parsed array or string
  otherAllergy?: string;
  mealTimes: string;
  mealTimings?: string;
  medicalConditions: Selection[] | string; // Can be parsed array or string
  otherMedicalCondition?: string;
  religiousPreference?: string;
  otherReligiousPreference?: string;
  dietaryRestrictions?: Selection[] | string; // Can be parsed array or string
  bmi?: number;
  bmr?: number;
  tdee?: number;
  createdAt?: string;
  updatedAt?: string;
  fullname?: string;
  contact?: string;
  goal?: string; // Added missing goal property
}

// Helper function to safely parse JSON strings
function safeJsonParse<T>(
  jsonString: string | null | undefined,
  fallback: T
): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    return fallback;
  }
}

export async function gethealthprofileById(userId: string) {
  const trainerAxios = await TrainerReqConfig();

  try {
    const response = await trainerAxios.get(
      `/client/healthprofile/client/${userId}`
    );
    const data = response.data;

    if (data.msg === "success" && data.healthProfile) {
      // Parse JSON string fields before returning
      const healthProfile = data.healthProfile;

      return {
        success: true,
        data: {
          ...healthProfile,
          nonVegDays: safeJsonParse<DaySelection[]>(
            healthProfile.nonVegDays,
            []
          ),
          allergies: safeJsonParse<Selection[]>(healthProfile.allergies, []),
          medicalConditions: safeJsonParse<Selection[]>(
            healthProfile.medicalConditions,
            []
          ),
          dietaryRestrictions: safeJsonParse<Selection[]>(
            healthProfile.dietaryRestrictions,
            []
          ),
        } as HealthProfile,
      };
    }

    return {
      success: false,
      error: data.msg || "Failed to fetch health profile",
    };
  } catch (error) {
    console.error("Error fetching health profile by ID:", error);
    return {
      success: false,
      error: "Failed to fetch health profile",
    };
  }
}
