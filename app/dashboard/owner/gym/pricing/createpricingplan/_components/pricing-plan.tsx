'use client';

import { useState, useCallback } from 'react';
import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	closestCenter,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
	Plus, 
	Trash2, 
	Star, 
	Settings, 
	Users, 
	Calendar,
	Tag,
	Palette,
	Image as ImageIcon,
	Check,
	X
} from 'lucide-react';
import { createPricingPlan, type PricingPlan, type AdditionalService, type PricingFormData } from '../_action/create-pricing-plan';
import { toast } from 'sonner';

interface SortablePricingPlanProps {
	plan: PricingPlan;
	index: number;
	onUpdate: (index: number, plan: PricingPlan) => void;
	onDelete: (index: number) => void;
}

function SortablePricingPlan({ plan, index, onUpdate, onDelete }: SortablePricingPlanProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: plan.id || index });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState(plan);

	const handleSave = () => {
		onUpdate(index, editData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditData(plan);
		setIsEditing(false);
	};

	const updateField = (field: keyof PricingPlan, value: any) => {
		setEditData(prev => ({ ...prev, [field]: value }));
	};

	const addFeature = () => {
		setEditData(prev => ({
			...prev,
			features: [...prev.features, '']
		}));
	};

	const updateFeature = (featureIndex: number, value: string) => {
		setEditData(prev => ({
			...prev,
			features: prev.features.map((feature, index) => 
				index === featureIndex ? value : feature
			)
		}));
	};

	const removeFeature = (featureIndex: number) => {
		setEditData(prev => ({
			...prev,
			features: prev.features.filter((_, index) => index !== featureIndex)
		}));
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`relative group cursor-grab active:cursor-grabbing ${
				isDragging ? 'z-50' : ''
			}`}
		>
			<div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 p-6">
				{/* Drag Handle */}
				<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
					<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
						<Settings className="h-3 w-3 text-white" />
					</div>
				</div>

				{/* Plan Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						{isEditing ? (
							<input
								type="text"
								value={editData.name}
								onChange={(e) => updateField('name', e.target.value)}
								className="text-xl font-bold text-slate-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 w-full"
								placeholder="Plan Name"
							/>
						) : (
							<h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
						)}
						
						{isEditing ? (
							<textarea
								value={editData.description}
								onChange={(e) => updateField('description', e.target.value)}
								className="text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 w-full mt-2"
								placeholder="Plan description"
								rows={2}
							/>
						) : (
							<p className="text-sm text-slate-600 mt-1">{plan.description}</p>
						)}
					</div>

					{/* Featured Badge */}
					{plan.isFeatured && (
						<div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium">
							<Star className="h-3 w-3" />
							Featured
						</div>
					)}
				</div>

				{/* Price and Duration */}
				<div className="flex items-center gap-4 mb-4">
					{isEditing ? (
						<div className="flex items-center gap-2">
							<span className="text-2xl font-bold text-slate-800">$</span>
							<input
								type="text"
								value={editData.price}
								onChange={(e) => updateField('price', e.target.value)}
								className="text-2xl font-bold text-slate-800 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 w-20"
								placeholder="0"
							/>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<span className="text-2xl font-bold text-slate-800">${plan.price}</span>
						</div>
					)}

					<div className="flex items-center gap-1 text-slate-600">
						<Calendar className="h-4 w-4" />
						{isEditing ? (
							<input
								type="text"
								value={editData.duration}
								onChange={(e) => updateField('duration', e.target.value)}
								className="text-sm bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 w-24"
								placeholder="month"
							/>
						) : (
							<span className="text-sm">{plan.duration}</span>
						)}
					</div>

					{plan.maxMembers && (
						<div className="flex items-center gap-1 text-slate-600">
							<Users className="h-4 w-4" />
							{isEditing ? (
								<input
									type="number"
									value={editData.maxMembers}
									onChange={(e) => updateField('maxMembers', parseInt(e.target.value) || 0)}
									className="text-sm bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 w-16"
									placeholder="0"
								/>
							) : (
								<span className="text-sm">Max {plan.maxMembers}</span>
							)}
						</div>
					)}
				</div>

				{/* Features */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Tag className="h-4 w-4 text-slate-600" />
						<span className="text-sm font-medium text-slate-700">Features</span>
					</div>
					
					{isEditing ? (
						<div className="space-y-2">
							{editData.features.map((feature, featureIndex) => (
								<div key={featureIndex} className="flex items-center gap-2">
									<Check className="h-4 w-4 text-green-500 flex-shrink-0" />
									<input
										type="text"
										value={feature}
										onChange={(e) => updateFeature(featureIndex, e.target.value)}
										className="flex-1 text-sm bg-blue-50 border border-blue-200 rounded-lg px-2 py-1"
										placeholder="Feature description"
									/>
									<button
										onClick={() => removeFeature(featureIndex)}
										className="p-1 text-red-500 hover:text-red-700"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							))}
							<button
								onClick={addFeature}
								className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
							>
								<Plus className="h-4 w-4" />
								Add Feature
							</button>
						</div>
					) : (
						<div className="space-y-2">
							{plan.features.map((feature, featureIndex) => (
								<div key={featureIndex} className="flex items-center gap-2">
									<Check className="h-4 w-4 text-green-500 flex-shrink-0" />
									<span className="text-sm text-slate-600">{feature}</span>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Color and Icon */}
				{isEditing && (
					<div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200">
						<div className="flex items-center gap-2">
							<Palette className="h-4 w-4 text-slate-600" />
							<input
								type="color"
								value={editData.color || '#3B82F6'}
								onChange={(e) => updateField('color', e.target.value)}
								className="w-8 h-8 rounded border border-slate-300"
							/>
						</div>
						<div className="flex items-center gap-2">
							<ImageIcon className="h-4 w-4 text-slate-600" />
							<input
								type="text"
								value={editData.icon || ''}
								onChange={(e) => updateField('icon', e.target.value)}
								className="text-sm bg-blue-50 border border-blue-200 rounded-lg px-2 py-1"
								placeholder="Icon name"
							/>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
					{isEditing ? (
						<>
							<button
								onClick={handleSave}
								className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								<Check className="h-4 w-4" />
								Save
							</button>
							<button
								onClick={handleCancel}
								className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
							>
								<X className="h-4 w-4" />
								Cancel
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => setIsEditing(true)}
								className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
							>
								<Settings className="h-4 w-4" />
								Edit
							</button>
							<button
								onClick={() => onDelete(index)}
								className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
							>
								<Trash2 className="h-4 w-4" />
								Delete
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default function CreatePricingPlan() {
	const [plans, setPlans] = useState<PricingPlan[]>([
		{
			id: 1,
			name: 'Basic Plan',
			description: 'Perfect for beginners',
			price: '29',
			duration: 'month',
			features: ['Access to gym equipment', 'Basic classes', 'Locker room access'],
			isFeatured: false,
			color: '#3B82F6',
			icon: 'dumbbell',
			maxMembers: 100,
			sortOrder: 1,
		},
		{
			id: 2,
			name: 'Premium Plan',
			description: 'For serious fitness enthusiasts',
			price: '59',
			duration: 'month',
			features: ['All Basic features', 'Personal training sessions', 'Nutrition consultation', 'Spa access'],
			isFeatured: true,
			color: '#10B981',
			icon: 'star',
			maxMembers: 50,
			sortOrder: 2,
		},
		{
			id: 3,
			name: 'Elite Plan',
			description: 'Ultimate fitness experience',
			price: '99',
			duration: 'month',
			features: ['All Premium features', 'Unlimited personal training', 'Private locker', 'Priority booking'],
			isFeatured: false,
			color: '#8B5CF6',
			icon: 'crown',
			maxMembers: 25,
			sortOrder: 3,
		},
	]);

	const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([
		{
			name: 'Personal Training',
			price: '75',
			duration: 'session',
			description: 'One-on-one training with certified trainers',
		},
		{
			name: 'Nutrition Consultation',
			price: '50',
			duration: 'session',
			description: 'Customized nutrition plans and guidance',
		},
	]);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setPlans((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				const newItems = [...items];
				const [removed] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, removed);

				// Update sort order
				return newItems.map((item, index) => ({
					...item,
					sortOrder: index + 1,
				}));
			});
		}
	}, []);

	const addPlan = () => {
		const newPlan: PricingPlan = {
			id: Date.now(),
			name: 'New Plan',
			description: 'Plan description',
			price: '0',
			duration: 'month',
			features: ['Feature 1'],
			isFeatured: false,
			color: '#3B82F6',
			icon: 'plus',
			maxMembers: 100,
			sortOrder: plans.length + 1,
		};
		setPlans([...plans, newPlan]);
	};

	const updatePlan = (index: number, updatedPlan: PricingPlan) => {
		setPlans(prev => prev.map((plan, i) => i === index ? updatedPlan : plan));
	};

	const deletePlan = (index: number) => {
		setPlans(prev => prev.filter((_, i) => i !== index));
	};

	const addService = () => {
		const newService: AdditionalService = {
			name: 'New Service',
			price: '0',
			duration: 'session',
			description: 'Service description',
		};
		setAdditionalServices([...additionalServices, newService]);
	};

	const updateService = (index: number, updatedService: AdditionalService) => {
		setAdditionalServices(prev => prev.map((service, i) => i === index ? updatedService : service));
	};

	const deleteService = (index: number) => {
		setAdditionalServices(prev => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		
		try {
			const pricingData: PricingFormData = {
				plans,
				additionalServices,
			};

			const result = await createPricingPlan(pricingData);

			if (result.success) {
				toast.success('Pricing plan created successfully!');
			} else {
				toast.error(result.error || 'Failed to create pricing plan');
			}
		} catch (error) {
			toast.error('An unexpected error occurred');
			console.error('Error submitting pricing plan:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-4">
						<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
							<Tag className="h-4 w-4 text-white" />
						</div>
						<h1 className="text-2xl font-bold text-slate-800">Create Pricing Plans</h1>
					</div>
					<p className="text-slate-600 max-w-2xl mx-auto">
						Design your gym's pricing structure with our drag-and-drop interface. 
						Create plans, set features, and organize them exactly how you want.
					</p>
				</div>

				{/* Pricing Plans Section */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-slate-800">Pricing Plans</h2>
						<button
							onClick={addPlan}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Plus className="h-4 w-4" />
							Add Plan
						</button>
					</div>

					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext items={plans.map(plan => plan.id || 0)} strategy={verticalListSortingStrategy}>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{plans.map((plan, index) => (
									<SortablePricingPlan
										key={plan.id}
										plan={plan}
										index={index}
										onUpdate={updatePlan}
										onDelete={deletePlan}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				</div>

				{/* Additional Services Section */}
				<div className="mt-12 space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-slate-800">Additional Services</h2>
						<button
							onClick={addService}
							className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							<Plus className="h-4 w-4" />
							Add Service
						</button>
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{additionalServices.map((service, index) => (
							<ServiceCard
								key={index}
								service={service}
								index={index}
								onUpdate={updateService}
								onDelete={deleteService}
							/>
						))}
					</div>
				</div>

				{/* Submit Button */}
				<div className="mt-12 text-center">
					<button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Creating...' : 'Create Pricing Plans'}
					</button>
				</div>
			</div>
		</div>
	);
}

// Service Card Component
interface ServiceCardProps {
	service: AdditionalService;
	index: number;
	onUpdate: (index: number, service: AdditionalService) => void;
	onDelete: (index: number) => void;
}

function ServiceCard({ service, index, onUpdate, onDelete }: ServiceCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState(service);

	const handleSave = () => {
		onUpdate(index, editData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditData(service);
		setIsEditing(false);
	};

	const updateField = (field: keyof AdditionalService, value: string) => {
		setEditData(prev => ({ ...prev, [field]: value }));
	};

	return (
		<div className="bg-white rounded-lg border border-green-100 p-4 hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between mb-3">
				{isEditing ? (
					<input
						type="text"
						value={editData.name}
						onChange={(e) => updateField('name', e.target.value)}
						className="text-lg font-semibold text-slate-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-full"
						placeholder="Service name"
					/>
				) : (
					<h3 className="text-lg font-semibold text-slate-800">{service.name}</h3>
				)}
			</div>

			<div className="flex items-center gap-2 mb-3">
				<span className="text-xl font-bold text-green-600">${service.price}</span>
				<span className="text-sm text-slate-600">per {service.duration}</span>
			</div>

			{isEditing ? (
				<textarea
					value={editData.description || ''}
					onChange={(e) => updateField('description', e.target.value)}
					className="text-sm text-slate-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-full"
					placeholder="Service description"
					rows={2}
				/>
			) : (
				<p className="text-sm text-slate-600">{service.description}</p>
			)}

			<div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
				{isEditing ? (
					<>
						<button
							onClick={handleSave}
							className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							<Check className="h-4 w-4" />
							Save
						</button>
						<button
							onClick={handleCancel}
							className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
						>
							<X className="h-4 w-4" />
							Cancel
						</button>
					</>
				) : (
					<>
						<button
							onClick={() => setIsEditing(true)}
							className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
						>
							<Settings className="h-4 w-4" />
							Edit
						</button>
						<button
							onClick={() => onDelete(index)}
							className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
						>
							<Trash2 className="h-4 w-4" />
							Delete
						</button>
					</>
				)}
			</div>
		</div>
	);
}
