import { ReactNode } from "react";
import { Settings, UserCog, CreditCard, Heart, User } from "lucide-react";

export type Role = "owner" | "client" | "trainer";

export interface MenuItem {
  label: string;
  path: string;
  icon?: ReactNode;
}

export const settingsMenuItems: Record<Role, MenuItem[]> = {
  owner: [
    {
      label: "Gym Settings",
      path: "/settings/gym",
      icon: <Settings size={24} strokeWidth={1.5} />,
    },
    {
      label: "Trainer Settings",
      path: "/settings/trainer",
      icon: <UserCog size={24} strokeWidth={1.5} />,
    },
    {
      label: "Payment Settings",
      path: "/settings/payment",
      icon: <CreditCard size={24} strokeWidth={1.5} />,
    },
  ],
  client: [
    {
      label: "Health Profile",
      path: "/settings/healthprofile",
      icon: <Heart size={24} strokeWidth={1.5} />,
    },
    {
      label: "Payment Settings",
      path: "/settings/payment",
      icon: <CreditCard size={24} strokeWidth={1.5} />,
    },
  ],
  trainer: [
    {
      label: "Trainer Profile",
      path: "/settings/trainer",
      icon: <User size={24} strokeWidth={1.5} />,
    },
    {
      label: "Payment Settings",
      path: "/settings/payment",
      icon: <CreditCard size={24} strokeWidth={1.5} />,
    },
  ],
};
