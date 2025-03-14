"use server";

import { SigninReqConfig } from "../../../../lib/AxiosInstance/sign-in-axios";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export type Rolestype = "owner" | "trainer" | "client"; 

export interface SigninResponseType {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Rolestype;
    gym_id?: string | null;
    gym?: {
      id: number;
      name: string;
    } | null;
  };
}

export default async function SigninSA(
  email: string,
  password: string
): Promise<SigninResponseType | null> {
  try {
    const axiosInstance = await SigninReqConfig();
    const response = await axiosInstance.get("/login", {
      params: {
        email,
        password,
      },
    });

    const responseData = response.data;

    if (!responseData || !responseData.success) {
      console.error("Login failed:", responseData?.message || "Unknown error");
      return null;
    }

    // Extract the data object from the API response wrapper
    return responseData.data as SigninResponseType;
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
}
