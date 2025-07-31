import { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useGoogleSignIn() {
	const [isPending, startTransition] = useTransition();
	const _router = useRouter();

	const handleGoogleSignIn = async () => {
		startTransition(async () => {
			const _loadingToast = toast.loading('Connecting to Google...');

			try {
				await signIn('google', {
					callbackUrl: '/dashboard',
				});
			} catch (error) {
				toast.dismiss();
				toast.error('Google Sign-in failed', { 
					description: 'Please try again' 
				});
				console.error('Failed to sign in with Google:', error);
			}
		});
	};

	return {
		handleGoogleSignIn,
		isPending,
	};
} 