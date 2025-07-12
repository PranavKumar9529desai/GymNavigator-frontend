'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowRight, User } from 'lucide-react';
import { useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function FullNameForm() {
	const { fullName, setFullName, nextStep } = useHealthProfileStore();
	const [value, setValue] = useState<string>(fullName || '');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const handleNext = () => {
		if (value.trim()) {
			setFullName(value.trim());
			nextStep();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && value.trim()) {
			handleNext();
		}
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">
					What's your full name?
				</h1>
				<p className="text-gray-500 mb-6">
					We'll use this to personalize your health journey
				</p>

				<div className="flex flex-col items-center justify-center space-y-8 mt-10">
					<div className="flex flex-col items-center">
						<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
							<User className="h-10 w-10 text-blue-600" />
						</div>
						<div className="mt-4 text-center">
							<p className="text-lg font-medium text-blue-600">
								{value || 'Enter your name'}
							</p>
						</div>
					</div>

					<div className="w-full px-4">
						<Input
							type="text"
							placeholder="Enter your full name"
							value={value}
							onChange={handleChange}
							onKeyDown={handleKeyPress}
							className="w-full text-center text-lg py-6 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
							maxLength={50}
							aria-label="Enter your full name"
						/>
						<p className="text-xs text-gray-400 mt-2 text-center">
							Please enter your full name as you'd like it to appear
						</p>
					</div>
				</div>
			</div>

			<div className="mt-8">
				<Button
					onClick={handleNext}
					disabled={!value.trim()}
					className={cn(
						'w-full py-6 flex items-center justify-center gap-2 text-base',
						'bg-gradient-to-r from-blue-500 to-blue-600',
						!value.trim() && 'opacity-50 cursor-not-allowed'
					)}
				>
					Continue <ArrowRight className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
