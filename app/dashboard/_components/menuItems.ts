import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Dumbbell,
  Home,
  UserCheck,
  Users,
  UtensilsCrossed,
} from 'lucide-react';

export interface SubItem {
  name: string;
  link: string;
  label: string;
}

export interface MenuItem {
  name: string;
  iconName: string;
  label: string;
  subItems?: SubItem[];
  link?: string;
}

export const OwnerDashboardMenuItems: MenuItem[] = [
  {
    name: 'Gym',
    iconName: 'Building2',
    label: 'gymDetails',
    subItems: [
      {
        name: 'View Details',
        link: '/dashboard/owner/gymdetails/viewgymdetails',
        label: 'viewGymDetails',
      },
    ],
  },
  {
    name: 'Trainers',
    iconName: 'UserCheck',
    label: 'trainers',
    subItems: [
      {
        name: 'View Trainers',
        link: '/dashboard/owner/trainers/viewtrainers',
        label: 'viewTrainers',
      },
      {
        name: 'Assign Trainers',
        link: '/dashboard/owner/trainers/userstrainersassignment',
        label: 'userstrainersassignment',
      },
    ],
  },
  {
    name: 'On-boarding',
    label: 'Onboarding',
    iconName: 'ClipboardList',
    link: '/dashboard/owner/onboarding/onboarding',
    subItems: [
      {
        name: 'Onboarding Users',
        label: 'onboarded users',
        link: '/dashboard/owner/onboarding/onboardedusers',
      },
      {
        name: 'Onboarding QR',
        label: 'onboarding QR',
        link: '/dashboard/owner/onboarding/onboardingqr',
      },
    ],
  },
  {
    name: 'Attendance',
    iconName: 'CalendarCheck',
    label: 'attendance',
    subItems: [
      {
        name: "Today's Attendance",
        link: '/dashboard/owner/attendance/todaysattendance',
        label: 'todaysAttendance',
      },
      {
        name: 'Show QR',
        link: '/dashboard/owner/attendance/showqr',
        label: 'showQR',
      },
    ],
  },
];

export const TrainerDashboardMenuItems: MenuItem[] = [
  {
    name: 'Assigned Users',
    label: 'assignedusers',
    iconName: 'Users',
    link: '/dashboard/trainer/assignedusers',
  },
  {
    name: 'Workouts',
    label: 'workouts',
    iconName: 'Dumbbell',
    link: '/dashboard/trainer/workouts',
    subItems: [
      {
        name: 'Create Workouts',
        label: 'createworkout',
        link: '/dashboard/trainer/workouts/createworkout',
      },
      {
        name: 'Assign Workout',
        label: 'assignworkout',
        link: '/dashboard/trainer/workouts/assignworkout',
      },
    ],
  },
  {
    name: 'Diet',
    label: 'diet',
    iconName: 'UtensilsCrossed',
    link: '/dashboard/trainer/diet',
    subItems: [
      {
        name: 'Create Diet plan',
        label: 'createdietplan',
        link: '/dashboard/trainer/diet/createdietplan',
      },
      {
        name: 'Assign Diet plan',
        label: 'assigndietplan',
        link: '/dashboard/trainer/diet/assigndietplan',
      },
    ],
  },
  {
    name: 'Attendance',
    iconName: 'CalendarCheck',
    label: 'attendance',
    link: '/dashboard/trainer/attendance',
    subItems: [
      {
        name: "Today's Attendance",
        label: 'todaysattendance',
        link: '/dashboard/trainer/attendance/todaysattendance',
      },
      {
        name: 'Show QR',
        label: 'showqr',
        link: '/dashboard/trainer/attendance/showqr',
      },
    ],
  },
];

export const ClientDashboardMenuItems: MenuItem[] = [
  {
    name: 'Home',
    label: 'home',
    iconName: 'Home',
    subItems: [
      {
        name: 'Gym',
        label: 'gym',
        link: '/dashboard/client/home/gym',
      },
      {
        name: 'Dashboard',
        label: 'dashboard',
        link: '/dashboard/client/home/dashboard',
      },
    ],
  },
  {
    name: 'Workouts',
    label: 'workouts',
    iconName: 'Dumbbell',
    link: '/dashboard/client/workouts',
    subItems: [
      {
        name: 'View Workout',
        label: 'viewworkout',
        link: '/dashboard/client/workouts/viewworkout',
      },
      {
        name: 'All Workouts',
        label: 'allworkouts',
        link: '/dashboard/client/workouts/allworkouts',
      },
    ],
  },
  {
    name: 'Diet',
    label: 'diet',
    iconName: 'UtensilsCrossed',
    link: '/dashboard/client/diet',
    subItems: [
      {
        name: 'View Diet',
        label: 'viewdiet',
        link: '/dashboard/client/diet/viewdiet',
      },
      {
        name: 'Grocery List',
        label: 'grocerylist',
        link: '/dashboard/client/diet/grocerylist',
      },
      {
        name: 'Eating Out Guide',
        label: 'eatingoutguide',
        link: '/dashboard/client/diet/eatingoutguide',
      },
    ],
  },
  {
    name: 'Attendance',
    iconName: 'CalendarCheck',
    label: 'attendance',
    link: '/dashboard/client/attendance',
    subItems: [
      {
        name: 'View Attendance',
        label: 'viewattendance',
        link: '/dashboard/client/attendance/viewattendance',
      },
      {
        name: 'Mark Attendance',
        label: 'markattendance',
        link: '/dashboard/client/attendance/markattendance',
      },
    ],
  },
];
