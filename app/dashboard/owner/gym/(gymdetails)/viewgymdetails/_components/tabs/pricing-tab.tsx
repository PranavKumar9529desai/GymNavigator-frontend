'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Dumbbell,
	Star,
	Crown,
	Users,
	Target,
	Award,
	Zap,
	Sparkles,
} from 'lucide-react';
import type { FitnessPlan, AdditionalService } from '../../types/gym-types';

// Icon mapping for pricing plans
const iconMap = {
	dumbbell: Dumbbell,
	star: Star,
	crown: Crown,
	users: Users,
	target: Target,
	award: Award,
	zap: Zap,
	sparkles: Sparkles,
} as const;

const defaultPricingPlans: FitnessPlan[] = [
	{
		name: 'Basic',
		description: 'Perfect for beginners',
		price: '$29.99',
		duration: '/month',
		features: ['Gym equipment access', 'Locker room access', 'Free WiFi'],
		color: '#3B82F6',
		icon: 'dumbbell',
		maxMembers: 50,
		sortOrder: 0,
	},
	{
		name: 'Premium',
		description: 'Everything you need',
		price: '$49.99',
		duration: '/month',
		features: [
			'All Basic features',
			'Group classes included',
			'Sauna & steam room',
			'Guest privileges (2/month)',
		],
		isFeatured: true,
		color: '#8B5CF6',
		icon: 'crown',
		maxMembers: 30,
		sortOrder: 1,
	},
	{
		name: 'Elite',
		description: 'Ultimate experience',
		price: '$79.99',
		duration: '/month',
		features: [
			'All Premium features',
			'Personal training (2/month)',
			'Nutrition consultation',
			'Priority booking',
		],
		color: '#EC4899',
		icon: 'sparkles',
		maxMembers: 15,
		sortOrder: 2,
	},
];

const defaultAdditionalServices: AdditionalService[] = [
	{
		name: 'Registration Fee',
		price: '$25',
		duration: 'One-time only',
	},
	{
		name: 'Personal Training',
		price: '$75',
		duration: 'Per session',
	},
	{
		name: 'Day Pass',
		price: '$20',
		duration: 'Single visit',
	},
	{
		name: 'Guest Pass',
		price: '$15',
		duration: 'Per guest',
	},
];

interface PricingTabProps {
	pricingPlans?: FitnessPlan[];
	additionalServices?: AdditionalService[];
}

export function PricingTab({
	pricingPlans = defaultPricingPlans,
	additionalServices = defaultAdditionalServices,
}: PricingTabProps) {
	// Sort pricing plans by sortOrder if available, otherwise use array index
	const sortedPricingPlans = [...pricingPlans].sort((a, b) => {
		const orderA = a.sortOrder ?? pricingPlans.indexOf(a);
		const orderB = b.sortOrder ?? pricingPlans.indexOf(b);
		return orderA - orderB;
	});

	return (
		<div className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{sortedPricingPlans.map((plan, index) => {
					const IconComponent =
						(plan.icon && iconMap[plan.icon as keyof typeof iconMap]) ||
						Dumbbell;

					return (
						<Card
							key={index as number}
							className={`border shadow-lg transition-transform hover:scale-105 ${
								plan.isFeatured ? 'border-2' : ''
							}`}
							style={{
								borderColor: plan.isFeatured ? plan.color : undefined,
							}}
						>
							<CardHeader
								className="text-white relative overflow-hidden"
								style={{ backgroundColor: plan.color || '#374151' }}
							>
								<div className="flex items-center justify-between">
									<div>
										<h3 className="text-xl font-bold">{plan.name}</h3>
										<p className="text-gray-100 opacity-90">
											{plan.description}
										</p>
									</div>
									<IconComponent className="h-8 w-8 opacity-80" />
								</div>
								{plan.isFeatured && (
									<Badge className="absolute top-2 right-2 bg-white text-gray-900">
										Popular
									</Badge>
								)}
							</CardHeader>
							<CardContent className="p-6">
								<div className="mb-6">
									<span className="text-4xl font-black text-gray-900">
										{plan.price}
									</span>
									<span className="text-gray-500">{plan.duration}</span>
								</div>
								{plan.maxMembers && (
									<div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
										<Users className="h-4 w-4" />
										<span>Max {plan.maxMembers} members</span>
									</div>
								)}
								{plan.sessionDuration && (
									<div className="mb-2 text-sm text-gray-600">
										<span className="font-semibold">Session Duration:</span>{' '}
										{plan.sessionDuration} min
									</div>
								)}
								{plan.genderCategory && (
									<div className="mb-2 text-sm text-gray-600">
										<span className="font-semibold">Gender:</span>{' '}
										{plan.genderCategory}
									</div>
								)}
								{(plan.minAge || plan.maxAge) && (
									<div className="mb-2 text-sm text-gray-600">
										<span className="font-semibold">Age Range:</span>{' '}
										{plan.minAge ?? '-'} - {plan.maxAge ?? '-'}
									</div>
								)}
								{plan.categoriesJson && (
									<div className="mb-2 text-sm text-gray-600">
										<span className="font-semibold">Categories:</span> {(() => {
											try {
												const arr = JSON.parse(plan.categoriesJson);
												return Array.isArray(arr)
													? arr.join(', ')
													: plan.categoriesJson;
											} catch {
												return plan.categoriesJson;
											}
										})()}
									</div>
								)}
								<div className="space-y-3">
									{plan.features.map(
										(
											feature: string | { description?: string },
											featureIndex: number,
										) => (
											<div
												key={featureIndex as number}
												className="flex items-center gap-2"
											>
												<div
													className="h-2 w-2 rounded-full"
													style={{ backgroundColor: plan.color || '#000000' }}
												/>
												<span className="text-sm text-gray-700">
													{typeof feature === 'string'
														? feature
														: feature?.description || JSON.stringify(feature)}
												</span>
											</div>
										),
									)}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Additional Fees */}
			<Card className="border shadow-lg">
				<CardHeader>
					<h3 className="text-xl font-bold text-gray-900">
						Additional Services
					</h3>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{additionalServices.map((service, index) => (
							<div key={index as number} className="text-center">
								<p className="font-semibold text-gray-900">{service.name}</p>
								<p className="text-2xl font-bold text-gray-900">
									{service.price}
								</p>
								<p className="text-sm text-gray-500">{service.duration}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
