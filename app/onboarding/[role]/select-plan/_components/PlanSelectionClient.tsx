'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { updateSessionWithGym } from '../../../../(common)/_actions/session/updateSessionWithGym';
import type { GymInfo } from '@/types/next-auth';
import { PlanCard } from './PlanCard';
import { EnrollmentConfirmation } from './EnrollmentConfirmation';
import { EnrollmentSuccess } from './EnrollmentSuccess';
import { enrollInGym } from '../_actions/enroll-in-gym';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

interface Plan {
	id: number;
	name: string;
	description?: string;
	price: string;
	duration: string;
	features: Array<{ id: number; description: string }>;
	planTimeSlots: Array<{ id: number; startTime: string; endTime: string }>;
	isFeatured?: boolean;
	color?: string;
	icon?: string;
	maxMembers?: number;
	currentMembers?: number;
	genderCategory: 'MALE' | 'FEMALE' | 'OTHER' | 'ALL';
	minAge?: number;
	maxAge?: number;
}

interface GymData {
	id: number;
	name: string;
	logo: string;
}

interface PlanSelectionClientProps {
	gym: GymData;
	plans: Plan[];
	gymname: string;
	gymid: string;
	hash: string;
}

export function PlanSelectionClient({
	gym,
	plans,
	gymname,
	gymid,
	hash,
}: PlanSelectionClientProps) {
	const { update } = useSession();
	const router = useRouter();
	const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
	const [isEnrolling, setIsEnrolling] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const handlePlanSelect = (planId: number) => {
		setSelectedPlanId(planId);
		setErrorMessage(null);
	};

	const handleEnrollClick = () => {
		if (!selectedPlanId) return;
		setShowConfirmation(true);
	};

	const handleConfirmEnrollment = async () => {
		if (!selectedPlanId) return;

		setIsEnrolling(true);
		setErrorMessage(null);

		try {
			await enrollInGym(gymid, selectedPlanId.toString(), hash);

			// Update session with gym info
			const newGym: GymInfo = {
				id: gymid,
				gym_name: gymname,
			};

			await updateSessionWithGym(newGym, update);

			// Close confirmation dialog
			setShowConfirmation(false);

			// Show success screen
			setShowSuccess(true);
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : 'Failed to enroll in gym',
			);
			setIsEnrolling(false);
			console.error('Error enrolling in gym:', error);
		}
	};

	const handleCloseConfirmation = () => {
		setShowConfirmation(false);
		setIsEnrolling(false);
	};

	const handleCloseSuccess = () => {
		setShowSuccess(false);
		// Redirect to dashboard after a short delay
		setTimeout(() => {
			router.push('/dashboard/');
		}, 500);
	};

	const handleGoToDashboard = () => {
		setShowSuccess(false);
		router.push('/dashboard/');
	};

	const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

	// Show success screen if enrollment was successful
	if (showSuccess && selectedPlan) {
		return (
			<EnrollmentSuccess
				isOpen={showSuccess}
				onClose={handleCloseSuccess}
				plan={selectedPlan}
				gym={gym}
				onGoToDashboard={handleGoToDashboard}
			/>
		);
	}

	if (plans.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
				<div className="text-center max-w-md mx-auto p-6">
					<div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
						<AlertTriangle className="w-8 h-8 text-blue-600" />
					</div>

					<h2 className="text-lg font-semibold text-slate-800 mb-2">
						No Plans Available
					</h2>

					<p className="text-slate-600 mb-6">
						This gym doesn't have any membership plans available at the moment.
						Please contact the gym directly for more information.
					</p>

					<Button
						variant="outline"
						onClick={() => window.history.back()}
						className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 py-2 sm:pt-4">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Gym Header */}
				<div className="text-center mb-8">
					{gym.logo && (
						<div className="mb-4">
							<img
								src={gym.logo}
								alt={`${gym.name} logo`}
								className="h-16 w-auto mx-auto"
							/>
						</div>
					)}
					<h1 className="text-2xl font-bold text-slate-800 mb-2">
						Welcome to {gym.name}
					</h1>
					<p className="text-slate-600">
						Choose a membership plan that fits your needs
					</p>
				</div>

				{/* Plans Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-2">
					{plans.map((plan) => (
						<PlanCard
							key={plan.id}
							plan={plan}
							isSelected={selectedPlanId === plan.id}
							onSelect={() => handlePlanSelect(plan.id)}
						/>
					))}
				</div>

				{/* Error Message */}
				{errorMessage && (
					<div className="text-center mb-6">
						<Alert variant="destructive" className="max-w-md mx-auto">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					</div>
				)}

				{/* Enrollment Button */}
				{selectedPlanId && (
					<div className="text-center">
						<Button
							size="lg"
							onClick={handleEnrollClick}
							disabled={isEnrolling}
							className="px-8 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500"
						>
							{isEnrolling ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									Enrolling...
								</>
							) : (
								'Enroll Now'
							)}
						</Button>
					</div>
				)}

				{/* Confirmation Dialog */}
				<EnrollmentConfirmation
					isOpen={showConfirmation}
					onClose={handleCloseConfirmation}
					onConfirm={handleConfirmEnrollment}
					plan={selectedPlan || null}
					gym={gym}
					isEnrolling={isEnrolling}
				/>
			</div>
		</div>
	);
}
