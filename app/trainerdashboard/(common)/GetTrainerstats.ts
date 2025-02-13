"use server";
import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";
import { AxiosError, type AxiosResponse } from "axios";
import type {
  TrainerDashboardResponse,
  TrainerDashboardResult,
} from "./components/types";

export default async function GetTrainerStats(): Promise<TrainerDashboardResult> {
  try {
    const trainerAxios = await TrainerReqConfig();
    const response: AxiosResponse<TrainerDashboardResponse> =
      await trainerAxios.get("/dashboard/getdashboardstats");

    // Validate response data
    if (!response.data || !response.data.data) {
      return {
        error: "Invalid response format",
      };
    }

    const { stats, recentActivities } = response.data.data;

    // Validate required fields
    if (
      !stats ||
      typeof stats.totalMembers !== "number" ||
      typeof stats.activeWorkoutPlans !== "number" ||
      typeof stats.todayAttendance !== "number"
    ) {
      return {
        error: "Missing or invalid stats data",
      };
    }

    // Return validated data with defaults for missing values
    return {
      stats: {
        totalMembers: stats.totalMembers,
        activeWorkoutPlans: stats.activeWorkoutPlans,
        todayAttendance: stats.todayAttendance,
        gymName: stats.gymName || "Not Assigned",
      },
      recentActivities: Array.isArray(recentActivities)
        ? recentActivities.map((activity) => ({
            name: activity.name || "Unknown Member",
            Validperiod: activity.Validperiod || null,
          }))
        : [],
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 404) {
        return {
          error: "NO_TRAINER_FOUND",
          msg: "Trainer profile not found or not properly configured.",
        };
      }

      return {
        error:
          err.response?.data?.msg ||
          "An error occurred while fetching trainer dashboard data",
      };
    }

    return {
      error: "An unexpected error occurred",
    };
  }
}
