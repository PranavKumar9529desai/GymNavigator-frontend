'use client';
import { Card } from '@/components/ui/card';
import { ArrowRight, Building2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function SetupScreen() {
	return (
		<div className="min-h-[80vh] flex items-center justify-center p-4">
			<Card className="max-w-md w-full p-8 text-center space-y-6">
				<div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
					<Building2 className="w-8 h-8 text-blue-500" />
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-gray-900">
						Welcome to GymNavigator
					</h1>
					<p className="text-gray-500">
						Let&apos;s get started by setting up your gym&apos;s profile.
					</p>
				</div>

				<Link
					href="/gymdetails/creategym"
					className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus className="w-4 h-4" />
					<span>Create Your Gym Profile</span>
					<ArrowRight className="w-4 h-4" />
				</Link>
			</Card>
		</div>
	);
}
