"use server";

import { ClientReqConfig } from "@/lib/AxiosInstance/clientAxios";

interface AttendanceData {
  isMarked: boolean;
  attendance?: {
    id: number;
    userId: number;
    validPeriodId: number;
    date: string;
    scanTime: string;
    attended: boolean;
  };
}

export async function checkUserAttendance(): Promise<{
  success: boolean;
  data?: AttendanceData;
  error?: string;
}> {
  try {
    const clientAxios = await ClientReqConfig();
    const response = await clientAxios.get("/check-attendance");

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error checking attendance:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to check attendance",
    };
  }
}
