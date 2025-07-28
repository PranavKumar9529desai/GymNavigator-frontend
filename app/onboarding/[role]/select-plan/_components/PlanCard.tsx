import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	Check,
	Dumbbell,
	Heart,
	Star,
	Zap,
	Target,
	Users,
	Calendar,
	Clock,
	TrendingUp,
	Shield,
	Award,
	Sparkles,
} from 'lucide-react';

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

interface PlanCardProps {
	plan: Plan;
	isSelected: boolean;
	onSelect: () => void;
}

// Icon mapping for plan types
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	dumbbell: Dumbbell,
	heart: Heart,
	star: Star,
	zap: Zap,
	target: Target,
	users: Users,
	calendar: Calendar,
	clock: Clock,
	trendingup: TrendingUp,
	shield: Shield,
	award: Award,
	sparkles: Sparkles,
};

// Sales psychology: Value propositions and urgency indicators
const getValueIndicators = (plan: Plan) => {
	const indicators = [];

	// Popularity indicator (social proof)
	if (plan.currentMembers && plan.currentMembers > 10) {
		indicators.push({
			icon: TrendingUp,
			text: `${plan.currentMembers}+ members`,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		});
	}

	// Scarcity indicator
	if (plan.maxMembers && plan.currentMembers) {
		const remaining = plan.maxMembers - plan.currentMembers;
		if (remaining <= 5 && remaining > 0) {
			indicators.push({
				icon: Clock,
				text: `Only ${remaining} spots left!`,
				color: 'text-orange-600',
				bgColor: 'bg-orange-50',
			});
		}
	}

	// Premium indicator
	if (plan.isFeatured) {
		indicators.push({
			icon: Award,
			text: 'Most Popular',
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		});
	}

	return indicators;
};

