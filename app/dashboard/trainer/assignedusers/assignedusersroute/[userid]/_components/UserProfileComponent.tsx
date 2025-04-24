'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
	type CompleteUserInfo,
	getUserCompleteInfo,
} from '../_actions/get-user-assigned-by-id';

interface UserProfileComponentProps {
	userId: string;
}

export function UserProfileComponent({ userId }: UserProfileComponentProps) {
	const router = useRouter();
	const { data } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => getUserCompleteInfo(userId),
	});

	if (!data?.success || !data.data) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500">Failed to load user information</p>
			</div>
		);
	}

	const user = data.data;
	const avatarUrl =
		user.HealthProfile?.gender === 'female'
			? 'https://avatar.iran.liara.run/public/girl'
			: 'https://avatar.iran.liara.run/public/boy';

	return (
		<div className="space-y-8 max-w-3xl mx-auto">
			{/* Navigation Button */}
			<div className=" -mx-4">
				<Button
					variant="ghost"
					className="flex items-center gap-2 hover:bg-blue-50 text-blue-600"
					onClick={() =>
						router.push('/dashboard/trainer/assignedusers/assignedusersroute')
					}
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Assigned Users
				</Button>
			</div>

			{/* Basic Information */}
			<div className="flex flex-col items-center space-y-4 p-4">
				<Avatar className="w-24 h-24 ring-2 ring-offset-2 ring-blue-200">
					<Image
						src={avatarUrl}
						alt={user.name}
						width={96}
						height={96}
						className="h-full w-full object-cover"
						priority
					/>
					<AvatarFallback className="bg-blue-50 text-blue-700">
						{user.name.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
					<p className="">{user.email}</p>
					<div className="mt-2 flex items-center justify-center gap-2">
						<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
							{user.role}
						</Badge>
						<span className="text-sm text-gray-500 text-center">
							Member since {format(new Date(user.createdAt), 'MMM yyyy')}
						</span>
					</div>
				</div>
			</div>

			{/* Health Profile */}
			{user.HealthProfile && (
				<div className="space-y-6 p-4">
					<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
						Health Profile
					</h2>
					<Separator className="bg-blue-100" />
					<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-600">Weight</p>
							<p className="text-lg font-medium text-gray-900">
								{user.HealthProfile.weightValue} {user.HealthProfile.weightUnit}
							</p>
						</div>
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-600">Height</p>
							<p className="text-lg font-medium text-gray-900">
								{user.HealthProfile.heightValue} {user.HealthProfile.heightUnit}
							</p>
						</div>
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-600">Age</p>
							<p className="text-lg font-medium text-gray-900">
								{user.HealthProfile.age} years
							</p>
						</div>
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-600">Gender</p>
							<p className="text-lg font-medium text-gray-900">
								{user.HealthProfile.gender}
							</p>
						</div>
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-600">Goal</p>
							<p className="text-lg font-medium text-gray-900">
								{user.HealthProfile.goal}
							</p>
						</div>
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-600">Activity Level</p>
							<p className="text-lg font-medium text-gray-900">
								{user.HealthProfile.activityLevel}
							</p>
						</div>
					</div>

					<div className="space-y-6 mt-6">
						<div>
							<h3 className="text-lg font-medium mb-2">Dietary Preferences</h3>
							<p className="text-blue-600">
								{user.HealthProfile.dietaryPreference}
								{user.HealthProfile.otherDietaryPreference &&
									` (${user.HealthProfile.otherDietaryPreference})`}
							</p>
						</div>

						{user.HealthProfile.religiousPreference && (
							<div>
								<h3 className="text-lg font-medium mb-2">
									Religious Preference
								</h3>
								<p className="text-blue-600">
									{user.HealthProfile.religiousPreference}
									{user.HealthProfile.otherReligiousPreference &&
										` (${user.HealthProfile.otherReligiousPreference})`}
								</p>
							</div>
						)}

						<div>
							<h3 className="text-lg font-medium mb-2">Medical Conditions</h3>
							<div className="flex flex-wrap gap-2">
								{user.HealthProfile.medicalConditions
									.filter((condition) => condition.selected)
									.map((condition) => (
										<Badge
											key={condition.id}
											variant="outline"
											className="text-blue-600"
										>
											{condition.name}
										</Badge>
									))}
								{user.HealthProfile.otherMedicalCondition && (
									<Badge variant="outline" className="text-blue-600">
										{user.HealthProfile.otherMedicalCondition}
									</Badge>
								)}
							</div>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-2">Allergies</h3>
							<div className="flex flex-wrap gap-2">
								{user.HealthProfile.allergies
									.filter((allergy) => allergy.selected)
									.map((allergy) => (
										<Badge
											key={allergy.id}
											variant="outline"
											className="text-blue-600"
										>
											{allergy.name}
										</Badge>
									))}
								{user.HealthProfile.otherAllergy && (
									<Badge variant="outline" className="text-blue-600">
										{user.HealthProfile.otherAllergy}
									</Badge>
								)}
							</div>
						</div>

						{user.HealthProfile.dietaryRestrictions &&
							user.HealthProfile.dietaryRestrictions.length > 0 && (
								<div>
									<h3 className="text-lg font-medium mb-2">
										Dietary Restrictions
									</h3>
									<div className="flex flex-wrap gap-2">
										{user.HealthProfile.dietaryRestrictions.map(
											(restriction, index) => (
												<Badge
													key={index as number}
													variant="outline"
													className="text-blue-600"
												>
													{restriction}
												</Badge>
											),
										)}
									</div>
								</div>
							)}

						{user.HealthProfile.nonVegDays && (
							<div>
								<h3 className="text-lg font-medium mb-2">
									Non-Vegetarian Days
								</h3>
								<div className="flex flex-wrap gap-2">
									{user.HealthProfile.nonVegDays
										.filter((day) => day.selected)
										.map((day) => (
											<Badge
												key={day.day}
												variant="outline"
												className="text-blue-600"
											>
												{day.day}
											</Badge>
										))}
								</div>
							</div>
						)}

						<div className="grid grid-cols-3 gap-4 mt-6">
							{user.HealthProfile.bmi && (
								<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
									<p className="text-sm">BMI</p>
									<p className="text-lg font-medium text-blue-600">
										{user.HealthProfile.bmi.toFixed(1)}
									</p>
								</div>
							)}
							{user.HealthProfile.bmr && (
								<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
									<p className="text-sm">BMR</p>
									<p className="text-lg font-medium text-blue-600">
										{user.HealthProfile.bmr.toFixed(0)} kcal
									</p>
								</div>
							)}
							{user.HealthProfile.tdee && (
								<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
									<p className="text-sm">TDEE</p>
									<p className="text-lg font-medium text-blue-600">
										{user.HealthProfile.tdee.toFixed(0)} kcal
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Active Workout Plan */}
			{user.activeWorkoutPlan && (
				<div className="space-y-4 p-4">
					<h2 className="text-xl font-semibold text-gray-900">
						Active Workout Plan
					</h2>
					<Separator className="bg-blue-100" />
					<div className="bg-blue-50 p-6 rounded-lg border border-blue-100 space-y-4">
						<div>
							<p className="text-sm text-blue-600">Plan Name</p>
							<p className="text-lg font-medium text-gray-900">
								{user.activeWorkoutPlan.name}
							</p>
						</div>
						{user.activeWorkoutPlan.description && (
							<div>
								<p className="text-sm text-blue-600">Description</p>
								<p className="text-gray-700">
									{user.activeWorkoutPlan.description}
								</p>
							</div>
						)}
						<div>
							<p className="text-sm text-blue-600">Start Date</p>
							<p className="text-gray-700">
								{format(new Date(user.activeWorkoutPlan.createdAt), 'PPP')}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Diet Plan */}
			{user.DietPlan && (
				<div className="space-y-4 p-4">
					<h2 className="text-xl font-semibold text-gray-900">Diet Plan</h2>
					<Separator className="bg-blue-100" />
					<div className="bg-blue-50 p-6 rounded-lg border border-blue-100 space-y-6">
						<div>
							<p className="text-sm text-blue-600">Plan Name</p>
							<p className="text-lg font-medium text-gray-900">
								{user.DietPlan.name}
							</p>
						</div>
						{user.DietPlan.description && (
							<div>
								<p className="text-sm text-blue-600">Description</p>
								<p className="text-gray-700">{user.DietPlan.description}</p>
							</div>
						)}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="bg-white p-4 rounded-lg border border-blue-100">
								<p className="text-sm text-blue-600">Total Calories</p>
								<p className="text-lg font-medium text-gray-900">
									{user.DietPlan.totalCalories} kcal
								</p>
							</div>
							<div className="bg-white p-4 rounded-lg border border-blue-100">
								<p className="text-sm text-blue-600">Protein</p>
								<p className="text-lg font-medium text-gray-900">
									{user.DietPlan.protein}%
								</p>
							</div>
							<div className="bg-white p-4 rounded-lg border border-blue-100">
								<p className="text-sm text-blue-600">Carbs</p>
								<p className="text-lg font-medium text-gray-900">
									{user.DietPlan.carbs}%
								</p>
							</div>
							<div className="bg-white p-4 rounded-lg border border-blue-100">
								<p className="text-sm text-blue-600">Fat</p>
								<p className="text-lg font-medium text-gray-900">
									{user.DietPlan.fat}%
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
