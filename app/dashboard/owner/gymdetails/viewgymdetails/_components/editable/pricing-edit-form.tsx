'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import {
	Plus,
	Trash2,
	Star,
	Crown,
	Dumbbell,
	Users,
	Calendar,
	DollarSign,
	Palette,
	Sparkles,
	X,
	GripVertical,
	Target,
	Award,
	Zap,
} from 'lucide-react';
import type {
	GymData,
	FitnessPlan,
	AdditionalService,
	PricingFormData,
} from '../../types/gym-types';
import { useState, useEffect, useTransition } from 'react';
import { updateGymPricing } from '../../_actions/submit-gym-tabs-form';
import { toast } from 'sonner';

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PricingEditFormProps {
	data: GymData;
	onDataChange: (data: GymData) => void;
	onSave?: () => void;
}

// Predefined plan colors
const planColors = [
	'#3B82F6', // Blue
	'#8B5CF6', // Purple
	'#EC4899', // Pink
	'#F59E0B', // Amber
	'#10B981', // Emerald
	'#EF4444', // Red
	'#6B7280', // Gray
	'#000000', // Black
];

// Predefined icons
const planIcons = [
	{ icon: Dumbbell, name: 'dumbbell' },
	{ icon: Star, name: 'star' },
	{ icon: Crown, name: 'crown' },
	{ icon: Users, name: 'users' },
	{ icon: Target, name: 'target' },
	{ icon: Award, name: 'award' },
	{ icon: Zap, name: 'zap' },
	{ icon: Sparkles, name: 'sparkles' },
];

// Duration options
const durationOptions = [
	{ value: '/day', label: 'Per Day' },
	{ value: '/week', label: 'Per Week' },
	{ value: '/month', label: 'Per Month' },
	{ value: '/quarter', label: 'Per Quarter' },
	{ value: '/year', label: 'Per Year' },
];

// Sortable Plan Card Component
function SortablePlanCard({
	plan,
	index,
	onUpdate,
	onRemove,
}: {
	plan: FitnessPlan;
	index: number;
	onUpdate: (index: number, plan: FitnessPlan) => void;
	onRemove: (index: number) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: plan.id || `plan-${index}` });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const [showColorPicker, setShowColorPicker] = useState(false);
	const [localPlan, setLocalPlan] = useState(plan);

	// Update localPlan when plan prop changes
	useEffect(() => {
		setLocalPlan(plan);
	}, [plan]);

	const updateLocalPlan = (updates: Partial<FitnessPlan>) => {
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
		planIcons.find((icon) => icon.name === localPlan.icon)?.icon || Dumbbell;

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<motion.div
				layout
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				className="relative"
			>
				<Card
					className={`border-2 transition-all hover:shadow-lg ${
						localPlan.isFeatured || localPlan.popular
							? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/20'
							: 'border-gray-200'
					}`}
					style={{ borderColor: localPlan.color || '#e5e7eb' }}
				>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div
									{...listeners}
									className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
								>
									<GripVertical className="h-4 w-4 text-gray-400" />
								</div>
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
									<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
									onValueChange={(value) =>
										updateLocalPlan({ duration: value })
									}
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
								onChange={(e) =>
									updateLocalPlan({ description: e.target.value })
								}
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
											className={`w-8 h-8 rounded-full border-2 ${
												localPlan.color === color
													? 'border-gray-900'
													: 'border-gray-200'
											}`}
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
									<Label htmlFor={`plan-featured-${index}`}>
										Featured Plan
									</Label>
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
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}

