'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle, ArrowLeft, InfoIcon, RefreshCw } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { attachRoleToGym } from '../../_actions/attach-role-to-gym';

interface ErrorStateProps {
	errorMessage: string;
	gymName?: string | null;
	gymId?: string | null;
	hash?: string | null;
	onRetry: () => void;
}

export function ErrorState({
	errorMessage,
	gymName,
	gymId,
	hash,
	onRetry,
}: ErrorStateProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isRetrying, setIsRetrying] = useState(false);

	// Helper function to determine what kind of error we're dealing with
	const getErrorType = ():
		| 'expired'
		| 'invalid'
		| 'connection'
		| 'permission'
		| 'unknown' => {
		const msg = errorMessage.toLowerCase();

		if (msg.includes('expired') || msg.includes('timeout')) {
			return 'expired';
		}
		if (msg.includes('invalid') || msg.includes('not found')) {
			return 'invalid';
		}
		if (
			msg.includes('connection') ||
			msg.includes('connect') ||
			msg.includes('network')
		) {
			return 'connection';
		}
		if (
			msg.includes('permission') ||
			msg.includes('access') ||
			msg.includes('not authorized')
		) {
			return 'permission';
		}

		return 'unknown';
	};

	const errorType = getErrorType();

	// Error-specific suggestions
	const errorSuggestions = {
		expired: [
			'The QR code may have expired',
			'Ask your gym administrator to generate a new QR code',
			'Try scanning the QR code again',
		],
		invalid: [
			'This QR code may not be valid',
			"Make sure you're scanning a QR code from your gym administrator",
			'This code might be for a different gym or role',
		],
		connection: [
			'Check your internet connection',
			'Try connecting to a different network',
			"Your gym's server might be temporarily down",
		],
		permission: [
			'You may not have permission to join this gym',
			'Contact your gym administrator for assistance',
			"Make sure you're using the correct account",
		],
		unknown: [
			'Try again later',
			'Contact your gym administrator',
			'Check if your account is set up correctly',
		],
	};

	const handleRetry = async () => {
		if (!gymName || !gymId || !hash) {
			return;
		}

		setIsRetrying(true);

		try {
			const role = pathname.split("/")[2]; // Extract role from pathname
			const result = await attachRoleToGym({
				gymname: gymName,
				gymid: gymId,
				hash,
				role,
			});

			if (result.success) {
				onRetry();
			} else {
				// Still failing
				setIsRetrying(false);
			}
		} catch (_err) {
			setIsRetrying(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[70vh]">
			<Card className="w-full max-w-md border border-red-200 shadow-lg">
				<CardHeader className="text-center">
					<div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
						<AlertCircle className="h-12 w-12 text-red-500" />
					</div>
					<CardTitle className="text-2xl font-bold text-red-700">
						Enrollment Failed
					</CardTitle>
					<CardDescription className="text-base mt-2">
						{errorMessage}
					</CardDescription>
				</CardHeader>

				<CardContent className="px-6">
					<div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-100">
						<div className="flex items-center gap-2 mb-2">
							<InfoIcon className="h-4 w-4 text-red-600" />
							<h3 className="font-semibold">Possible Solutions:</h3>
						</div>
						<ul className="list-disc pl-5 space-y-1">
							{errorSuggestions[errorType].map((suggestion, index) => (
								<li key={index as number} className="text-sm text-gray-700">
									{suggestion}
								</li>
							))}
						</ul>
					</div>

					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="common-issues">
							<AccordionTrigger>Common Issues</AccordionTrigger>
							<AccordionContent>
								<ul className="list-disc pl-5 space-y-2 text-sm">
									<li>QR codes typically expire after 15 minutes</li>
									<li>Make sure you're logged in with the correct account</li>
									<li>
										Your gym administrator might need to add you to the system
										first
									</li>
									<li>Check if your profile is complete</li>
								</ul>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="contact-support">
							<AccordionTrigger>Need Help?</AccordionTrigger>
							<AccordionContent>
								<p className="text-sm mb-2">
									If you continue to experience issues, please contact your gym
									administrator or reach out to our support team.
								</p>
								<Button
									variant="outline"
									size="sm"
									className="w-full mt-2"
									onClick={() => {
										window.location.href = '/help';
									}}
								>
									Go to Help Center
								</Button>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>

				<CardFooter className="flex flex-col sm:flex-row gap-3">
					<Button
						variant="outline"
						className="w-full sm:w-auto flex items-center gap-2"
						onClick={() => router.back()}
					>
						<ArrowLeft className="h-4 w-4" /> Go Back
					</Button>

					<Button
						className="w-full sm:w-auto flex items-center gap-2 bg-red-600 hover:bg-red-700"
						onClick={handleRetry}
						disabled={isRetrying || !gymName || !gymId || !hash}
					>
						<RefreshCw
							className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`}
						/>
						{isRetrying ? 'Retrying...' : 'Try Again'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
