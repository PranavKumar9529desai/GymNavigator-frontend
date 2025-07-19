import { useState, useCallback } from 'react';
import type { PricingPlan, AdditionalService } from '../_action/create-pricing-plan';

export function usePricingPlan() {
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

	const addPlan = useCallback(() => {
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
		setPlans(prev => [...prev, newPlan]);
	}, [plans.length]);

	const updatePlan = useCallback((index: number, updatedPlan: PricingPlan) => {
		setPlans(prev => prev.map((plan, i) => i === index ? updatedPlan : plan));
	}, []);

	const deletePlan = useCallback((index: number) => {
		setPlans(prev => prev.filter((_, i) => i !== index));
	}, []);

	const reorderPlans = useCallback((oldIndex: number, newIndex: number) => {
		setPlans(prev => {
			const newItems = [...prev];
			const [removed] = newItems.splice(oldIndex, 1);
			newItems.splice(newIndex, 0, removed);

			// Update sort order
			return newItems.map((item, index) => ({
				...item,
				sortOrder: index + 1,
			}));
		});
	}, []);

	const addService = useCallback(() => {
		const newService: AdditionalService = {
			name: 'New Service',
			price: '0',
			duration: 'session',
			description: 'Service description',
		};
		setAdditionalServices(prev => [...prev, newService]);
	}, []);

	const updateService = useCallback((index: number, updatedService: AdditionalService) => {
		setAdditionalServices(prev => prev.map((service, i) => i === index ? updatedService : service));
	}, []);

	const deleteService = useCallback((index: number) => {
		setAdditionalServices(prev => prev.filter((_, i) => i !== index));
	}, []);

	return {
		plans,
		additionalServices,
		addPlan,
		updatePlan,
		deletePlan,
		reorderPlans,
		addService,
		updateService,
		deleteService,
	};
} 