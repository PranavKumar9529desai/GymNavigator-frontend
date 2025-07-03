'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type CompleteUserInfo } from '../_actions/get-user-assigned-by-id';

interface UserProfileComponentProps {
	user: {
		success: boolean;
		data?: CompleteUserInfo;
		error?: { code: string; message: string };
	};
}

export function UserProfileComponent({ user: data }: UserProfileComponentProps) {
	const router = useRouter();

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
							<p className="text-sm text-blue-600">BMI</p>
							<p className="text-lg font-medium text-gray-900">
								{user.HealthProfile.bmi?.toFixed(1)}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Medical Conditions and Allergies */}
			{user.HealthProfile && (
				<div className="space-y-6 p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-lg font-semibold text-gray-800">Medical Conditions</h3>
							<ul className="mt-2 space-y-1 list-disc list-inside">
								{user.HealthProfile.medicalConditions
									.filter((condition) => condition.selected)
									.map((condition) => (
										<li key={condition.name} className="text-gray-700">
											{condition.name}
										</li>
									))}
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-800">Allergies</h3>
							<ul className="mt-2 space-y-1 list-disc list-inside">
								{user.HealthProfile.allergies
									.filter((allergy) => allergy.selected)
									.map((allergy) => (
										<li key={allergy.name} className="text-gray-700">
											{allergy.name}
										</li>
									))}
							</ul>
						</div>
					</div>
				</div>
			)}

			{/* Dietary Preferences */}
			{user.HealthProfile && (
				<div className="space-y-6 p-4">
					<h2 className="text-xl font-semibold text-gray-900">Dietary Preferences</h2>
					<Separator className="bg-blue-100" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<p><span className="font-semibold">Preference:</span> {user.HealthProfile.dietaryPreference}</p>
						{user.HealthProfile.dietaryRestrictions && (
							<p><span className="font-semibold">Restrictions:</span> {user.HealthProfile.dietaryRestrictions.join(', ')}</p>
						)}
					</div>
				</div>
			)}

			{/* Workout and Diet Plans */}
			<div className="space-y-6 p-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-semibold text-gray-800">Active Workout Plan</h3>
						{user.activeWorkoutPlan ? (
							<div className="mt-2 p-4 bg-green-50 border border-green-100 rounded-lg">
								<p className="font-bold text-green-800">{user.activeWorkoutPlan.name}</p>
								<p className="text-sm text-gray-600">{user.activeWorkoutPlan.description}</p>
							</div>
						) : (
							<p className="text-gray-500 mt-2">No active workout plan.</p>
						)}
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-800">Active Diet Plan</h3>
						{user.DietPlan ? (
							<div className="mt-2 p-4 bg-purple-50 border border-purple-100 rounded-lg">
								<p className="font-bold text-purple-800">{user.DietPlan.name}</p>
								<p className="text-sm text-gray-600">{user.DietPlan.description}</p>
							</div>
						) : (
							<p className="text-gray-500 mt-2">No active diet plan.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
