'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, UserX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function AuthErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');

	const getErrorDetails = (errorCode: string | null) => {
		switch (errorCode) {
			case 'AccessDenied':
				return {
					title: 'Access Denied',
					description: 'Your account already exists. Please sign in instead.',
					icon: UserX,
					action: 'Sign In',
					href: '/signin',
				};
			case 'Configuration':
				return {
					title: 'Configuration Error',
					description:
						'There was a problem with the authentication configuration.',
					icon: AlertTriangle,
					action: 'Try Again',
					href: '/signup',
				};
			case 'Verification':
				return {
					title: 'Verification Required',
					description: 'Please verify your email address before signing in.',
					icon: AlertTriangle,
					action: 'Go to Sign In',
					href: '/signin',
				};
			default:
				return {
					title: 'Authentication Error',
					description: 'An unexpected error occurred during authentication.',
					icon: AlertTriangle,
					action: 'Try Again',
					href: '/signup',
				};
		}
	};

	const errorDetails = getErrorDetails(error);
	const IconComponent = errorDetails.icon;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
						<IconComponent className="w-6 h-6 text-red-600" />
					</div>
					<div>
						<CardTitle className="text-xl font-semibold text-slate-800">
							{errorDetails.title}
						</CardTitle>
						<CardDescription className="text-slate-600 mt-2">
							{errorDetails.description}
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col gap-3">
						<Button asChild className="w-full">
							<Link href={errorDetails.href}>{errorDetails.action}</Link>
						</Button>
						<Button variant="outline" asChild className="w-full">
							<Link href="/signup">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Sign Up
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
