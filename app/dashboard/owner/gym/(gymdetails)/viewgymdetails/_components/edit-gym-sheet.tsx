'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, Dumbbell, MapPin, DollarSign } from 'lucide-react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';

import type { GymData } from '../types/gym-types';
import type { GymTabData } from '../hooks/useGymData';

// Import edit form components
import { OverviewEditForm } from './editable/overview-edit-form';
import { AmenitiesEditForm } from './editable/amenities-edit-form';
import { LocationEditForm } from './editable/location-edit-form';
import { PricingEditForm } from './editable/pricing-edit-form';

interface EditGymSheetProps {
	isOpen: boolean;
	onClose: () => void;
	gymData: GymData | null;
	gymTabData: GymTabData | null;
	onSave: (data: GymData) => void;
}

export function EditGymSheet({
	isOpen,
	onClose,
	gymData,
	gymTabData,
	onSave: _onSave,
}: EditGymSheetProps) {
	const [activeTab, setActiveTab] = useState('overview');
	const [formData, setFormData] = useState<GymData>(gymData || ({} as GymData));

	// Update formData when gymData prop changes
	useEffect(() => {
		setFormData(gymData || ({} as GymData));
	}, [gymData]);

	if (!gymData) return null; // Don't render if no gym data

	return (
		<>
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className="w-[400px] sm:w-[580px] overflow-y-auto z-50 ">
					<SheetHeader>
						<SheetTitle>Edit Gym Details</SheetTitle>
						<SheetDescription>
							Select a tab to edit specific gym information.
						</SheetDescription>
					</SheetHeader>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full mt-6"
					>
						<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-md bg-gray-100 p-1">
							<TabsTrigger value="overview" className=" rounded-sm">
								<TrendingUp className="mr-2 h-4 w-4" /> Overview
							</TabsTrigger>
							<TabsTrigger value="amenities" className=" rounded-sm">
								<Dumbbell className="mr-2 h-4 w-4" /> Amenities
							</TabsTrigger>
							<TabsTrigger value="location" className=" rounded-sm">
								<MapPin className="mr-2 h-4 w-4" /> Location
							</TabsTrigger>
							<TabsTrigger value="pricing" className=" rounded-sm">
								<DollarSign className="mr-2 h-4 w-4" /> Pricing
							</TabsTrigger>
						</TabsList>

						<div className="mt-4">
							<TabsContent value="overview" className="mt-0">
								<OverviewEditForm
									data={formData}
									onDataChange={setFormData}
									onSave={() => onClose()}
								/>
							</TabsContent>
							<TabsContent value="amenities" className="mt-0">
								<AmenitiesEditForm
									onSave={() => onClose()}
									onCancel={() => onClose()}
								/>
							</TabsContent>
							<TabsContent value="location" className="mt-0">
								<LocationEditForm
									data={{
										...formData,
										location: gymTabData?.location?.location,
									}}
									onDataChange={setFormData}
									onSave={() => onClose()}
								/>
							</TabsContent>
							<TabsContent value="pricing" className="mt-0">
								<Card className="w-full max-w-md mx-auto p-8 flex flex-col items-center gap-6 shadow-none border-none">
									<h3 className="text-xl font-semibold text-slate-800 mb-2 flex items-center gap-2">
										{/* <DollarSign className="h-6 w-6 text-blue-500" />  */}
										Pricing & Diet Plan Options
									</h3>
									<p className="text-gray-500 text-center mb-4">
										Manage your gym's pricing and diet plans. Choose an action
										below:
									</p>
									<div className="flex flex-col  gap-4 justify-center">
										<Button
											className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 text-base font-medium flex items-center gap-2 w-auto"
											onClick={() => {
												window.location.href =
													'/dashboard/owner/gym/viewgymdetails/createpricingplan';
											}}
										>
											<DollarSign className="h-5 w-5" />
											Create Price Plan
										</Button>
										<Button
											className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-lg shadow hover:from-green-600 hover:to-emerald-600 text-base font-medium flex items-center gap-2 w-auto"
											onClick={() => {
												window.location.href =
													'/dashboard/owner/gym/viewgymdetails/updatepricingplan';
											}}
										>
											<DollarSign className="h-5 w-5" />
											Update Pricing Plan
										</Button>
									</div>
								</Card>
							</TabsContent>
						</div>
					</Tabs>

					{/* Removed global save/cancel buttons since each form now has its own */}
				</SheetContent>
			</Sheet>
		</>
	);
}
