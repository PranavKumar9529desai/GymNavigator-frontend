import axios from 'axios';

interface OnBordingUser {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
}

interface OnBordingUserResponse {
  msg: string;
  users: OnBordingUser[];
}

export const fetchOnboardingUsers = async () => {
  try {
    console.log('Fetching onboarding users...');
    const response = await axios.get<OnBordingUserResponse>(
      '/api/owner/onboarding/onbordingusers',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = response.data;
    console.log('Onboarding users response:', data);

    if (!data.users || !Array.isArray(data.users)) {
      console.error('Invalid users data received:', data);
      return { users: [] };
    }

    return data;
  } catch (error) {
    console.error('Error fetching onboarding users:', error);
    throw error; // Let React Query handle the error
  }
};
