'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';

interface OnBordingUser {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
}

interface OnBordingUserResponse {
  msg: string;
  users: OnBordingUser[];
}

export const GetOnBoardingUser = async () => {
  const ownerAxios = await OwnerReqConfig();
  try {
    const response: AxiosResponse<OnBordingUserResponse> = await ownerAxios.get(
      '/onboarding/onbordingusers'
    );

    const data = response.data;
    console.log('Onboarding users fetched successfully:', typeof data.users[0].startDate);
    return data;
  } catch (error) {
    console.error('Error fetching gyms:', error);
    return null;
  }
};
