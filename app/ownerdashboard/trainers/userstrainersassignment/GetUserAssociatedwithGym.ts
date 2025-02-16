'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';

export const getUsersAssociatedWithGym = async () => {
  const ownerAxios = await OwnerReqConfig();
  try {
    const response = await ownerAxios.get('/trainer/usersassociatiowithgym');
    const data: UserType[] = response.data.users;
    console.log('users  data is from the getUserassociatedWithGym ', data);
    return data;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return [];
  }
};
