'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
interface AssignTrainerResponse {
  msg: string;
  trainer?: {
    name: string;
    id: number;
  };
}
export async function AssignTrainerToUsers(
  userid: string,
  trainerid: string
): Promise<AssignTrainerResponse> {
  try {
    const ownerAxios = await OwnerReqConfig();
    const response = await ownerAxios.post("/trainer/assigntrainer", {
      userid: Number.parseInt(userid),
      trainerid: Number.parseInt(trainerid),
    });
    console.log('response is from the assign trainer', response.data);
    return response.data;
  } catch (error) {
    console.error("Error assigning trainer:", error);
    throw new Error("Failed to assign trainer");
  }
}
  