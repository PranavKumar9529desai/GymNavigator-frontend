"use server";
import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";
import type { AxiosResponse } from "axios";

interface responseType {
	gymname: string;
	gymid: number;
}

export const GetAttendanceQrData = async () => {
	const trainerAxios = await TrainerReqConfig();
	try {
		const response: AxiosResponse<responseType> = await trainerAxios.get(
			"/attendance/attendanceqrdata",
		);
		console.log("response from the attendance", response.data);
		return {
			gymname: response.data.gymname,
			gymid: response.data.gymid,
		};
	} catch (error) {
		console.log("Error:", error);
		return null;
	}
};
