'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
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
import { SingleTab } from './tabs/gym-tabs';

// Import edit form components
import { OverviewEditForm } from './editable/overview-edit-form';
import { AmenitiesEditForm } from './editable/amenities-edit-form';
import { LocationEditForm } from './editable/location-edit-form';
import { PricingEditForm } from './editable/pricing-edit-form';

interface EditGymDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	gymData: GymData | null;
	gymTabData: GymTabData | null;
	onSave: (data: GymData) => void;
}

export function EditGymDrawer({
	isOpen,
	onClose,
	gymData,
	gymTabData,
	onSave: _onSave,
}: EditGymDrawerProps) {
	const [activeTab, setActiveTab] = useState('overview');
	const [formData, setFormData] = useState<GymData>(gymData || ({} as GymData));
	console.log('the gymData in edit drawer is', gymData);
	// Update formData when gymData prop changes
	useEffect(() => {
		setFormData(gymData || ({} as GymData));
	}, [gymData]);

	if (!gymData) return null; // Don't render if no gym data

	return (
		<>
			<Drawer open={isOpen} onOpenChange={onClose}>
				<DrawerContent className="h-[90%] ">
					<DrawerHeader>
						<DrawerTitle>Edit Gym Details</DrawerTitle>
						<DrawerDescription>
							Select a tab to edit specific gym information.
						</DrawerDescription>
					</DrawerHeader>

					<div className="px-4">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full mt-2"
						>
							<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-md bg-gray-100 p-1">
								<SingleTab name="overview" label="Overview" icon={TrendingUp} />
								<SingleTab name="amenities" label="Amenities" icon={Dumbbell} />
								<SingleTab name="location" label="Location" icon={MapPin} />
								<SingleTab name="pricing" label="Pricing" icon={DollarSign} />
							</TabsList>

							<div className="px-4 mt-24 h-[calc(100vh-350px)] overflow-y-auto">
								{' '}
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
									<Card className="w-full max-w-md mx-auto p-2 flex flex-col items-center gap-6 border-none shadow-none">
										<h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
											<DollarSign className="h-6 w-6 text-blue-500" /> Pricing &
											Diet Plan Options
										</h3>
										<p className="text-gray-500 text-center mb-4">
											Manage your gym's pricing and diet plans. Choose an action
											below:
										</p>
										<div className="flex flex-col sm:flex-row gap-4 justify-center">
											<Button
												className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 text-base font-medium flex items-center gap-2 w-auto"
												onClick={() => {
													window.location.href =
														'/dashboard/owner/gym/viewgymdetails/createpricingplan';
												}}
											>
												<DollarSign className="h-5 w-5" />
												Create Diet Plan
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
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
