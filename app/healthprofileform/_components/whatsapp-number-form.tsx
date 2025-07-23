'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function WhatsappNumberForm() {
	const { whatsappNumber, setWhatsappNumber, nextStep, prevStep } =
		useHealthProfileStore();
	const [value, setValue] = useState<string>(whatsappNumber || '');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Remove all non-numeric characters
		const numericValue = e.target.value.replace(/\D/g, '');
		// Limit to 10 digits
		if (numericValue.length <= 10) {
			setValue(numericValue);
		}
	};

	const handleNext = () => {
		if (isValidNumber()) {
			setWhatsappNumber(value);
			nextStep();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && isValidNumber()) {
			handleNext();
		}
	};

	const isValidNumber = () => {
		return value.length === 10 && /^[6-9]\d{9}$/.test(value);
	};

	const formatDisplayNumber = () => {
		if (value.length <= 5) return value;
		return `${value.slice(0, 5)} ${value.slice(5)}`;
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">
					What's your WhatsApp number?
				</h1>
				<p className="text-gray-500 mb-6">
					We'll use this to send you important health updates and reminders
				</p>

				<div className="flex flex-col items-center justify-center space-y-8 mt-10">
					<div className="flex flex-col items-center">
						<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
							<MessageCircle className="h-10 w-10 text-green-600" />
						</div>
						<div className="mt-4 text-center">
							<p className="text-lg font-medium text-green-600">
								{value ? `+91 ${formatDisplayNumber()}` : 'Enter your number'}
							</p>
						</div>
					</div>

					<div className="w-full px-4">
						<div className="relative">
							<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
								+91
							</div>
							<Input
								type="tel"
								placeholder="Enter 10-digit number"
								value={value}
								onChange={handleChange}
								onKeyDown={handleKeyPress}
								className={cn(
									'w-full text-center text-lg py-6 pl-16 border-2 rounded-xl',
									isValidNumber()
										? 'border-green-500 bg-green-50'
										: value
											? 'border-red-300 bg-red-50'
											: 'border-gray-200',
								)}
								maxLength={10}
								aria-label="Enter your WhatsApp number"
							/>
						</div>
						<div className="mt-2 text-center">
							{value && !isValidNumber() && (
								<p className="text-xs text-red-500">
									Please enter a valid 10-digit mobile number
								</p>
							)}
							{isValidNumber() && (
								<p className="text-xs text-green-600">✓ Valid number</p>
							)}
							{!value && (
								<p className="text-xs text-gray-400">
									Enter your mobile number without country code
								</p>
							)}
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
					disabled={!isValidNumber()}
					className={cn(
						'flex items-center justify-center gap-1',
						'bg-gradient-to-r from-blue-500 to-blue-600',
						!isValidNumber() && 'opacity-50 cursor-not-allowed',
					)}
				>
					Continue <ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
