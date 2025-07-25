'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GymDetailsData } from '../_actions/get-gym-details';

interface PricingPlansProps {
	plans: GymDetailsData['gym']['plans'];
}

export function PricingPlans({ plans }: PricingPlansProps) {
	if (plans.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Pricing Plans</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">No pricing plans available.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pricing Plans</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{plans.map((plan) => (
						<div
							key={plan.id}
							className="flex items-center justify-between p-4 border rounded-lg"
						>
							<div>
								<h3 className="font-semibold">{plan.name}</h3>
								<p className="text-sm text-muted-foreground">
									{plan.description}
								</p>
								<p className="text-sm text-muted-foreground">
									Duration: {plan.duration}
								</p>
							</div>
							<div className="text-right">
								<p className="font-bold text-lg">{plan.price}</p>
								{plan.isFeatured && (
									<span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
										Featured
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
