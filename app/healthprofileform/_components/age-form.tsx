'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function AgeForm() {
	const { age, setAge, nextStep, prevStep } = useHealthProfileStore();
	const [value, setValue] = useState<number>(age || 25);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(Number(e.target.value));
	};

	const handleNext = () => {
		setAge(value);
		nextStep();
	};

	const getAgeLabel = () => {
		if (value < 20) return 'Teen';
		if (value < 35) return 'Young adult';
		if (value < 55) return 'Adult';
		if (value < 70) return 'Senior';
		return 'Elder';
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">
					How old are you?
				</h1>
				<p className="text-gray-500 mb-6">
					Your age helps us create a program that's right for you
				</p>

				<div className="flex flex-col items-center justify-center space-y-8 mt-10">
					<div className="flex flex-col items-center">
						<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
							<Clock className="h-10 w-10 text-blue-600" />
						</div>
						<div className="mt-4 text-center">
							<p className="text-4xl font-bold text-blue-600">{value}</p>
							<p className="text-gray-500">{getAgeLabel()}</p>
						</div>
					</div>

					<div className="w-full px-4">
						<input
							type="range"
							min="16"
							max="90"
							value={value}
							onChange={handleChange}
							className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
							aria-label="Select your age"
						/>
						<div className="flex justify-between text-xs text-gray-400 px-1 mt-1">
							<span>16</span>
							<span>90</span>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 grid grid-cols-2 gap-2">
				<Button
					onClick={prevStep}
					variant="outline"
					className="flex items-center justify-center gap-1"
				>
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
				<Button
					onClick={handleNext}
					className={cn(
						'flex items-center justify-center gap-1',
						'bg-gradient-to-r from-blue-500 to-blue-600',
					)}
				>
					Continue <ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
