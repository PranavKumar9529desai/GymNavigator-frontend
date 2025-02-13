import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';

export async function OnBoadingQrData() {
  const ownerAxios = await OwnerReqConfig();
  try {
    const response = await ownerAxios.get("/onboarding/onboardingqrdata");
    const data = response.data;
    console.log('onboarding qr data is from the onboardingqrdata ', data);
    return data;
  } catch (error) {
    console.error('Error fetching gyms:', error);
    return null;
  }
}
