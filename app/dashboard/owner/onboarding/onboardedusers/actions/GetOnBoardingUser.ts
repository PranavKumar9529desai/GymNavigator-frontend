"use server";
import { OwnerReqConfig } from "@/lib/AxiosInstance/ownerAxios";
import type { AxiosResponse } from "axios";

export interface OnBordingUser {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
}

interface OnBordingUserResponse {
  msg: string;
  users: OnBordingUser[];
}

// This is a server action, use it only in Server Components
export const getOnboardingUsersServer = async () => {
  const ownerAxios = await OwnerReqConfig();
  try {
    console.log("Fetching onboarding users (server)...");
    const response: AxiosResponse<OnBordingUserResponse> = await ownerAxios.get(
      "/onboarding/onbordingusers"
    );

    const data = response.data;
    console.log("Onboarding users response (server):", data);

    if (!data.users || !Array.isArray(data.users)) {
      console.error("Invalid users data received:", data);
      return { users: [] };
    }

    return data;
  } catch (error) {
    console.error("Error fetching onboarding users:", error);
    return { users: [] };
  }
};
