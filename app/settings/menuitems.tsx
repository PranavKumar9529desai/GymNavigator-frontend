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
      icon: <Settings size={20} />,
    },
    {
      label: "Trainer Settings",
      path: "/settings/trainer",
      icon: <UserCog size={20} />,
    },
    {
      label: "Payment Settings",
      path: "/settings/payment",
      icon: <CreditCard size={20} />,
    },
  ],
  client: [
    {
      label: "Health Profile",
      path: "/settings/healthprofile",
      icon: <Heart size={20} />,
    },
    {
      label: "Payment Settings",
      path: "/settings/payment",
      icon: <CreditCard size={20} />,
    },
  ],
  trainer: [
    {
      label: "Trainer Profile",
      path: "/settings/trainer",
      icon: <User size={20} />,
    },
    {
      label: "Payment Settings",
      path: "/settings/payment",
      icon: <CreditCard size={20} />,
    },
  ],
};
