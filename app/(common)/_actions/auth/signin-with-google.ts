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
    console.log("siginin with the gooogle is called ", email);
    const axiosInstance: AxiosInstance = await SigninReqConfig();
    const response = await axiosInstance.get(
      `/google?email=${encodeURIComponent(email)}`
    );
    console.log(
      "response is from the signin with google server action",
      response
    );
    const data = await response.data.data;
    console.log("response.data is", data);
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
