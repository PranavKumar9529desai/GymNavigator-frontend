import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';

interface UpdateActivePeriodData {
  userId: number;
  startDate: string | null;
  endDate: string | null;
}

interface UpdateActivePeriodResponse {
  msg: string;
  user: {
    id: number;
    name: string;
    startDate: string | null;
    endDate: string | null;
  };
}

export const updateActivePeriod = async (data: UpdateActivePeriodData) => {
  const ownerAxios = await OwnerReqConfig();
  try {
    const response: AxiosResponse<UpdateActivePeriodResponse> = await ownerAxios.patch(
      `/onboarding/users/${data.userId}/activeperiod`,
      {
        startDate: data.startDate,
        endDate: data.endDate,
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error updating active period:', error);
    throw error;
  }
};
