'use client';

import { getGymUsers } from '../_actions/get-gym-users';
import { useEffect, useState } from 'react';
import GymUsersView from './GymUsersView';
import Loading from '../loading';

export interface GymUser {
  id: number;
  name: string;
  email: string;
  isverified: boolean;
  userStatus?: string;
  trainer?: { id: number; name: string } | null;
  createdAt: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface GymTrainer {
  id: number;
  name: string;
  email: string;
  isverified: boolean;
  image?: string | null;
  shift?: string | null;
  assignedClients: number;
  createdAt: string;
}

export interface GymUsersApiResponse {
  msg: string;
  counts: {
    totalUsers: number;
    totalTrainers: number;
    totalClients: number;
  };
  users: GymUser[];
  trainers: GymTrainer[];
}

export default function GymUsersClient() {
  const [data, setData] = useState<GymUsersApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'trainer' | 'client'>('client');

  useEffect(() => {
    setLoading(true);
    getGymUsers()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!data) return <div className="p-6 text-center text-red-500">Failed to load data.</div>;

  return (
    <GymUsersView
      data={data}
      role={role}
      setRole={setRole}
    />
  );
} 