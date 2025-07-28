'use client';
import { useEffect } from 'react';
import posthog from 'posthog-js';

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

export default function PostHogIdentify({
	userId,
	email,
	name,
	role,
	gym,
}: Props) {
	useEffect(() => {
		if (userId) {
			const userProps = {
				email,
				name,
				role,
				gym_id: gym?.id,
				gym_name: gym?.gym_name,
			};
			
			posthog.identify(userId, userProps);
		} else {
			
		}
	}, [userId, email, name, role, gym]);
	return null;
}
