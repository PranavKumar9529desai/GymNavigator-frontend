import axios from 'axios';

interface AttendanceResponse {
  msg: string;
  users: {
    id: number;
    name: string;
    isPresent: boolean;
    trainerid: number | null;
    attendanceTime: string | null;
  }[];
}

export const getTodaysAttendance = async (): Promise<AttendanceResponse> => {
  const response = await axios.get<AttendanceResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/owner/protected/todaysattendance`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }
  );
  return response.data;
};