// Calculate savings and value
const getValueMetrics = (plan: Plan) => {
	const priceMatch = plan.price.match(/(\d+)/);
	const price = priceMatch ? Number.parseInt(priceMatch[1]) : 0;

	// Calculate daily cost for comparison
	const durationMatch = plan.duration.match(/(\d+)/);
	const duration = durationMatch ? Number.parseInt(durationMatch[1]) : 1;

	let dailyCost = 0;
	if (plan.duration.includes('month')) {
		dailyCost = price / (duration * 30);
	} else if (plan.duration.includes('week')) {
		dailyCost = price / (duration * 7);
	} else if (plan.duration.includes('year')) {
		dailyCost = price / (duration * 365);
	} else {
		dailyCost = price / duration;
	}

	return {
		dailyCost: dailyCost.toFixed(2),
		valueScore: dailyCost < 5 ? 'Excellent' : dailyCost < 10 ? 'Great' : 'Good',
	};
};

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
	const isFeatured = plan.isFeatured;
	const valueIndicators = getValueIndicators(plan);
	const valueMetrics = getValueMetrics(plan);

	// Get the icon component from the mapping
	const IconComponent = plan.icon ? iconMap[plan.icon.toLowerCase()] : Dumbbell;

	// Calculate availability percentage
	const availabilityPercentage =
		plan.maxMembers && plan.currentMembers
			? Math.round(
					((plan.maxMembers - plan.currentMembers) / plan.maxMembers) * 100,
				)
			: 100;

	return (
		<TooltipProvider>
			<Card
				className={`relative cursor-pointer transition-all duration-300 bg-white ${
					isSelected
						? 'border-blue-500 shadow-xl scale-105 ring-2 ring-blue-100'
						: 'border-slate-200 hover:border-blue-300 hover:shadow-lg hover:scale-102'
				} ${isFeatured ? 'ring-2 ring-blue-100 shadow-lg' : ''}`}
			>
				{/* Featured Badge */}
				{isFeatured && (
					<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
						<Badge className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white border-0 shadow-lg">
							<Star className="w-3 h-3 mr-1" />
							Featured
						</Badge>
					</div>
				)}

				{/* Selection Indicator */}
				{isSelected && (
					<div className="absolute -top-2 -right-2 z-10">
						<div className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
							<Check className="w-4 h-4" />
						</div>
					</div>
				)}

				{/* Value Indicators */}
				{valueIndicators.length > 0 && (
					<div className="absolute top-4 left-4 space-y-1">
						{valueIndicators.map((indicator) => (
							<div
								key={`${indicator.text}-${indicator.color}`}
								className={`${indicator.bgColor} ${indicator.color} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm`}
							>
								<indicator.icon className="w-3 h-3" />
								{indicator.text}
							</div>
						))}
					</div>
				)}

				<CardHeader className="text-center pb-4 pt-6">
					<div className="mb-3">
						<div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center mx-auto shadow-lg">
							<IconComponent className="w-7 h-7 text-white" />
						</div>
					</div>
					<CardTitle className="text-xl font-bold text-slate-800 mb-1">
						{plan.name}
					</CardTitle>
					{plan.description && (
						<p className="text-sm text-slate-600">{plan.description}</p>
					)}

					{/* Value Score */}
					<div className="mt-2">
						<Badge variant="secondary" className="text-xs">
							<Sparkles className="w-3 h-3 mr-1" />
							{valueMetrics.valueScore} Value
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="space-y-5">
					{/* Price with Value Proposition */}
					<div className="text-center">
						<div className="text-3xl font-bold text-slate-800 mb-1">
							₹{plan.price}
						</div>
						<div className="text-sm text-slate-600 mb-2">{plan.duration}</div>
						<div className="text-xs text-slate-500">
							Only ₹{valueMetrics.dailyCost} per day
						</div>
					</div>

					{/* Availability Indicator */}
					{plan.maxMembers && (
						<div className="bg-slate-50 rounded-lg p-3">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-slate-700">
									Availability
								</span>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-xs text-slate-500 cursor-help">
											{plan.currentMembers || 0}/{plan.maxMembers} members
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>Current members vs maximum capacity</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<div className="w-full bg-slate-200 rounded-full h-2">
								<div
									className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full transition-all duration-300"
									style={{ width: `${availabilityPercentage}%` }}
								/>
							</div>
							<div className="text-xs text-slate-600 mt-1">
								{plan.maxMembers - (plan.currentMembers || 0)} spots available
							</div>
						</div>
					)}

					{/* Features with Enhanced Presentation */}
					<div>
						<h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
							<Shield className="w-4 h-4 mr-2 text-blue-600" />
							What's included:
						</h4>
						<ul className="space-y-2">
							{plan.features.map((feature) => (
								<li key={feature.id} className="flex items-start">
									<div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
										<Check className="w-3 h-3 text-green-600" />
									</div>
									<span className="text-sm text-slate-700">
										{feature.description}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Time Slots with Better Presentation */}
					{plan.planTimeSlots.length > 0 && (
						<div>
							<h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
								<Clock className="w-4 h-4 mr-2 text-blue-600" />
								Available Times:
							</h4>
							<div className="space-y-1">
								{plan.planTimeSlots.map((slot) => (
									<div
										key={slot.id}
										className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded"
									>
										{slot.startTime} - {slot.endTime}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Additional Info with Better Styling */}
					<div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-2 rounded">
						{plan.genderCategory !== 'ALL' && (
							<div className="flex items-center">
								<Users className="w-3 h-3 mr-1" />
								Gender: {plan.genderCategory}
							</div>
						)}
						{plan.minAge && plan.maxAge && (
							<div className="flex items-center">
								<Target className="w-3 h-3 mr-1" />
								Age: {plan.minAge} - {plan.maxAge} years
							</div>
						)}
					</div>

					{/* Enhanced Select Button */}
					<Button
						variant={isSelected ? 'default' : 'outline'}
						className={`w-full transition-all duration-200 ${
							isSelected
								? 'bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 shadow-lg'
								: 'border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
						}`}
						onClick={onSelect}
					>
						{isSelected ? (
							<>
								<Check className="w-4 h-4 mr-2" />
								Selected
							</>
						) : (
							<>
								<Dumbbell className="w-4 h-4 mr-2" />
								Select Plan
							</>
						)}
					</Button>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}
