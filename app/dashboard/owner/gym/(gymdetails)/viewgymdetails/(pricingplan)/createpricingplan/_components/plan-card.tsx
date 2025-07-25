import * as React from 'react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Plus, Trash2, Star, Palette, X } from 'lucide-react';
import {
	planColors,
	planIcons,
	durationOptions,
} from './pricing-plan-constants';
import type { PricingPlan } from '../_action/create-pricing-plan';
import { PlanTimeSlot } from '../_action/create-pricing-plan';

const genderOptions = [
	{ value: 'ALL', label: 'All' },
	{ value: 'MALE', label: 'Male' },
	{ value: 'FEMALE', label: 'Female' },
	{ value: 'OTHER', label: 'Other' },
];

const defaultCategories = ['student', 'senior', 'adult', 'child'];

export interface PlanCardProps {
	plan: PricingPlan;
	index: number;
	onUpdate: (index: number, plan: PricingPlan) => void;
	onRemove: (index: number) => void;
}

export function PlanCard({ plan, index, onUpdate, onRemove }: PlanCardProps) {
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [localPlan, setLocalPlan] = useState(plan);

	useEffect(() => {
		setLocalPlan(plan);
	}, [plan]);

	const updateLocalPlan = (updates: Partial<PricingPlan>) => {
		const updatedPlan = { ...localPlan, ...updates };
		setLocalPlan(updatedPlan);
		onUpdate(index, updatedPlan);
	};

	const addFeature = () => {
		const newFeatures = [...(localPlan.features || []), ''];
		updateLocalPlan({ features: newFeatures });
	};

	const updateFeature = (featureIndex: number, value: string) => {
		const newFeatures = [...(localPlan.features || [])];
		newFeatures[featureIndex] = value;
		updateLocalPlan({ features: newFeatures });
	};

	const removeFeature = (featureIndex: number) => {
		const newFeatures =
			localPlan.features?.filter((_, i) => i !== featureIndex) || [];
		updateLocalPlan({ features: newFeatures });
	};

	const SelectedIcon =
		planIcons.find((icon) => icon.name === localPlan.icon)?.icon ||
		planIcons[0].icon;

	// Advanced fields state helpers
	const addCategory = (category: string) => {
		if (!localPlan.categories) updateLocalPlan({ categories: [category] });
		else if (!localPlan.categories.includes(category))
			updateLocalPlan({ categories: [...localPlan.categories, category] });
	};
	const removeCategory = (category: string) => {
		if (localPlan.categories)
			updateLocalPlan({
				categories: localPlan.categories.filter((c) => c !== category),
			});
	};
	const addTimeSlot = () => {
		const newSlots = [
			...(localPlan.planTimeSlots || []),
			{ startTime: '', endTime: '' },
		];
		updateLocalPlan({ planTimeSlots: newSlots });
	};
	const updateTimeSlot = (
		i: number,
		field: 'startTime' | 'endTime',
		value: string,
	) => {
		const slots = [...(localPlan.planTimeSlots || [])];
		slots[i][field] = value;
		updateLocalPlan({ planTimeSlots: slots });
	};
	const removeTimeSlot = (i: number) => {
		const slots = (localPlan.planTimeSlots || []).filter((_, idx) => idx !== i);
		updateLocalPlan({ planTimeSlots: slots });
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="relative"
		>
			<Card
				className={`border-2 transition-all hover:shadow-lg ${localPlan.isFeatured || localPlan.popular ? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/20' : 'border-gray-200'}`}
				style={{ borderColor: localPlan.color || '#e5e7eb' }}
			>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className="p-2 rounded-lg"
								style={{
									backgroundColor: `${localPlan.color}20` || '#f3f4f620',
								}}
							>
								<SelectedIcon
									className="h-5 w-5"
									style={{ color: localPlan.color || '#6b7280' }}
								/>
							</div>
							<div>
								<CardTitle className="text-lg">
									{localPlan.name || 'Untitled Plan'}
								</CardTitle>
								{(localPlan.isFeatured || localPlan.popular) && (
									<Badge variant="secondary" className="mt-1">
										<Star className="h-3 w-3 mr-1" />
										Featured
									</Badge>
								)}
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onRemove(index)}
							className="text-red-500 hover:text-red-700"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor={`plan-name-${index}`}>Plan Name</Label>
							<Input
								id={`plan-name-${index}`}
								value={localPlan.name}
								onChange={(e) => updateLocalPlan({ name: e.target.value })}
								placeholder="e.g., Premium Plan"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`plan-price-${index}`}>Price</Label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400">
									$
								</span>
								<Input
									id={`plan-price-${index}`}
									value={localPlan.price}
									onChange={(e) => updateLocalPlan({ price: e.target.value })}
									placeholder="29.99"
									className="pl-10"
								/>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Duration</Label>
							<Select
								value={localPlan.duration}
								onValueChange={(value) => updateLocalPlan({ duration: value })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select duration" />
								</SelectTrigger>
								<SelectContent>
									{durationOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Icon</Label>
							<Select
								value={localPlan.icon || 'dumbbell'}
								onValueChange={(value) => updateLocalPlan({ icon: value })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select icon" />
								</SelectTrigger>
								<SelectContent>
									{planIcons.map((iconData) => {
										const IconComponent = iconData.icon;
										return (
											<SelectItem key={iconData.name} value={iconData.name}>
												<div className="flex items-center gap-2">
													<IconComponent className="h-4 w-4" />
													<span className="capitalize">{iconData.name}</span>
												</div>
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor={`plan-description-${index}`}>Description</Label>
						<Textarea
							id={`plan-description-${index}`}
							value={localPlan.description}
							onChange={(e) => updateLocalPlan({ description: e.target.value })}
							placeholder="Describe what this plan offers..."
							rows={2}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Theme Color</Label>
							<div className="flex gap-2 flex-wrap">
								{planColors.map((color) => (
									<button
										key={color}
										type="button"
										className={`w-8 h-8 rounded-full border-2 ${localPlan.color === color ? 'border-gray-900' : 'border-gray-200'}`}
										style={{ backgroundColor: color }}
										onClick={() => updateLocalPlan({ color })}
									/>
								))}
								<button
									type="button"
									className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50"
									onClick={() => setShowColorPicker(!showColorPicker)}
								>
									<Palette className="h-4 w-4 text-gray-400" />
								</button>
							</div>
							{showColorPicker && (
								<div className="mt-2">
									<HexColorPicker
										color={localPlan.color || '#3B82F6'}
										onChange={(color) => updateLocalPlan({ color })}
									/>
								</div>
							)}
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label htmlFor={`plan-featured-${index}`}>Featured Plan</Label>
								<Switch
									id={`plan-featured-${index}`}
									checked={localPlan.isFeatured || localPlan.popular || false}
									onCheckedChange={(checked) =>
										updateLocalPlan({ isFeatured: checked, popular: checked })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`plan-max-members-${index}`}>
									Max Members (Optional)
								</Label>
								<Input
									id={`plan-max-members-${index}`}
									type="number"
									value={localPlan.maxMembers || ''}
									onChange={(e) =>
										updateLocalPlan({
											maxMembers: e.target.value
												? Number.parseInt(e.target.value)
												: undefined,
										})
									}
									placeholder="Unlimited"
								/>
							</div>
						</div>
					</div>
					<Separator />
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label>Features</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addFeature}
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Feature
							</Button>
						</div>
						<div className="space-y-2 max-h-48 overflow-y-auto">
							{localPlan.features?.map((feature, featureIndex) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: no unique id available
								<div key={featureIndex} className="flex gap-2">
									<Input
										value={feature}
										onChange={(e) =>
											updateFeature(featureIndex, e.target.value)
										}
										placeholder="Enter feature..."
										className="flex-1"
									/>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => removeFeature(featureIndex)}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							)) || []}
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Session Duration (minutes)</Label>
							<Input
								type="number"
								value={localPlan.sessionDuration || ''}
								onChange={(e) =>
									updateLocalPlan({
										sessionDuration: e.target.value
											? Number.parseInt(e.target.value)
											: undefined,
									})
								}
								placeholder="e.g., 60"
							/>
						</div>
						<div className="space-y-2">
							<Label>Gender Category</Label>
							<Select
								value={localPlan.genderCategory || 'ALL'}
								onValueChange={(value) =>
									updateLocalPlan({
										genderCategory: value as
											| 'MALE'
											| 'FEMALE'
											| 'OTHER'
											| 'ALL',
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select gender" />
								</SelectTrigger>
								<SelectContent>
									{genderOptions.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Min Age</Label>
							<Input
								type="number"
								value={localPlan.minAge || ''}
								onChange={(e) =>
									updateLocalPlan({
										minAge: e.target.value
											? Number.parseInt(e.target.value)
											: undefined,
									})
								}
								placeholder="e.g., 18"
							/>
						</div>
						<div className="space-y-2">
							<Label>Max Age</Label>
							<Input
								type="number"
								value={localPlan.maxAge || ''}
								onChange={(e) =>
									updateLocalPlan({
										maxAge: e.target.value
											? Number.parseInt(e.target.value)
											: undefined,
									})
								}
								placeholder="e.g., 65"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Categories</Label>
						<div className="flex flex-wrap gap-2 mb-2">
							{(localPlan.categories || []).map((category) => (
								<Badge
									key={category}
									variant="secondary"
									className="flex items-center gap-1"
								>
									{category}
									<Button
										type="button"
										size="sm"
										variant="ghost"
										onClick={() => removeCategory(category)}
									>
										<X className="h-3 w-3" />
									</Button>
								</Badge>
							))}
						</div>
						<div className="flex gap-2">
							{defaultCategories.map((category) => (
								<Button
									key={category}
									type="button"
									size="sm"
									variant="outline"
									onClick={() => addCategory(category)}
									disabled={localPlan.categories?.includes(category)}
								>
									{category}
								</Button>
							))}
							<Input
								type="text"
								placeholder="Custom category"
								onKeyDown={(e) => {
									if (e.key === 'Enter' && e.currentTarget.value.trim()) {
										addCategory(e.currentTarget.value.trim());
										e.currentTarget.value = '';
									}
								}}
								className="w-32"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Plan Time Slots</Label>
						<div className="space-y-2">
							{(localPlan.planTimeSlots || []).map((slot, i) => {
								const slotKey = `${slot.startTime}-${slot.endTime}-${i}`;
								return (
									<div key={slotKey} className="flex gap-2 items-center">
										<Input
											type="time"
											value={slot.startTime}
											onChange={(e) =>
												updateTimeSlot(i, 'startTime', e.target.value)
											}
											className="w-28"
										/>
										<span>to</span>
										<Input
											type="time"
											value={slot.endTime}
											onChange={(e) =>
												updateTimeSlot(i, 'endTime', e.target.value)
											}
											className="w-28"
										/>
										<Button
											type="button"
											size="sm"
											variant="ghost"
											onClick={() => removeTimeSlot(i)}
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
								);
							})}
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={addTimeSlot}
							>
								Add Time Slot
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
