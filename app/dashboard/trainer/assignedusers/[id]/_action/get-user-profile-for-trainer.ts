'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

// Types for the user profile data structure
interface UserData {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  membershipType: string;
  avatar: string;
  id: string;
}

interface HealthData {
  weight: number;
  height: number;
  bmi: number;
  bodyFat: number;
  muscleMass: number;
  goals: {
    weightGoal: number;
    bodyFatGoal: number;
  };
}

interface TrainerData {
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  avatar: string;
  phone: string;
  email: string;
  nextSession?: string;
}

interface AttendanceStats {
  monthlyVisits: number;
  totalWorkoutTime: number;
  totalCalories: number;
  streak: number;
}

interface OverviewData {
  attendanceData: Array<{ month: string; visits: number }>;
  workoutTypes: Array<{ name: string; value: number; color: string }>;
  stats: AttendanceStats;
}

interface HealthTabData {
  healthData: HealthData;
  weightProgress: Array<{ date: string; weight: number }>;
}

interface AttendanceTabData {
  weeklyAttendance: Array<{ day: string; attended: number }>;
  recentVisits: Array<{
    date: string;
    time: string;
    duration: string;
    type: string;
  }>;
}

// Main response interface
export interface UserProfileResponse {
  overview: OverviewData | null;
  health: HealthTabData | null;
  trainer: TrainerData | null;
  attendance: AttendanceTabData | null;
  userData: UserData | null;
  error?: string;
}

export async function getUserProfile(userId: string): Promise<UserProfileResponse> {
  try {
    const trainerAxios = await TrainerReqConfig();

    // Make the API call to fetch user profile data
    const response = await trainerAxios.get(`/client/userprofile/${userId}`);
    
    if (!response.data.success || response.status !== 200) {
      return {
        overview: null,
        health: null,
        trainer: null,
        attendance: null,
        userData: null,
        error: response.data?.msg || 'Failed to fetch user profile'
      };
    }

    const { data } = response.data;

    // Handle the response and structure it according to our tab requirements
    const userProfileData: UserProfileResponse = {
      // User basic information for header - always provide fallback
      userData: data.user ? {
        id: data.user.id || userId,
        name: data.user.name || 'Unknown User',
        email: data.user.email || 'No email provided',
        phone: data.user.phone || 'No phone provided',
        memberSince: data.user.memberSince || 'N/A',
        membershipType: data.user.membershipType || 'Basic',
        avatar: data.user.avatar || '/placeholder.svg'
      } : {
        id: userId,
        name: 'Unknown User',
        email: 'No email provided',
        phone: 'No phone provided',
        memberSince: 'N/A',
        membershipType: 'Basic',
        avatar: '/placeholder.svg'
      },

      // Overview tab data - always provide structure even if empty
      overview: data.overview ? {
        attendanceData: data.overview.attendanceData || generateMockAttendanceData(),
        workoutTypes: data.overview.workoutTypes || generateMockWorkoutTypes(),
        stats: {
          monthlyVisits: data.overview.stats?.monthlyVisits || 0,
          totalWorkoutTime: data.overview.stats?.totalWorkoutTime || 0,
          totalCalories: data.overview.stats?.totalCalories || 0,
          streak: data.overview.stats?.streak || 0
        }
      } : {
        attendanceData: generateMockAttendanceData(),
        workoutTypes: generateMockWorkoutTypes(),
        stats: {
          monthlyVisits: 0,
          totalWorkoutTime: 0,
          totalCalories: 0,
          streak: 0
        }
      },

      // Health tab data - null if no health profile (UI will show "No health profile")
      health: data.health ? {
        healthData: {
          weight: data.health.weight || 0,
          height: data.health.height || 0,
          bmi: data.health.bmi || 0,
          bodyFat: data.health.bodyFat || 0,
          muscleMass: data.health.muscleMass || 0,
          goals: {
            weightGoal: data.health.goals?.weightGoal || 0,
            bodyFatGoal: data.health.goals?.bodyFatGoal || 0
          }
        },
        weightProgress: data.health.weightProgress || generateMockWeightProgress()
      } : null,

      // Trainer tab data - null if no trainer assigned (UI will show "No trainer assigned")
      trainer: data.trainer ? {
        name: data.trainer.name || 'Unknown Trainer',
        specialization: data.trainer.specialization || 'General Fitness',
        experience: data.trainer.experience || '0 years',
        rating: data.trainer.rating || 0,
        avatar: data.trainer.avatar || '/placeholder.svg',
        phone: data.trainer.phone || 'No contact provided',
        email: data.trainer.email || 'No email provided',
        nextSession: data.trainer.nextSession || 'No upcoming sessions'
      } : null,

      // Attendance tab data - always provide structure even if empty
      attendance: data.attendance ? {
        weeklyAttendance: data.attendance.weeklyAttendance || generateMockWeeklyAttendance(),
        recentVisits: data.attendance.recentVisits || []
      } : {
        weeklyAttendance: generateMockWeeklyAttendance(),
        recentVisits: []
      }
    };

    return userProfileData;

  } catch (error: unknown) {
    console.error('Error fetching user profile:', error);
    
    // Return fallback data structure with error
    return {
      overview: {
        attendanceData: generateMockAttendanceData(),
        workoutTypes: generateMockWorkoutTypes(),
        stats: {
          monthlyVisits: 0,
          totalWorkoutTime: 0,
          totalCalories: 0,
          streak: 0
        }
      },
      health: null,
      trainer: null,
      attendance: {
        weeklyAttendance: generateMockWeeklyAttendance(),
        recentVisits: []
      },
      userData: {
        id: userId,
        name: 'Unknown User',
        email: 'No email provided',
        phone: 'No phone provided',
        memberSince: 'N/A',
        membershipType: 'Basic',
        avatar: '/placeholder.svg'
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Helper functions to generate mock data when backend doesn't provide it
function generateMockAttendanceData() {
  return [
    { month: 'Jan', visits: 0 },
    { month: 'Feb', visits: 0 },
    { month: 'Mar', visits: 0 },
    { month: 'Apr', visits: 0 },
    { month: 'May', visits: 0 },
    { month: 'Jun', visits: 0 }
  ];
}

function generateMockWorkoutTypes() {
  return [
    { name: 'Cardio', value: 0, color: '#8884d8' },
    { name: 'Strength', value: 0, color: '#82ca9d' },
    { name: 'Flexibility', value: 0, color: '#ffc658' },
    { name: 'Sports', value: 0, color: '#ff7300' }
  ];
}

function generateMockWeightProgress() {
  return [
    { date: '2024-01', weight: 0 },
    { date: '2024-02', weight: 0 },
    { date: '2024-03', weight: 0 },
    { date: '2024-04', weight: 0 },
    { date: '2024-05', weight: 0 },
    { date: '2024-06', weight: 0 }
  ];
}

function generateMockWeeklyAttendance() {
  return [
    { day: 'Mon', attended: 0 },
    { day: 'Tue', attended: 0 },
    { day: 'Wed', attended: 0 },
    { day: 'Thu', attended: 0 },
    { day: 'Fri', attended: 0 },
    { day: 'Sat', attended: 0 },
    { day: 'Sun', attended: 0 }
  ];
}
