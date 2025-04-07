"use server";

import { ClientReqConfig } from "@/lib/AxiosInstance/clientAxios";
import {
  type ActivityLevel,
  HealthProfileState,
} from "../_store/health-profile-store";
import type { HealthMetrics } from "../calculate-health-data/health-data-types";

// Define a type that matches what we need for the API request
export interface HealthProfileApiRequest {
  fullname: string;
  contact: string;
  gender: string;
  age: number;
  activityLevel: ActivityLevel; // Use the ActivityLevel type for consistency
  height: { value: number; unit: string };
  weight: { value: number; unit: string };
  goal: string;
  otherGoal?: string;
  dietaryPreference: string;
  otherDietaryPreference?: string;
  nonVegDays?: Array<{ day: string; selected: boolean }>;
  allergies: Array<{ id: string; name: string; selected: boolean }>;
  otherAllergy?: string;
  mealTimes: string;
  mealTimings: Array<{ name: string; time: string }>;
  medicalConditions: Array<{ id: string; name: string; selected: boolean }>;
  otherMedicalCondition?: string;
  religiousPreference: string | null;
  otherReligiousPreference?: string;
  dietaryRestrictions?: string[];
  healthMetrics: HealthMetrics; // New property: include the pre-calculated health metrics
}

export interface HealthProfileResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  details?: string;
}

export const submitHealthProfileToApi = async (
  profileData: HealthProfileApiRequest
): Promise<HealthProfileResponse> => {
  try {
    const clientAxios = await ClientReqConfig();
    console.log("Sending profileData: ", profileData);
    const response = await clientAxios.post<HealthProfileResponse>(
      "/profile/healthprofileform",
      profileData
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting health profile data:", error);
    return {
      success: false,
      error: "Failed to submit health profile data",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
