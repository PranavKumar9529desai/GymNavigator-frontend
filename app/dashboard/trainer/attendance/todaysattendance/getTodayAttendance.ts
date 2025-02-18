import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

interface AttendanceUser {
  id: number;
  name: string;
  isPresent: boolean;
  trainerid: number | null;
  shift: 'MORNING' | 'EVENING';
  attendanceTime: string | null;
}

interface TodayAttendanceResponse {
  msg: string;
  users: AttendanceUser[];
}

const TodayAttendance = async (): Promise<TodayAttendanceResponse> => {
  try {
    const trainerAxios = await TrainerReqConfig();
    const response = await trainerAxios.get<TodayAttendanceResponse>(
      '/attendance/todaysattendance',
    );
    console.log("Today's attendance data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    return {
      msg: 'Failed to fetch attendance data',
      users: [],
    };
  }
};

export { TodayAttendance, type AttendanceUser };
