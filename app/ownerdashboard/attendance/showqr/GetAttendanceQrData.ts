"use server";
import type { AxiosResponse } from "axios";
import { OwnerReqConfig } from "../../../../lib/AxiosInstance/ownerAxios";

interface responseType {
	gymname: string;
	gymid: number;
}

export const GetAttendanceQrData = async () => {
	const ownerAxios = await OwnerReqConfig();
	try {
		const response: AxiosResponse<responseType> = await ownerAxios.get(
			"/attendance/attendanceqrdata",
		);
		console.log("response from the attendance", response.data);
		return {
			gymname: response.data.gymname,
			gymid: response.data.gymid,
		};
	} catch (error) {
		console.log("Error:", error);
	}
};
