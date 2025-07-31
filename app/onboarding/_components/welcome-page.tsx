'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
	Users, 
	Dumbbell, 
	Calendar, 
	BarChart3, 
	Shield, 
	CheckCircle,
	ArrowRight,
	Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface WelcomePageProps {
	role: string;
}

const roleBenefits = {
	client: {
		title: 'Welcome to GymNavigator',
		subtitle: 'Your Personal Fitness Journey Starts Here',
		description: 'Join your gym and unlock a world of personalized fitness experiences. Track your progress, manage your schedule, and connect with your trainers.',
		features: [
			{
				icon: Calendar,
				title: 'Personal Dashboard',
				description: 'Access gym information and your personal fitness overview'
			},
			{
				icon: Dumbbell,
				title: 'Workout Access',
				description: 'View assigned workouts from your trainer and browse all available workouts'
			},
			{
				icon: BarChart3,
				title: 'Diet & Nutrition',
				description: 'View assigned diet plans, access grocery lists, and get eating out guides'
			},
			{
				icon: Users,
				title: 'Attendance Management',
				description: 'View attendance history and mark attendance using QR code scanning'
			}
		]
	},
	trainer: {
		title: 'Welcome to GymNavigator',
		subtitle: 'Empower Your Clients, Grow Your Business',
		description: 'Join your gym as a trainer and access powerful tools to manage clients, create personalized programs, and deliver exceptional fitness experiences.',
		features: [
			{
				icon: Users,
				title: 'Client Management',
				description: 'View and manage your assigned users/clients efficiently'
			},
			{
				icon: Dumbbell,
				title: 'Workout System',
				description: 'Create custom workout plans and assign them to specific clients'
			},
			{
				icon: BarChart3,
				title: 'Diet Management',
				description: 'Create detailed diet plans, assign them to clients, and view all plans'
			},
			{
				icon: Calendar,
				title: 'Attendance Tracking',
				description: 'Monitor today\'s attendance for assigned clients and generate QR codes'
			}
		]
	},
	owner: {
		title: 'Welcome to GymNavigator',
		subtitle: 'Transform Your Gym Management',
		description: 'Join GymNavigator as a gym owner and take control of your fitness business with comprehensive management tools.',
		features: [
			{
				icon: Shield,
				title: 'Gym Management',
				description: 'View and manage gym details and settings'
			},
			{
				icon: Users,
				title: 'Trainer Management',
				description: 'View all trainers and assign users/clients to specific trainers'
			},
			{
				icon: Calendar,
				title: 'User Onboarding',
				description: 'Onboard new users with QR codes and manage onboarded users'
			},
			{
				icon: BarChart3,
				title: 'Attendance Oversight',
				description: 'View today\'s attendance across the gym and generate QR codes'
			}
		]
	}
};

export default function WelcomePage({ role }: WelcomePageProps) {
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
	const router = useRouter();

	const roleData = roleBenefits[role as keyof typeof roleBenefits] || roleBenefits.client;

	const handleContinue = () => {
		if (acceptedTerms && acceptedPrivacy) {
			router.push(`/onboarding/${role}/qr-scan`);
		}
	};

	const canContinue = acceptedTerms && acceptedPrivacy;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 p-4">
			<div className="container mx-auto max-w-4xl">
				{/* Header */}
				<div className="flex flex-col items-center space-y-6 mb-8 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
					<div className="relative h-16 w-16 sm:h-20 sm:w-20">
						<Image
							src="/android-chrome-512x512.png"
							alt="GymNavigator Logo"
							fill
							priority
							className="object-contain"
						/>
					</div>
					<div className="text-center sm:text-left">
						<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
							<span className="text-slate-800">Gym</span>
							<span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
								Navigator
							</span>
						</h1>
						<p className="text-slate-600 text-sm mt-1">
							Your Ultimate Gym Management Solution
						</p>
					</div>
				</div>

				{/* Role Badge */}
				<div className="flex justify-center mb-6">
					<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm px-4 py-2">
						Onboarding as {role.charAt(0).toUpperCase() + role.slice(1)}
					</Badge>
				</div>

				{/* Welcome Card */}
				<Card className="mb-6 border-blue-100 bg-white/80 backdrop-blur-sm">
					<CardHeader className="text-center pb-4">
						<div className="mx-auto mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 w-12 h-12 rounded-full flex items-center justify-center">
							<Star className="h-6 w-6 text-white" />
						</div>
						<CardTitle className="text-xl font-bold text-slate-800">
							{roleData.title}
						</CardTitle>
						<p className="text-slate-600 font-medium">
							{roleData.subtitle}
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-slate-600 leading-relaxed">
							{roleData.description}
						</p>
					</CardContent>
				</Card>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
					{roleData.features.map((feature) => (
						<Card key={feature.title} className="border-blue-100 bg-white/60 backdrop-blur-sm">
							<CardContent className="p-4">
								<div className="flex items-start space-x-3">
									<div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center flex-shrink-0">
										<feature.icon className="h-5 w-5 text-white" />
									</div>
									<div>
										<h3 className="font-semibold text-slate-800 mb-1">
											{feature.title}
										</h3>
										<p className="text-sm text-slate-600">
											{feature.description}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Terms and Conditions */}
				<Card className="mb-6 border-orange-100 bg-orange-50/30">
					<CardHeader>
						<CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
							<Shield className="h-5 w-5 text-orange-600" />
							Terms & Conditions
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-start space-x-3">
								<Checkbox
									id="terms"
									checked={acceptedTerms}
									onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
									className="mt-1"
								/>
								<label htmlFor="terms" className="text-sm text-slate-700 leading-relaxed">
									I accept the{' '}
									<Link 
										href="/terms" 
										target="_blank" 
										className="text-blue-600 hover:text-blue-700 underline font-medium"
									>
										Terms of Service
									</Link>
									{' '}and agree to comply with all applicable terms and conditions.
								</label>
							</div>
							<div className="flex items-start space-x-3">
								<Checkbox
									id="privacy"
									checked={acceptedPrivacy}
									onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
									className="mt-1"
								/>
								<label htmlFor="privacy" className="text-sm text-slate-700 leading-relaxed">
									I have read and agree to the{' '}
									<Link 
										href="/privacy" 
										target="_blank" 
										className="text-blue-600 hover:text-blue-700 underline font-medium"
									>
										Privacy Policy
									</Link>
									{' '}regarding the collection and use of my personal information.
								</label>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Continue Button */}
				<div className="flex justify-center">
					<Button
						onClick={handleContinue}
						disabled={!canContinue}
						className="w-full max-w-md h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
					>
						{canContinue ? (
							<>
								Continue to QR Scan
								<ArrowRight className="ml-2 h-4 w-4" />
							</>
						) : (
							<>
								<CheckCircle className="mr-2 h-4 w-4" />
								Accept Terms to Continue
							</>
						)}
					</Button>
				</div>

				{/* Footer Note */}
				<div className="text-center mt-6">
					<p className="text-xs text-slate-500">
						By continuing, you agree to our terms and acknowledge our privacy policy.
					</p>
				</div>
			</div>
		</div>
	);
} 