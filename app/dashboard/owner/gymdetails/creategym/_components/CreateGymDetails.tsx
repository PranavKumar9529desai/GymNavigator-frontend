'use client';
import Loader from '@/app/dashboard/owner/gymdetails/editgymdetails/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import {
	Building2,
	Image as ImageIcon,
	Mail,
	MapPin,
	Phone,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import PostGymDetails from '../PostGymDetailsSA';
import ReviewChanges from './ReviewChanges';

export const CreateGymDetailsSchema = z.object({
	gym_name: z.string().nonempty('Gym name is required'),
	gym_logo: z.string().nonempty('Gym logo is required'),
	address: z.string().nonempty('Address is required'),
	phone_number: z.string().nonempty('Phone number is required'),
	Email: z
		.string()
		.nonempty('Email is required')
		.email('Invalid email address'),
});

export type CreateGymDetailsSchemaType = z.infer<typeof CreateGymDetailsSchema>;

export default function CreateGymDetails() {
	const router = useRouter();
	const [Loading, setLoading] = useState<boolean>(false);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [reviewData, setReviewData] = useState<z.infer<typeof CreateGymDetailsSchema> | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const form = useForm<z.infer<typeof CreateGymDetailsSchema>>({
		resolver: zodResolver(CreateGymDetailsSchema),
		defaultValues: {
			gym_name: '',
			gym_logo: '',
			address: '',
			phone_number: '',
			Email: '',
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			form.setValue('gym_logo', file.name);
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = async (data: z.infer<typeof CreateGymDetailsSchema>) => {
		setReviewData(data);
		setShowReviewDialog(true);
	};

	const handleConfirmCreateGym = async (data: z.infer<typeof CreateGymDetailsSchema>) => {
		setShowReviewDialog(false);
		setLoading(true);
		setSubmitError(null);
		setSubmitSuccess(false);

		try {
			let finalImageUrl = '';

			if (logoPreview) {
				const response = await fetch('/api/uploadimage', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ image: logoPreview }),
				});
				console.log('response from the image upload', response);
				const responseData = await response.json();
				if (response.ok) {
					finalImageUrl = responseData.url;
				} else {
					throw new Error(`Image upload failed: ${responseData.error}`);
				}
			}
			console.log('finalImageUrl', finalImageUrl);
			const response = await PostGymDetails(data, finalImageUrl);

			if (response) {
				setSubmitSuccess(true);
				setTimeout(() => {
					router.push('/dashboard/owner/gymdetails/viewgymdetails');
				}, 2000);
			} else {
				throw new Error('Failed to create gym');
			}
		} catch (error) {
			setSubmitError(`An error occurred: ${(error as Error).message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelReview = () => {
		setShowReviewDialog(false);
		setReviewData(null);
	};

	if (Loading) {
		return <Loader />;
	}

	return (
		<Card className="w-full max-w-2xl mx-auto" >
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-center">Create New Gym</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="gymName">Gym Name</Label>
						<div className="relative">
							<Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<Input
								id="gym_name"
								{...form.register('gym_name')}
								placeholder="Enter gym name"
								className="pl-10"
							/>
						</div>
						{form.formState.errors.gym_name && (
							<p className="text-red-500 text-sm">{form.formState.errors.gym_name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="logo">Gym Logo</Label>
						<div className="flex items-center space-x-4">
							<div className="w-24 h-24 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0">
								{logoPreview ? (
									<Image
										src={logoPreview}
										alt="Logo preview"
										width={96}
										height={96}
										className="w-full h-full object-cover"
									/>
								) : (
									<ImageIcon className="text-gray-400" />
								)}
							</div>
							<div className="flex-1">
								<Input
									id="gym_logo"
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="flex-1"
								/>
							</div>
						</div>
						{form.formState.errors.gym_logo && (
							<p className="text-red-500 text-sm">{form.formState.errors.gym_logo.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">Address</Label>
						<div className="relative">
							<MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
							<Textarea
								id="address"
								{...form.register('address')}
								placeholder="Enter gym address"
								className="pl-10 min-h-[80px] resize-none"
							/>
						</div>
						{form.formState.errors.address && (
							<p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<div className="relative">
								<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<Input
									id="phone_number"
									{...form.register('phone_number')}
									type="tel"
									placeholder="Enter phone number"
									className="pl-10"
								/>
							</div>
							{form.formState.errors.phone_number && (
								<p className="text-red-500 text-sm">{form.formState.errors.phone_number.message}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<Input
									id="Email"
									{...form.register('Email')}
									type="email"
									placeholder="Enter email address"
									className="pl-10"
								/>
							</div>
							{form.formState.errors.Email && (
								<p className="text-red-500 text-sm">{form.formState.errors.Email.message}</p>
							)}
						</div>
					</div>

					<Button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base"
					>
						Create Gym
					</Button>
				</form>
				{submitSuccess && (
					<div className="mt-4 text-center text-green-500">Gym created successfully! Redirecting...</div>
				)}
				{submitError && (
					<div className="mt-4 text-center text-red-500">{submitError}</div>
				)}

				{reviewData && (
					<ReviewChanges
						isOpen={showReviewDialog}
						data={reviewData}
						logoPreview={logoPreview}
						onConfirm={() => handleConfirmCreateGym(reviewData)}
						onCancel={handleCancelReview}
					/>
				)}
			</CardContent>
		</Card>
	);
}
