'use client';

import type { GymDetailsData } from '../_actions/get-gym-details';
import { AdditionalServices } from './additional-services';
import { AttendanceHistory } from './attendance-history';
import { GymAmenities } from './gym-amenities';
import { GymHeader } from './gym-header';
import { MembershipInfo } from './membership-info';
import { PricingPlans } from './pricing-plans';
import { TrainerInfo } from './trainer-info';

interface GymDetailsProps {
	data: GymDetailsData;
}

export function GymDetails({ data }: GymDetailsProps) {
	const { gym, trainer, membership, attendanceHistory } = data;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
			<div className="mx-auto space-y-12 p-4 sm:p-6 pt-16">
				{/* Gym Header */}
				<GymHeader gym={gym} />

				{/* Membership & Trainer Information - Desktop: Side by side, Mobile: Stacked */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					<MembershipInfo membership={membership} />
					<TrainerInfo trainer={trainer} />
				</div>

				{/* Attendance History */}
				<AttendanceHistory attendanceHistory={attendanceHistory} />

				{/* Gym Amenities */}
				<GymAmenities amenities={gym.amenities} />

				{/* Pricing Plans */}
				<PricingPlans plans={gym.plans} />

				{/* Additional Services */}
				<AdditionalServices additionalServices={gym.additionalServices} />
			</div>
		</div>
	);
}
