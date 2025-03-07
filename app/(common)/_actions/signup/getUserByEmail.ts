"use server";
import axios, { type AxiosResponse } from "axios";

interface MinimalGymInfo {
  id: number;
  gym_name: string;
}

export interface userType {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  gym?: MinimalGymInfo;
}

interface LoginResponse {
  msg: string;
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    gym?: MinimalGymInfo;
  };
  role?: string;
}

export default async function getUserByEmail(
  email: string
): Promise<userType | false> {
  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup/isexist`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { user, role } = response.data;

    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: role,
          gym: user.gym,
        }
      : false;
  } catch (error) {
    console.log("error getting user by email", error);
    return false;
  }
}
