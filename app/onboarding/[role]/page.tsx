import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, InfoIcon, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import OnboardingQrScanner from '../_components/onboarding-qr-scanner';
import RoleStorageManager from '../_components/role-storage-manager';
import { getEnrollmentStatus } from './_actions/get-enrollment-status';

export const metadata: Metadata = {
	title: 'Gym Onboarding | GymNavigator',
	description: 'Scan QR code to join your gym',
};

interface RoleProps {
	params: Promise<{ role: string }>;
}

export default async function OnboardingPage({ params }: RoleProps) {
	const { role } = await params;
	const enrollmentStatus = await getEnrollmentStatus();

	// If user is already enrolled in a gym, show enrolled status
	if (enrollmentStatus.isEnrolled) {
		return (
			<div className="flex flex-col items-center sm:justify-center min-h-[80vh] p-4">
				<Card className="w-full max-w-md bg-transparent border-none">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-full flex items-center justify-center">
							<ShieldCheck className="h-6 w-6 text-green-500" />
						</div>
						<CardTitle className="text-white/80">Already Enrolled</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-muted-foreground">
							{enrollmentStatus.msg}
						</p>
						<div className="flex justify-center">
							<Button
								asChild
								className="infince-flex justify-center items-center bg-green-600 text-white"
							>
								<Link href="/dashboard">Go to Dashboard</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Validate the role parameter
	const validRoles = ['owner', 'trainer', 'client'];
	if (!validRoles.includes(role)) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
				<Card className="w-full max-w-md border-destructive">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 bg-red-100 dark:bg-red-900/20 w-12 h-12 rounded-full flex items-center justify-center">
							<AlertTriangle className="h-6 w-6 text-destructive" />
						</div>
						<CardTitle>Invalid Role</CardTitle>
						<CardDescription>The specified role is not valid.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-muted-foreground">
							Please ensure you're using a valid role for onboarding.
						</p>
						<div className="flex justify-center">
							<Button variant="outline" asChild>
								<Link href="/onboarding/trainee">Continue as Trainee</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Show the QR scanner for onboarding
	return (
		<div className="flex  justify-center min-h-[80vh] p-4">
			<RoleStorageManager role={role} />
			<div className="w-full max-w-md">
				<div className="flex items-center justify-center gap-2 p-3 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
					<InfoIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
					<p className="text-sm font-medium">
						You're onboarding as a{' '}
						<span className=" rounded-md capitalize font-semibold ">
							{role}
						</span>
					</p>
				</div>
				<OnboardingQrScanner />
			</div>
		</div>
	);
}
