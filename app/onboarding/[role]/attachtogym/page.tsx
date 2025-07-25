'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateSessionWithGym } from '../../../(common)/_actions/session/updateSessionWithGym';
import type { GymInfo } from '@/types/next-auth';
import { attachRoleToGym } from '../_actions/attach-role-to-gym';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';

export default function AttachToGymPage() {
	const { data: session, update } = useSession();
	console.log('session', session, update);
	const router = useRouter();

	const pathname = usePathname();

	const searchParams = useSearchParams();
	const gymname = searchParams.get('gymname');
	const gymid = searchParams.get('gymid');
	const hash = searchParams.get('hash');
	const newGym: GymInfo = {
		id: gymid as string,
		gym_name: gymname as string,
	};

	const [status, setStatus] = useState<'loading' | 'error'>('loading');
	const [message, setMessage] = useState('');

	const processAttachment = async () => {
		setStatus('loading');
		if (!gymname || !gymid || !hash) {
			setMessage(
				'Missing required gym information. Please scan a valid QR code.',
			);
			setStatus('error');
			return;
		}

		try {
			const role = pathname.split('/')[2]; // Extract role from pathname
			const result = await attachRoleToGym({ gymname, gymid, hash, role });

			if (result.success) {
				await updateSessionWithGym(newGym, update);
				router.push('/dashboard/');
			} else {
				setMessage(result.message);
				setStatus('error');
			}
		} catch (err) {
			setMessage('An unexpected error occurred. Please try again later.');
			setStatus('error');
			console.error(err);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		processAttachment();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Display appropriate component based on status
	if (status === 'loading') {
		return <LoadingState />;
	}

	if (status === 'error') {
		return (
			<ErrorState
				errorMessage={message}
				gymName={gymname}
				gymId={gymid}
				hash={hash}
				onRetry={processAttachment}
			/>
		);
	}

	return null;
}
