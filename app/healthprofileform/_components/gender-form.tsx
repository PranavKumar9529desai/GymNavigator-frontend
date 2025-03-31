'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import FemaleSvg from '../_assests/female-svgrepo-com.svg';
import MaleSvg from '../_assests/male-symbol-svgrepo-com.svg';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function GenderForm() {
	const { gender, setGender, nextStep } = useHealthProfileStore();
	const [selected, setSelected] = useState<string | null>(gender || null);

	const handleNext = () => {
		if (selected) {
			setGender(selected as 'male' | 'female' | 'other');
			nextStep();
		}
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">
					What is your gender?
				</h1>
				<p className="text-gray-500 mb-6">
					This helps us personalize your fitness journey
				</p>

				<div className="grid grid-cols-1 gap-4">
					<button
						type="button"
						onClick={() => setSelected('male')}
						className={cn(
							'flex items-center p-4 rounded-xl border-2 transition-all',
							selected === 'male'
								? 'border-blue-500 bg-blue-50'
								: 'border-gray-200 hover:border-blue-200',
						)}
						aria-pressed={selected === 'male'}
					>
						<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
							<Image
								src={MaleSvg}
								alt="Male"
								width={24}
								height={24}
								className={
									selected === 'male' ? 'text-blue-600' : 'text-blue-600'
								}
							/>
						</div>
						<span className="font-medium text-gray-800">Male</span>
					</button>

					<button
						type="button"
						onClick={() => setSelected('female')}
						className={cn(
							'flex items-center p-4 rounded-xl border-2 transition-all',
							selected === 'female'
								? 'border-pink-500 bg-pink-50'
								: 'border-gray-200 hover:border-blue-200',
						)}
						aria-pressed={selected === 'female'}
					>
						<div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
							<Image
								src={FemaleSvg}
								alt="Female"
								width={24}
								height={24}
								className="text-pink-600"
							/>
						</div>
						<span className="font-medium text-gray-800">Female</span>
					</button>

					<button
						type="button"
						onClick={() => setSelected('other')}
						className={cn(
							'flex items-center p-4 rounded-xl border-2 transition-all',
							selected === 'other'
								? 'border-purple-500 bg-purple-50'
								: 'border-gray-200 hover:border-blue-200',
						)}
						aria-pressed={selected === 'other'}
					>
						<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
							<Users
								className={`h-6 w-6 ${selected === 'other' ? 'text-purple-600' : 'text-purple-600'}`}
							/>
						</div>
						<span className="font-medium text-gray-800">Other</span>
					</button>
				</div>
			</div>

			<div className="mt-8">
				<Button
					onClick={handleNext}
					disabled={!selected}
					className="w-full py-6 flex items-center justify-center gap-2 text-base bg-gradient-to-r from-blue-500 to-blue-600"
				>
					Continue <ArrowRight className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
