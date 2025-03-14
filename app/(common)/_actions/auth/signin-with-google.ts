"use server";
import type { AxiosInstance, AxiosResponse } from "axios";
import { SigninReqConfig } from "../../../../lib/AxiosInstance/sign-in-axios";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data: T;
  error?: string;
}

export interface SigninGoogleResponseType {
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

export default async function SigninGoogleSA(
  email: string
): Promise<SigninGoogleResponseType | null> {
  try {
    const axiosInstance: AxiosInstance = await SigninReqConfig();
    const response: AxiosResponse<SigninGoogleResponseType> =
      await axiosInstance.get("/google", {
        params: {
          email: encodeURIComponent(email),
        },
      });

    const data = response.data;

    if (!data) {
      throw new Error("No data received");
    }

    console.log("data is from the signin with google ", data);

    return data as SigninGoogleResponseType;
  } catch (error) {
    console.error("Error signing up:", error);
    return null;
  }
}