export function PricingEditForm({
	data,
	onDataChange,
	onSave,
	mutation,
}: PricingEditFormProps) {
	const [plansFormData, setPlansFormData] = useState<FitnessPlan[]>(
		data.fitnessPlans || [],
	);
	const [additionalServices, setAdditionalServices] = useState<
		AdditionalService[]
	>([]);
	const [isPending, startTransition] = useTransition();
	const [activeTab, setActiveTab] = useState('plans');
	const [isLoadingServices, setIsLoadingServices] = useState(true);
	console.log('Initial plans data:', data);
	console.log('Initial Plans ', data.fitnessPlans);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	useEffect(() => {
		setPlansFormData(data.fitnessPlans || []);
	}, [data.fitnessPlans]);

	// Load existing additional services
	useEffect(() => {
		const loadAdditionalServices = async () => {
			try {
				setIsLoadingServices(true);
				const { getPricingData } = await import(
					'../../_actions/get-gym-tab-data'
				);
				const result = await getPricingData();

				if (result.additionalServices) {
					setAdditionalServices(result.additionalServices);
				}
			} catch (error) {
				console.error('Error loading additional services:', error);
				toast.error('Failed to load existing additional services');
			} finally {
				setIsLoadingServices(false);
			}
		};

		loadAdditionalServices();
	}, []);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = plansFormData.findIndex(
				(plan) =>
					(plan.id || `plan-${plansFormData.indexOf(plan)}`) === active.id,
			);
			const newIndex = plansFormData.findIndex(
				(plan) =>
					(plan.id || `plan-${plansFormData.indexOf(plan)}`) === over.id,
			);

			const newPlans = arrayMove(plansFormData, oldIndex, newIndex);
			setPlansFormData(newPlans);
			onDataChange({ ...data, fitnessPlans: newPlans });
		}
	};

	const addNewPlan = () => {
		const newPlan: FitnessPlan = {
			name: 'New Plan',
			description: 'Plan description',
			price: '0',
			duration: '/month',
			features: ['Basic access'],
			color: planColors[plansFormData.length % planColors.length],
			icon: 'dumbbell',
		};

		const updatedPlans = [...plansFormData, newPlan];
		setPlansFormData(updatedPlans);
		onDataChange({ ...data, fitnessPlans: updatedPlans });
	};

	const updatePlan = (index: number, updatedPlan: FitnessPlan) => {
		const updatedPlans = plansFormData.map((plan, i) =>
			i === index ? updatedPlan : plan,
		);
		setPlansFormData(updatedPlans);
		onDataChange({ ...data, fitnessPlans: updatedPlans });
	};

	const removePlan = (index: number) => {
		const updatedPlans = plansFormData.filter((_, i) => i !== index);
		setPlansFormData(updatedPlans);
		onDataChange({ ...data, fitnessPlans: updatedPlans });
	};

	const addAdditionalService = () => {
		const newService: AdditionalService = {
			name: 'New Service',
			price: '0',
			duration: 'Per session',
			description: '',
		};
		setAdditionalServices([...additionalServices, newService]);
	};

	const updateAdditionalService = (
		index: number,
		field: keyof AdditionalService,
		value: string,
	) => {
		const updatedServices = additionalServices.map((service, i) =>
			i === index ? { ...service, [field]: value } : service,
		);
		setAdditionalServices(updatedServices);
	};

	const removeAdditionalService = (index: number) => {
		setAdditionalServices(additionalServices.filter((_, i) => i !== index));
	};

	const handleSubmitPlans = async () => {
		// Use React Query mutation if available, otherwise fall back to direct action
		if (mutation) {
			try {
				// Add sortOrder to plans based on their current array position
				const plansWithSortOrder = plansFormData.map((plan, index) => ({
					...plan,
					sortOrder: index,
				}));

				const pricingData: PricingFormData = {
					plans: plansWithSortOrder,
				};

				await mutation.mutateAsync(pricingData);
				toast.success('Pricing plans updated successfully!');
				onSave?.();
			} catch (error) {
				console.error('Error updating pricing plans:', error);
				toast.error('Failed to update pricing plans. Please try again.');
			}
		} else {
			// Fallback to original implementation
			startTransition(async () => {
				try {
					// Add sortOrder to plans based on their current array position
					const plansWithSortOrder = plansFormData.map((plan, index) => ({
						...plan,
						sortOrder: index,
					}));

					const pricingData: PricingFormData = {
						plans: plansWithSortOrder,
					};

					await updateGymPricing(pricingData);
					toast.success('Pricing plans updated successfully!');
					onSave?.();
				} catch (error) {
					console.error('Error updating pricing plans:', error);
					toast.error('Failed to update pricing plans. Please try again.');
				}
			});
		}
	};

	const handleSubmitServices = async () => {
		// Use React Query mutation if available, otherwise fall back to direct action
		if (mutation) {
			try {
				const pricingData: PricingFormData = {
					additionalServices: additionalServices,
				};

				await mutation.mutateAsync(pricingData);
				toast.success('Additional services updated successfully!');
				onSave?.();
			} catch (error) {
				console.error('Error updating additional services:', error);
				toast.error('Failed to update additional services. Please try again.');
			}
		} else {
			// Fallback to original implementation
			startTransition(async () => {
				try {
					const pricingData: PricingFormData = {
						additionalServices: additionalServices,
					};

					await updateGymPricing(pricingData);
					toast.success('Additional services updated successfully!');
					onSave?.();
				} catch (error) {
					console.error('Error updating additional services:', error);
					toast.error(
						'Failed to update additional services. Please try again.',
					);
				}
			});
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold">Pricing Management</h3>
					<p className="text-sm text-gray-500">
						Create and manage your gym's pricing plans and additional services
					</p>
				</div>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="plans" className="flex items-center gap-2">
						<Dumbbell className="h-4 w-4" />
						Fitness Plans ({plansFormData.length})
					</TabsTrigger>
					<TabsTrigger value="services" className="flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						Additional Services ({additionalServices.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="plans" className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-600">
							Drag and drop to reorder plans. Featured plans will be highlighted
							to customers.
						</p>
						<div className="flex gap-2">
							<Button type="button" onClick={addNewPlan} variant="outline">
								<Plus className="h-4 w-4 mr-2" />
								Add Plan
							</Button>
						</div>
					</div>

					{plansFormData.length === 0 ? (
						<Card className="p-8 text-center">
							<div className="space-y-3">
								<Dumbbell className="h-12 w-12 mx-auto text-gray-400" />
								<h3 className="text-lg font-medium">No pricing plans yet</h3>
								<p className="text-gray-500">
									Create your first pricing plan to get started
								</p>
								<Button onClick={addNewPlan}>
									<Plus className="h-4 w-4 mr-2" />
									Create First Plan
								</Button>
							</div>
						</Card>
					) : (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={plansFormData.map(
									(plan, index) => plan.id || `plan-${index}`,
								)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-4">
									<AnimatePresence>
										{plansFormData.map((plan, index) => (
											<SortablePlanCard
												key={plan.id || `plan-${index}`}
												plan={plan}
												index={index}
												onUpdate={updatePlan}
												onRemove={removePlan}
											/>
										))}
									</AnimatePresence>
								</div>
							</SortableContext>
						</DndContext>
					)}

					{/* Save Plans Button at Bottom */}
					<div className="flex justify-center pt-8 border-t border-gray-200">
						<Button
							type="button"
							onClick={handleSubmitPlans}
							disabled={isPending || plansFormData.length === 0}
							className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium min-w-[160px] group"
						>
							{isPending ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
									Saving Plans...
								</>
							) : (
								<>
									<Dumbbell className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
									Save Plans
								</>
							)}
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="services" className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-600">
							Manage additional services like personal training, day passes,
							etc.
						</p>
						<div className="flex gap-2">
							<Button
								type="button"
								onClick={addAdditionalService}
								variant="outline"
								disabled={isLoadingServices}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Service
							</Button>
						</div>
					</div>

					{isLoadingServices ? (
						<Card className="p-8 text-center">
							<div className="space-y-3">
								<Calendar className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
								<h3 className="text-lg font-medium">Loading services...</h3>
								<p className="text-gray-500">
									Please wait while we load your additional services
								</p>
							</div>
						</Card>
					) : additionalServices.length === 0 ? (
						<Card className="p-8 text-center">
							<div className="space-y-3">
								<Calendar className="h-12 w-12 mx-auto text-gray-400" />
								<h3 className="text-lg font-medium">No additional services</h3>
								<p className="text-gray-500">
									Add services like personal training or day passes
								</p>
								<Button onClick={addAdditionalService}>
									<Plus className="h-4 w-4 mr-2" />
									Add Service
								</Button>
							</div>
						</Card>
					) : (
						<div className="grid gap-4">
							{additionalServices.map((service, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
								>
									<Card>
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<CardTitle className="text-base">
													{service.name || 'Untitled Service'}
												</CardTitle>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => removeAdditionalService(index)}
													className="text-red-500 hover:text-red-700"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												<div className="space-y-2">
													<Label>Service Name</Label>
													<Input
														value={service.name}
														onChange={(e) =>
															updateAdditionalService(
																index,
																'name',
																e.target.value,
															)
														}
														placeholder="e.g., Personal Training"
													/>
												</div>
												<div className="space-y-2">
													<Label>Price</Label>
													<div className="relative">
														<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
														<Input
															value={service.price}
															onChange={(e) =>
																updateAdditionalService(
																	index,
																	'price',
																	e.target.value,
																)
															}
															placeholder="75"
															className="pl-10"
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label>Duration</Label>
													<Input
														value={service.duration}
														onChange={(e) =>
															updateAdditionalService(
																index,
																'duration',
																e.target.value,
															)
														}
														placeholder="Per session"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label>Description (Optional)</Label>
												<Textarea
													value={service.description || ''}
													onChange={(e) =>
														updateAdditionalService(
															index,
															'description',
															e.target.value,
														)
													}
													placeholder="Describe this service..."
													rows={2}
												/>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					)}

					{/* Save Services Button at Bottom */}
					<div className="flex justify-center pt-8 border-t border-gray-200">
						<Button
							type="button"
							onClick={handleSubmitServices}
							disabled={isPending || isLoadingServices}
							className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium min-w-[160px] group"
						>
							{isPending ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
									Saving Services...
								</>
							) : (
								<>
									<Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
									Save Services
								</>
							)}
						</Button>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
