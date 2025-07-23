'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mail, MessageCircle, Phone, Star, User } from 'lucide-react';
import Image from 'next/image';
import type { GymDetailsData } from '../_actions/get-gym-details';

interface TrainerInfoProps {
	trainer: GymDetailsData['trainer'];
}

export function TrainerInfo({ trainer }: TrainerInfoProps) {
	const formatPhoneNumber = (phone: string) => {
		// Remove all non-digit characters
		const cleaned = phone.replace(/\D/g, '');

		// If number starts with country code, use as is
		// If it's a 10-digit number, assume it's Indian and add +91
		if (cleaned.length === 10) {
			return `91${cleaned}`;
		}
		return cleaned;
	};

	const openWhatsApp = () => {
		if (!trainer?.contactNumber) {
			alert('Trainer contact number not available');
			return;
		}

		const formattedPhone = formatPhoneNumber(trainer.contactNumber);
		const trainerName = trainer.name || 'Trainer';

		const message = encodeURIComponent(
			`Hi ${trainerName}, I hope you're doing well! I have some questions about my fitness training and would appreciate your guidance. Could you please help me?`,
		);
		const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;

		// Open in new tab/window
		window.open(whatsappUrl, '_blank');
	};

	if (!trainer) {
		return (
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
						<User className="h-3 w-3 text-white" />
					</div>
					<h2 className="text-lg font-semibold text-slate-800">My Trainer</h2>
				</div>

				<div className="border-l-2 border-blue-200 pl-4">
					<div className="py-4">
						<User className="h-8 w-8 text-blue-300 mb-2" />
						<p className="text-slate-600 font-medium">No trainer assigned</p>
						<p className="text-xs text-slate-500 mt-1">
							Contact your gym to get a trainer assigned
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
					<User className="h-3 w-3 text-white" />
				</div>
				<h2 className="text-lg font-semibold text-slate-800">My Trainer</h2>
			</div>

			<div className="border-l-2 border-blue-200 pl-4">
				<div className="flex items-start gap-4">
					{trainer.image ? (
						<div className="relative">
							<Image
								src={trainer.image}
								alt={trainer.name}
								width={50}
								height={50}
								className="rounded-full"
							/>
						</div>
					) : (
						<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
							<User className="h-6 w-6 text-blue-600" />
						</div>
					)}

					<div className="flex-1 space-y-2">
						<div>
							<h3 className="text-lg font-bold text-slate-800">
								{trainer.name}
							</h3>
							{trainer.rating && (
								<div className="flex items-center gap-1 mt-1">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i as number}
												className={cn(
													'h-3 w-3',
													typeof trainer.rating === 'number' &&
														i < Math.floor(trainer.rating)
														? 'fill-amber-400 text-amber-400'
														: 'fill-gray-200 text-gray-200',
												)}
											/>
										))}
									</div>
									<span className="text-xs text-slate-600">
										{trainer.rating}/5
									</span>
								</div>
							)}
						</div>

						{trainer.specializations && (
							<div>
								<p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
									Specializations
								</p>
								<p className="text-sm text-slate-700">
									{trainer.specializations}
								</p>
							</div>
						)}

						{trainer.description && (
							<div>
								<p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
									About
								</p>
								<p className="text-sm text-slate-700 leading-relaxed">
									{trainer.description}
								</p>
							</div>
						)}

						<div className="flex flex-wrap gap-2 pt-1">
							{trainer.contactNumber && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="h-7 px-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
								>
									<Phone className="h-3 w-3 mr-1" />
									Call
								</Button>
							)}
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-7 px-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
							>
								<Mail className="h-3 w-3 mr-1" />
								Email
							</Button>
							{trainer.contactNumber && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={openWhatsApp}
									className="h-7 px-2 text-xs border-green-200 text-green-600 hover:bg-green-50"
								>
									<MessageCircle className="h-3 w-3 mr-1" />
									WhatsApp
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
