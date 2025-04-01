'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface AttachRoleToGymParams {
  gymname: string;
  gymid: string;
  hash: string;
}

interface AttachRoleToGymResponse {
  success: boolean;
  message: string;
}

/**
 * Server action to attach a user to a gym based on QR code data
 */
export async function attachRoleToGym({
  gymname,
  gymid,
  hash,
}: AttachRoleToGymParams): Promise<AttachRoleToGymResponse> {
  try {
    // Initialize client axios
    const clientAxios = await ClientReqConfig();
    
    // Make request to the attach to gym endpoint
    const response = await clientAxios.post('/gym/attachtogym', {
      gymname,
      gymid,
      hash
    });
    
    const data = response.data;
    
    if (!data.success) {
      console.error("Failed to attach to gym:", data.error);
      return {
        success: false,
        message: data.error || "Failed to attach to gym"
      };
    }
    
    return {
      success: true,
      message: data.message || "Successfully attached to gym"
    };
  } catch (error) {
    console.error("Error attaching to gym:", error);
    return {
      success: false,
      message: "Failed to connect to server"
    };
  }
} 