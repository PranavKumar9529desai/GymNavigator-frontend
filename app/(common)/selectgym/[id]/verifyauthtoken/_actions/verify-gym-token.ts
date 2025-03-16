'use server';

import type { gym } from '@/app/(common)/selectgym/SelectGym';
import { VerifyAuthToken } from '@/app/(common)/selectgym/VerifyAuthToken';

interface VerificationResult {
  success: boolean;
  message: string;
}

export async function verifyGymToken(gym: gym, authToken: string): Promise<VerificationResult> {
  // Convert gym object to format expected by VerifyAuthToken
  const gymAtom = {
    name: gym.name,
    id: gym.id,
    img: gym.img,
  };
  
  try {
    const result = await VerifyAuthToken(gymAtom, authToken);
    
    return {
      success: result.success,
      message: result.msg
    };
  } catch (error) {
    console.error("Error in verifyGymToken:", error);
    return {
      success: false,
      message: "Failed to verify authentication token"
    };
  }
}
