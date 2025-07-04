'use client';

import { Badge } from '@/components/ui/badge';
import type { AmenityCategory } from '../../types/gym-types';
import type React from 'react';
import { useEffect, useState, useTransition } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAmenitiesData } from '../../_actions/amenity-actions';
import { updateGymAmenities } from '../../_actions/submit-gym-tabs-form';
import { toast } from 'sonner';
import type { UseMutationResult } from '@tanstack/react-query';

// Simplified props interface
interface AmenitiesEditFormProps {
	onSave?: () => void;
	onCancel?: () => void;
	mutation?: UseMutationResult<any, Error, any>;
}

export function AmenitiesEditForm({
	onSave,
	onCancel,
	mutation,
}: AmenitiesEditFormProps) {
	const [categories, setCategories] = useState<AmenityCategory[]>([]);
	const [selectedAmenities, setSelectedAmenities] = useState<
		Record<string, string[]>
	>({});
	const [newlySelectedAmenities, setNewlySelectedAmenities] = useState<
		string[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	// Load amenities data
	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const result = await getAmenitiesData();

				if (result.error) {
					setError(result.error);
					return;
				}

				setCategories(result.categories || []);
				setSelectedAmenities(result.selectedAmenities || {});
			} catch (_err) {
				setError('Failed to load amenities data');
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	// Get available (not selected) amenities for each category
	const getAvailableAmenities = (category: AmenityCategory) => {
		const currentlySelected = selectedAmenities[category.key] || [];
		return category.amenities.filter(
			(amenity) => !currentlySelected.includes(amenity.key),
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newlySelectedAmenities.length === 0) {
			toast.error('Please select at least one amenity to add');
			return;
		}

		// Use React Query mutation if available, otherwise fall back to direct action
		if (mutation) {
			try {
				// Combine existing and newly selected amenities
				const allSelected: string[] = [];

				// Add all existing selected amenities
				Object.values(selectedAmenities).forEach((amenityKeys) => {
					allSelected.push(...amenityKeys);
				});

				// Add newly selected amenities
				allSelected.push(...newlySelectedAmenities);

				await mutation.mutateAsync({ amenities: allSelected });
				toast.success('Amenities updated successfully!');
				onSave?.();
			} catch (error) {
				console.error('Error updating amenities:', error);
				toast.error('Failed to update amenities. Please try again.');
			}
		} else {
			// Fallback to original implementation
			startTransition(async () => {
				try {
					// Combine existing and newly selected amenities
					const allSelected: string[] = [];

					// Add all existing selected amenities
					Object.values(selectedAmenities).forEach((amenityKeys) => {
						allSelected.push(...amenityKeys);
					});

					// Add newly selected amenities
					allSelected.push(...newlySelectedAmenities);

					await updateGymAmenities({ amenities: allSelected });
					toast.success('Amenities updated successfully!');
					onSave?.();
				} catch (error) {
					console.error('Error updating amenities:', error);
					toast.error('Failed to update amenities. Please try again.');
				}
			});
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
					<span className="ml-2 text-gray-600">Loading amenities...</span>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="space-y-6">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
					<p className="text-red-600 mb-4">{error}</p>
					<Button
						onClick={() => window.location.reload()}
						variant="outline"
						className="border-red-200 text-red-600 hover:bg-red-50"
					>
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6"
			>
				<div className="flex items-center gap-3 mb-4">
					<Plus className="h-6 w-6 text-blue-600" />
					<h3 className="text-lg font-semibold text-gray-900">
						Add New Amenities
					</h3>
				</div>
				<p className="text-sm text-gray-600">
					Select from available amenities below to add to your gym. Already
					selected amenities are hidden.
				</p>
				{newlySelectedAmenities.length > 0 && (
					<div className="mt-3">
						<Badge
							variant="secondary"
							className="bg-green-100 text-green-700 border-green-200"
						>
							{newlySelectedAmenities.length} amenities selected for addition
						</Badge>
					</div>
				)}
			</motion.div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{categories.map((category) => {
					const availableAmenities = getAvailableAmenities(category);

					// Skip categories with no available amenities
					if (availableAmenities.length === 0) {
						return null;
					}

					return (
						<motion.div
							key={category.key}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="border rounded-lg shadow-sm overflow-hidden"
						>
							<div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 px-4 py-3">
								<div className="flex items-center gap-3">
									<span className="font-semibold text-gray-900">
										{category.name}
									</span>
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-700 border-blue-200"
									>
										{availableAmenities.length} available
									</Badge>
								</div>
							</div>

							<div className="p-4 space-y-3">
								<AnimatePresence>
									{availableAmenities.map((amenity, amenityIndex) => {
										const isSelected = newlySelectedAmenities.includes(
											amenity.key,
										);

										return (
											<motion.div
												key={amenity.key}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: -20 }}
												transition={{
													duration: 0.2,
													delay: amenityIndex * 0.03,
												}}
												className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md group ${
													isSelected
														? 'bg-green-50 border border-green-200 shadow-sm hover:bg-green-100'
														: 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
												}`}
											>
												<Checkbox
													checked={isSelected}
													onCheckedChange={(checked) => {
														if (checked) {
															setNewlySelectedAmenities((prev) => [
																...prev,
																amenity.key,
															]);
														} else {
															setNewlySelectedAmenities((prev) =>
																prev.filter((key) => key !== amenity.key),
															);
														}
													}}
													className="flex-shrink-0"
												/>

												<div
													className={`flex-shrink-0 w-2 h-2 rounded-full transition-colors ${
														isSelected ? 'bg-green-500' : 'bg-gray-300'
													}`}
												/>

												<div className="flex-1 min-w-0">
													<span
														className={`block font-medium transition-colors ${
															isSelected ? 'text-gray-900' : 'text-gray-600'
														}`}
													>
														{amenity.name}
													</span>
													{amenity.description && (
														<span
															className={`block text-xs mt-1 transition-colors ${
																isSelected ? 'text-gray-600' : 'text-gray-500'
															}`}
														>
															{amenity.description}
														</span>
													)}
												</div>

												{isSelected && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														exit={{ scale: 0 }}
														transition={{
															type: 'spring',
															stiffness: 500,
															damping: 30,
														}}
													>
														<Badge
															variant="secondary"
															className="bg-green-100 text-green-700 border-green-200"
														>
															<Plus className="w-3 h-3 mr-1" />
															Add
														</Badge>
													</motion.div>
												)}
											</motion.div>
										);
									})}
								</AnimatePresence>
							</div>
						</motion.div>
					);
				})}

				{categories.every(
					(category) => getAvailableAmenities(category).length === 0,
				) && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"
					>
						<div className="text-gray-400 mb-2">
							<Plus className="h-12 w-12 mx-auto" />
						</div>
						<h3 className="text-lg font-medium text-gray-600 mb-2">
							All amenities already selected
						</h3>
						<p className="text-sm text-gray-500">
							Your gym already has all available amenities. Great job!
						</p>
					</motion.div>
				)}

				<div className="flex gap-2 pt-4">
					<Button
						type="submit"
						disabled={
							(mutation ? mutation.isPending : isPending) ||
							newlySelectedAmenities.length === 0
						}
						className="flex-1"
					>
						{(mutation ? mutation.isPending : isPending) ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Adding Amenities...
							</>
						) : (
							<>
								<Plus className="w-4 h-4 mr-2" />
								Add {newlySelectedAmenities.length} Amenities
							</>
						)}
					</Button>
					{onCancel && (
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					)}
				</div>
			</form>
		</div>
	);
}
