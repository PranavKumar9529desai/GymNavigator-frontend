import { ReactNode } from 'react';

export type Role = 'owner' | 'client' | 'trainer';

export interface MenuItem {
  label: string;
  path: string;
  icon?: ReactNode;
}

export const settingsMenuItems: Record<Role, MenuItem[]> = {
  owner: [
    { label: 'Gym Settings', path: '/dashboard/settings/gym' },
    { label: 'Trainer Settings', path: '/dashboard/settings/trainer' },
    { label: 'Payment Settings', path: '/dashboard/settings/payment' }
  ],
  client: [
    { label: 'Health Profile', path: '/dashboard/settings/healthprofile' },
    { label: 'Payment Settings', path: '/dashboard/settings/payment' }
  ],
  trainer: [
    { label: 'Trainer Profile', path: '/dashboard/settings/trainer' },
    { label: 'Payment Settings', path: '/dashboard/settings/payment' }
  ]
};
