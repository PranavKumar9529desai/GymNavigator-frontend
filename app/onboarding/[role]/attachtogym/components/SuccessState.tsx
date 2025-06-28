'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SuccessStateProps {
	message: string;
	gymName: string;
}

export function SuccessState({ message, gymName }: SuccessStateProps) {
	const router = useRouter();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCountdown((prevCount) => prevCount - 1);
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);
	
	useEffect(() => {
		if (countdown <= 0) {
			router.push('/dashboard');
		}
	}, [countdown, router]);

	return (
		<div className="flex items-center justify-center min-h-[70vh] bg-inherit">
			<Card className="w-full max-w-md ">
				<CardHeader className="text-center">
					<div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-pulse">
						<CheckCircle className="h-12 w-12 text-green-500 animate-bounce" />
					</div>
					<CardTitle className="text-2xl font-bold text-green-700">
						Successfully Enrolled!
					</CardTitle>
					<CardDescription className="text-base mt-2">
						{message}
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center px-6">
					<p className="font-medium">
						You are now connected to{' '}
						<span className="font-bold">{gymName}</span>
					</p>
					<p className="mt-2 text-sm text-gray-600">
						You can now access all the features available for your role.
					</p>
					<p className="mt-2 text-sm text-gray-500">
						Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
					</p>
				</CardContent>
				<CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
					<Button
						onClick={() => router.push('/dashboard')}
						className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
						size="lg"
					>
						Go to Dashboard
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
