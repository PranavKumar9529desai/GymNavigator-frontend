'use client';

import { Calendar, Clock } from 'lucide-react';

interface MembershipInfoProps {
	membership: {
		activeMembership: {
			id: number;
			startDate: string;
			endDate: string;
			status: string;
			plan: {
				id: number;
				name: string;
				price: string;
				duration: string;
			};
		} | null;
	};
}

export function MembershipInfo({ membership }: MembershipInfoProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
					<Calendar className="h-3 w-3 text-white" />
				</div>
				<h2 className="text-lg font-semibold text-slate-800">My Membership</h2>
			</div>

			<div className="border-l-2 border-blue-200 pl-4">
				{membership.activeMembership ? (
					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-3">
							<div>
								<p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
									Plan
								</p>
								<p className="text-sm font-bold text-slate-800 mt-1">
									{membership.activeMembership.plan.name}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
									Start Date
								</p>
								<p className="text-sm font-bold text-slate-800 mt-1">
									{formatDate(membership.activeMembership.startDate)}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
									End Date
								</p>
								<p className="text-sm font-bold text-slate-800 mt-1">
									{formatDate(membership.activeMembership.endDate)}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
									Status
								</p>
								<div className="mt-1">
									<span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium capitalize">
										{membership.activeMembership.status}
									</span>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="py-4">
						<Clock className="h-8 w-8 text-blue-300 mb-2" />
						<p className="text-slate-600 font-medium">
							No active membership found
						</p>
						<p className="text-xs text-slate-500 mt-1">
							Contact your gym to activate your membership
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
