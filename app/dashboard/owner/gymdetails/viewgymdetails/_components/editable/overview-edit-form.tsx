'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { GymData } from '../../types/gym-types';
import { useState, useEffect, useTransition } from 'react';
import { updateGymOverview } from '../../_actions/submit-gym-tabs-form';
import { toast } from 'sonner';
import { ImageIcon, Building2, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

interface OverviewEditFormProps {
	data: GymData;
	onDataChange: (data: GymData) => void;
	onSave?: () => void;
}

export function OverviewEditForm({
	data,
	onDataChange,
	onSave,
}: OverviewEditFormProps) {
	const [formData, setFormData] = useState<GymData>(data);
	const [isPending, startTransition] = useTransition();
	const [logoPreview, setLogoPreview] = useState<string | null>(
		data.gym_logo || null,
	);
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	useEffect(() => {
		setFormData(data);
		setLogoPreview(data.gym_logo || null);
	}, [data]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev: GymData) => ({
			...prev,
			[id]: value,
		}));
		onDataChange({
			...formData,
			[id]: value,
		});
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setIsUploadingImage(true);

			const reader = new FileReader();
			reader.onloadend = async () => {
				try {
					setLogoPreview(reader.result as string);

					// Upload image to Cloudinary
					const response = await fetch('/api/uploadimage', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ image: reader.result }),
					});

					const responseData = await response.json();
					if (response.ok) {
						const imageUrl = responseData.url;

						// Update form data with the image URL
						setFormData((prev: GymData) => ({
							...prev,
							gym_logo: imageUrl,
						}));
						onDataChange({
							...formData,
							gym_logo: imageUrl,
						});

						toast.success('Image uploaded successfully!');
					} else {
						throw new Error(`Image upload failed: ${responseData.error}`);
					}
				} catch (error) {
					console.error('Error uploading image:', error);
					toast.error('Failed to upload image. Please try again.');
					// Reset preview on error
					setLogoPreview(data.gym_logo || null);
				} finally {
					setIsUploadingImage(false);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		startTransition(async () => {
			try {
				const overviewData = {
					gym_name: formData.gym_name || '',
					gym_logo: formData.gym_logo || '',
					Email: formData.Email || '',
					phone_number: formData.phone_number || '',
				};

				await updateGymOverview(overviewData);
				toast.success('Overview updated successfully!');
				onSave?.();
			} catch (error) {
				console.error('Error updating overview:', error);
				toast.error('Failed to update overview. Please try again.');
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="gym_name">Gym Name</Label>
				<div className="relative">
					<Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<Input
						id="gym_name"
						value={formData.gym_name || ''}
						onChange={handleInputChange}
						placeholder="Enter gym name"
						className="pl-10"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="logo">Gym Logo</Label>
				<div className="flex items-center space-x-4">
					<div className="w-24 h-24 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0">
						{isUploadingImage ? (
							<div className="flex flex-col items-center justify-center p-2">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
								<span className="text-xs mt-1">Uploading...</span>
							</div>
						) : logoPreview ? (
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
							disabled={isUploadingImage}
						/>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="phone_number">Phone Number</Label>
					<div className="relative">
						<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<Input
							id="phone_number"
							type="tel"
							value={formData.phone_number || ''}
							onChange={handleInputChange}
							placeholder="Enter phone number"
							className="pl-10"
						/>
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="Email">Email</Label>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<Input
							id="Email"
							type="email"
							value={formData.Email || ''}
							onChange={handleInputChange}
							placeholder="Enter email address"
							className="pl-10"
						/>
					</div>
				</div>
			</div>

			<div className="flex gap-2 pt-4">
				<Button
					type="submit"
					disabled={isPending || isUploadingImage}
					className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
				>
					{isPending
						? 'Saving...'
						: isUploadingImage
							? 'Uploading Image...'
							: 'Save Overview'}
				</Button>
			</div>
		</form>
	);
}
