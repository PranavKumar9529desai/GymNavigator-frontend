'use client';

import {
	User,
	Heart,
	Target,
	Activity,
	Scale,
	Ruler,
	Utensils,
	AlertCircle,
	Clock,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
	id: number;
	name: string;
	email: string;
	HealthProfile: {
		id: number;
		gender: string;
		age: number;
		goal: string;
		activityLevel: string;
		heightValue: number;
		heightUnit: string;
		weightValue: number;
		weightUnit: string;
		dietaryPreference: string;
		allergies: string;
		mealTimes: string;
		medicalConditions: string;
		bmi?: number;
		bmr?: number;
		tdee?: number;
	} | null;
	dietPlan?: {
		id: number;
		name: string;
		description: string;
	} | null;
}

interface UserHealthProfileCardProps {
	userProfile: UserProfile;
}

export function UserHealthProfileCard({
	userProfile,
}: UserHealthProfileCardProps) {
	const health = userProfile.HealthProfile;

	// Parse JSON fields safely
	const parseJsonSafely = (jsonString: string) => {
		try {
			return JSON.parse(jsonString);
		} catch {
			return [];
		}
	};

	const allergies = health ? parseJsonSafely(health.allergies) : [];
	const medicalConditions = health
		? parseJsonSafely(health.medicalConditions)
		: [];

	// Calculate BMI if not available
	const calculateBMI = (weight: number, height: number, heightUnit: string) => {
		const heightInMeters = heightUnit === 'ft' ? height * 0.3048 : height / 100;
		return weight / (heightInMeters * heightInMeters);
	};

	const bmi =
		health?.bmi ||
		(health
			? calculateBMI(health.weightValue, health.heightValue, health.heightUnit)
			: 0);

	const getBMICategory = (bmi: number) => {
		if (bmi < 18.5)
			return { category: 'Underweight', color: 'bg-blue-100 text-blue-800' };
		if (bmi < 25)
			return { category: 'Normal', color: 'bg-green-100 text-green-800' };
		if (bmi < 30)
			return { category: 'Overweight', color: 'bg-yellow-100 text-yellow-800' };
		return { category: 'Obese', color: 'bg-red-100 text-red-800' };
	};

	if (!health) {
		return (
			<Card className="border-orange-200 bg-orange-50/50">
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
							<AlertCircle className="h-4 w-4 text-white" />
						</div>
						<div>
							<CardTitle className="text-lg text-orange-800">
								Health Profile Missing
							</CardTitle>
							<CardDescription className="text-orange-600">
								This user hasn't completed their health profile yet.
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-2 text-slate-600">
						<User className="h-4 w-4" />
						<span className="font-medium">{userProfile.name}</span>
					</div>
					<p className="text-sm text-orange-700">
						Ask the user to complete their health profile before assigning a
						diet plan.
					</p>
				</CardContent>
			</Card>
		);
	}

	const bmiInfo = getBMICategory(bmi);

	return (
		<Card className="border-blue-100">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
						<User className="h-4 w-4 text-white" />
					</div>
					<div>
						<CardTitle className="text-lg text-slate-800">
							Health Profile
						</CardTitle>
						<CardDescription>
							Complete health information for {userProfile.name}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Basic Info */}
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-slate-600">
							<User className="h-4 w-4" />
							<span className="text-sm font-medium">Basic Info</span>
						</div>
						<div className="pl-6 space-y-1">
							<p className="text-sm">
								<span className="font-medium">Age:</span> {health.age} years
							</p>
							<p className="text-sm">
								<span className="font-medium">Gender:</span> {health.gender}
							</p>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-slate-600">
							<Target className="h-4 w-4" />
							<span className="text-sm font-medium">Goal</span>
						</div>
						<div className="pl-6">
							<Badge
								variant="outline"
								className="border-blue-200 text-blue-700"
							>
								{health.goal}
							</Badge>
						</div>
					</div>
				</div>

				{/* Physical Measurements */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-slate-600">
						<Scale className="h-4 w-4" />
						<span className="text-sm font-medium">Physical Measurements</span>
					</div>
					<div className="pl-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="p-3 bg-blue-50/50 rounded-lg">
							<div className="flex items-center gap-2 mb-1">
								<Scale className="h-3 w-3 text-blue-600" />
								<span className="text-xs font-medium text-blue-700">
									Weight
								</span>
							</div>
							<p className="text-sm font-semibold">
								{health.weightValue} {health.weightUnit}
							</p>
						</div>
						<div className="p-3 bg-blue-50/50 rounded-lg">
							<div className="flex items-center gap-2 mb-1">
								<Ruler className="h-3 w-3 text-blue-600" />
								<span className="text-xs font-medium text-blue-700">
									Height
								</span>
							</div>
							<p className="text-sm font-semibold">
								{health.heightValue} {health.heightUnit}
							</p>
						</div>
						<div className="p-3 bg-blue-50/50 rounded-lg">
							<div className="flex items-center gap-2 mb-1">
								<Heart className="h-3 w-3 text-blue-600" />
								<span className="text-xs font-medium text-blue-700">BMI</span>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-semibold">{bmi.toFixed(1)}</p>
								<Badge
									className={`text-xs ${bmiInfo.color}`}
									variant="secondary"
								>
									{bmiInfo.category}
								</Badge>
							</div>
						</div>
					</div>
				</div>

				{/* Activity & Diet */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-slate-600">
							<Activity className="h-4 w-4" />
							<span className="text-sm font-medium">Activity Level</span>
						</div>
						<div className="pl-6">
							<Badge
								variant="outline"
								className="border-green-200 text-green-700"
							>
								{health.activityLevel}
							</Badge>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-slate-600">
							<Utensils className="h-4 w-4" />
							<span className="text-sm font-medium">Diet Preference</span>
						</div>
						<div className="pl-6">
							<Badge
								variant="outline"
								className="border-orange-200 text-orange-700"
							>
								{health.dietaryPreference}
							</Badge>
						</div>
					</div>
				</div>

				{/* Meal Times */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-slate-600">
						<Clock className="h-4 w-4" />
						<span className="text-sm font-medium">Meal Frequency</span>
					</div>
					<div className="pl-6">
						<Badge
							variant="outline"
							className="border-purple-200 text-purple-700"
						>
							{health.mealTimes} meals per day
						</Badge>
					</div>
				</div>

				{/* Allergies */}
				{allergies.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-slate-600">
							<AlertCircle className="h-4 w-4" />
							<span className="text-sm font-medium">Allergies</span>
						</div>
						<div className="pl-6 flex flex-wrap gap-2">
							{allergies.map(
								(allergy: { name: string; selected: boolean }, index: number) =>
									allergy.selected && (
										<Badge
											key={index as number}
											variant="destructive"
											className="text-xs"
										>
											{allergy.name}
										</Badge>
									),
							)}
						</div>
					</div>
				)}

				{/* Medical Conditions */}
				{medicalConditions.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-slate-600">
							<Heart className="h-4 w-4" />
							<span className="text-sm font-medium">Medical Conditions</span>
						</div>
						<div className="pl-6 flex flex-wrap gap-2">
							{medicalConditions.map(
								(
									condition: { name: string; selected: boolean },
									index: number,
								) =>
									condition.selected && (
										<Badge
											key={index as number}
											variant="secondary"
											className="text-xs bg-red-100 text-red-800"
										>
											{condition.name}
										</Badge>
									),
							)}
						</div>
					</div>
				)}

				{/* Current Diet Plan */}
				{userProfile.dietPlan && (
					<div className="p-4 bg-yellow-50/50 border border-yellow-200 rounded-lg">
						<div className="flex items-center gap-2 text-yellow-800 mb-2">
							<Utensils className="h-4 w-4" />
							<span className="text-sm font-medium">
								Currently Assigned Diet
							</span>
						</div>
						<p className="text-sm font-semibold text-yellow-900">
							{userProfile.dietPlan.name}
						</p>
						{userProfile.dietPlan.description && (
							<p className="text-xs text-yellow-700 mt-1">
								{userProfile.dietPlan.description}
							</p>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
