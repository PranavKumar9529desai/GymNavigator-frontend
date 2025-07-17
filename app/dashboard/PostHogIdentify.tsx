"use client";
import { useEffect } from "react";
import posthog from "posthog-js";

type GymInfo = {
  id: string;
  gym_name: string;
};

type Props = {
  userId: string;
  email?: string;
  name?: string;
  role?: string;
  gym?: GymInfo;
};

export default function PostHogIdentify({ userId, email, name, role, gym }: Props) {
  useEffect(() => {
    if (userId) {
      const userProps = {
        email,
        name,
        role,
        gym_id: gym?.id,
        gym_name: gym?.gym_name,
      };
      console.log('[PostHogIdentify] Calling posthog.identify with:', userId, userProps);
      posthog.identify(userId, userProps);
    } else {
      console.log('[PostHogIdentify] No userId provided, not calling posthog.identify');
    }
  }, [userId, email, name, role, gym]);
  return null;
} 