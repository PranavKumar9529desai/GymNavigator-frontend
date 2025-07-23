'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Phone, Mail, MapPin, Clock, TrendingUp } from 'lucide-react';

interface TrainerData {
	name: string;
	specialization: string;
	experience: string;
	rating: number;
	avatar: string;
	phone: string;
	email: string;
	nextSession?: string;
}

interface TrainerTabProps {
	trainerData: TrainerData;
}

export function TrainerTab({ trainerData }: TrainerTabProps) {
	// Helper function to safely display data or show fallback
	const displayData = (value: string | number | undefined, fallback = '-') => {
		if (value === undefined || value === null || value === '' || value === 0) {
			return fallback;
		}
		return value;
	};

	// Format rating display
	const formatRating = (rating: number) => {
		if (!rating || rating === 0) return '-';
		return `${rating}/5.0`;
	};

	// WhatsApp integration functions
	const formatPhoneNumber = (phone: string): string => {
		// Remove all non-numeric characters
		const cleanPhone = phone.replace(/\D/g, '');

		// If phone starts with country code, use as is
		// If it's a local number, you might need to add your country code
		// For example, if it's an Indian number starting with 91, use as is
		// If it starts with 0, replace with country code (e.g., +91 for India)
		if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
			return cleanPhone;
		}
		if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
			// Replace leading 0 with country code (adjust as needed)
			return `91${cleanPhone.substring(1)}`;
		}
		if (cleanPhone.length === 10) {
			// Add country code for 10-digit numbers
			return `91${cleanPhone}`;
		}

		return cleanPhone;
	};

	const openWhatsApp = (type: 'call' | 'message') => {
		if (!trainerData.phone) {
			alert('Trainer phone number not available');
			return;
		}

		const formattedPhone = formatPhoneNumber(trainerData.phone);
		const trainerName = trainerData.name || 'Trainer';

		let message = '';
		if (type === 'call') {
			message = encodeURIComponent(
				`Hi ${trainerName}, I'd like to schedule a call with you regarding my fitness training.`,
			);
		} else {
			message = encodeURIComponent(
				`Hi ${trainerName}, I have a question about my fitness training. Could you please help me?`,
			);
		}

		const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;

		// Open in new tab/window
		window.open(whatsappUrl, '_blank');
	};
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Your Personal Trainer</CardTitle>
					<CardDescription>Get to know your fitness coach</CardDescription>
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
						<Avatar className="h-16 w-16 sm:h-20 sm:w-20">
							<AvatarImage
								src={trainerData.avatar || '/placeholder.svg'}
								alt={trainerData.name || 'Trainer'}
							/>
							<AvatarFallback>
								{trainerData.name
									? trainerData.name
											.split(' ')
											.map((n) => n[0])
											.join('')
											.toUpperCase()
									: 'T'}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 text-center sm:text-left">
							<h3 className="text-lg sm:text-xl font-semibold">
								{displayData(trainerData.name, 'Unknown Trainer')}
							</h3>
							<p className="text-muted-foreground mb-2 text-sm">
								{displayData(trainerData.specialization, 'General Fitness')}
							</p>
							<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-4 text-sm">
								<span className="flex items-center">
									<Users className="h-4 w-4 mr-1" />
									{displayData(
										trainerData.experience,
										'Experience not available',
									)}
								</span>
								<span className="flex items-center">
									<TrendingUp className="h-4 w-4 mr-1" />
									{formatRating(trainerData.rating)}
								</span>
							</div>
						</div>
						<div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
							<Button
								type="button"
								size="sm"
								className="text-xs"
								onClick={() => openWhatsApp('call')}
								disabled={!trainerData.phone}
							>
								<Phone className="h-3 w-3 mr-1" />
								Call
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="text-xs bg-transparent"
								onClick={() => openWhatsApp('message')}
								disabled={!trainerData.phone}
							>
								<Mail className="h-3 w-3 mr-1" />
								Message
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-1 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Contact Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div
							className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
							onClick={() => openWhatsApp('message')}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									openWhatsApp('message');
								}
							}}
						>
							<Phone className="h-4 w-4 text-muted-foreground" />
							<span className="text-green-600 hover:text-green-700">
								{displayData(trainerData.phone, 'Phone not available')}
							</span>
						</div>
						<div className="flex items-center space-x-3 p-2">
							<Mail className="h-4 w-4 text-muted-foreground" />
							<span>
								{displayData(trainerData.email, 'Email not available')}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
