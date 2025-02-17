import {
  CalendarCheck,
  Dumbbell,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
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
    name: "Assigned Users",
    label: "assignedusers",
    icon: Users,
    link: "/trainerdashboard/assignedusers",
  },
  {
    name: "Workouts",
    label: "workouts",
    icon: Dumbbell,
    link: "/trainerdashboard/workouts",
    subItems: [
      {
        name: "Create Workouts",
        label: "createworkout",
        link: "/trainerdashboard/workouts/createworkout",
      },
      {
        name: "Assign Workout",
        label: "assignworkout",
        link: "/trainerdashboard/workouts/assignworkout",
      },
    ],
  },
  {
    name: "Diet",
    label: "diet",
    icon: UtensilsCrossed,
    link: "/trainerdashboard/diet",
    subItems: [
      {
        name: "Create Diet plan",
        label: "createdietplan",
        link: "/trainerdashboard/diet/createdietplan",
      },
      {
        name: "Assign Diet plan",
        label: "assigndietplan",
        link: "/trainerdashboard/diet/assigndietplan",
      },
    ],
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    label: "attendance",
    link: "/trainerdashboard/attendance",
    subItems: [
      {
        name: "Today's Attendance",
        label: "todaysattendance",
        link: "/trainerdashboard/attendance/todaysattendance",
      },
      {
        name: "Show QR",
        label: "showqr",
        link: "/trainerdashboard/attendance/showqr",
      },
    ],
  },
]; 