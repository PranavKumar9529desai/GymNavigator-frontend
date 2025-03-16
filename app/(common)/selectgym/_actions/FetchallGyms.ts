import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";
export default async function FetchallGyms() {
  const trainerAxios = await TrainerReqConfig();
  try {
    const response = await trainerAxios.get("availablegyms");
    const data = response.data.gyms as gym[];
    console.log("gyms data is from the fetchallgyms ", data);
    return data;
  } catch (error) {
    console.error("Error fetching gyms:", error);
    return [];
  }
}
