'use server';
import axios, { type AxiosResponse } from 'axios';

interface MinimalGymInfo {
  id: string;
  gym_name: string;
}

export interface userType {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  gym_id?: string;
  gym?: MinimalGymInfo;
}

interface LoginResponse {
  msg: string;
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    gym_id?: string;
    Gym?: MinimalGymInfo;
  };
  role?: string;
}

export default async function GetUserAndLogin(email: string): Promise<userType | false> {
  try {
    console.log('this is the response', process.env.NEXT_PUBLIC_BACKEND_URL);
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup/isexist`,
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const { user, role } = response.data;
    console.log('response from the backend isiexists', response.data);
    if (!user) return false;

    // Extract and format the gym data if it exists
    const gymData = user.Gym
      ? {
          id: user.Gym.id,
          gym_name: user.Gym.gym_name,
        }
      : undefined;

    console.log('user from the db from the getUserByEmail', gymData);
    const UserResponse: userType = {
      id: String(user.id), // Ensure id is always a string
      name: user.name,
      email: user.email,
      password: user.password,
      role: role,
      gym_id: user.gym_id,
      gym: gymData,
    };
    console.log('return from the getusermail', UserResponse);
    return UserResponse;
  } catch (error) {
    console.log('error getting user by email', error);
    return false;
  }
}
