import { Building2, CalendarCheck, ClipboardList, UserCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SubItem {
  name: string;
  link: string;
  label: string;
}

export interface MenuItem {
  name: string;
  icon: LucideIcon;
  label: string;
  subItems?: SubItem[];
  link?: string;
}

export const menuItems: MenuItem[] = [
  {
    name: 'Gym',
    icon: Building2,
    label: 'gymDetails',
    subItems: [
      {
        name: 'View Details',
        link: '/ownerdashboard/gymdetails/viewgymdetails',
        label: 'viewGymDetails',
      },
    ],
  },
  {
    name: 'Trainers',
    icon: UserCheck,
    label: 'trainers',
    subItems: [
      {
        name: 'View Trainers',
        link: '/ownerdashboard/trainers/viewtrainers',
        label: 'viewTrainers',
      },
      {
        name: 'Assign Trainers',
        link: '/ownerdashboard/trainers/userstrainersassignment',
        label: 'userstrainersassignment',
      },
    ],
  },
  {
    name: 'On-boarding',
    label: 'Onboarding',
    icon: ClipboardList,
    link: '/ownerdashboard/onboarding/onboarding',
    subItems: [
      {
        name: 'Onboarding Users',
        label: 'onboarded users',
        link: '/ownerdashboard/onboarding/onboardedusers',
      },
      {
        name: 'Onboarding QR',
        label: 'onboarding QR',
        link: '/ownerdashboard/onboarding/onboardingqr',
      },
    ],
  },
  {
    name: 'Attendance',
    icon: CalendarCheck,
    label: 'attendance',
    subItems: [
      {
        name: "Today's Attendance",
        link: '/ownerdashboard/attendance/todaysattendance',
        label: 'todaysAttendance',
      },
      {
        name: 'Show QR',
        link: '/ownerdashboard/attendance/showqr',
        label: 'showQR',
      },
    ],
  },
];
