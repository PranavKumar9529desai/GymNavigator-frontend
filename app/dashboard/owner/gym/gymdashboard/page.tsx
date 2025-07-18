import React from 'react';
import { getGymDashboardData } from './_action/get-gym-dashboard';
import GymDashboard from './_components/GymDashboard';

export default async function GymDashboardPage() {
  let data;
  try {
    data = await getGymDashboardData();
  } catch (error) {
    return <div className="p-6 text-center text-red-600">Failed to load dashboard data.</div>;
  }
  return <GymDashboard data={data} />;
}
