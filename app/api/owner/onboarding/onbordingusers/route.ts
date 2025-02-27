import { getOnboardingUsersServer } from '@/app/dashboard/owner/onboarding/onboardedusers/GetOnBoardingUser';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getOnboardingUsersServer();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch onboarding users' },
      { status: 500 }
    );
  }
} 