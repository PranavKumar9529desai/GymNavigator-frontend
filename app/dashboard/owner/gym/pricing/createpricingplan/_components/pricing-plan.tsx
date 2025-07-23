'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	createPricingPlan,
	type PricingPlan,
	type AdditionalService,
} from '../_action/create-pricing-plan';
import { PlansList } from './plans-list';
import { AdditionalServicesList } from './additional-services-list';
import { planColors } from './pricing-plan-constants';

export default function CreatePricingPlan() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [activeTab, setActiveTab] = useState('plans');
	const [plans, setPlans] = useState<PricingPlan[]>([]);
	const [additionalServices, setAdditionalServices] = useState<
		AdditionalService[]
	>([]);

	const addNewPlan = () => {
		const newPlan: PricingPlan = {
			name: 'New Plan',
			description: 'Plan description',
			price: '0',
			duration: '/month',
			features: ['Basic access'],
			color: planColors[plans.length % planColors.length],
			icon: 'dumbbell',
		};
		setPlans([...plans, newPlan]);
	};

	const updatePlan = (index: number, updatedPlan: PricingPlan) => {
		const updatedPlans = plans.map((plan, i) =>
			i === index ? updatedPlan : plan,
		);
		setPlans(updatedPlans);
	};

	const removePlan = (index: number) => {
		const updatedPlans = plans.filter((_, i) => i !== index);
		setPlans(updatedPlans);
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

	const handleSubmit = async () => {
		startTransition(async () => {
			try {
				const plansWithSortOrder = plans.map((plan, index) => ({
					...plan,
					sortOrder: index,
				}));
				const pricingData = { plans: plansWithSortOrder, additionalServices };
				const result = await createPricingPlan(pricingData);
				if (result.success) {
					toast.success('Pricing plans created successfully!');
					router.push('/dashboard/owner/gym');
				} else {
					toast.error(result.error || 'Failed to create pricing plans');
				}
			} catch (error) {
				console.error('Error creating pricing plans:', error);
				toast.error('Failed to create pricing plans. Please try again.');
			}
		});
	};

	return (
		<div className="max-w-6xl mx-auto px-4">
			<div className="mb-6">
				<Button variant="ghost" onClick={() => router.back()} className="mb-4">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back
				</Button>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
						<DollarSign className="h-4 w-4 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-slate-800">
							Create Pricing Plans
						</h1>
						<p className="text-slate-600">
							Set up your gym's pricing structure
						</p>
					</div>
				</div>
			</div>
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="plans" className="flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						Fitness Plans ({plans.length})
					</TabsTrigger>
					<TabsTrigger value="services" className="flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						Additional Services ({additionalServices.length})
					</TabsTrigger>
				</TabsList>
				<TabsContent value="plans" className="space-y-4">
					<PlansList
						plans={plans}
						onAdd={addNewPlan}
						onUpdate={updatePlan}
						onRemove={removePlan}
					/>
				</TabsContent>
				<TabsContent value="services" className="space-y-4">
					<AdditionalServicesList
						services={additionalServices}
						onAdd={addAdditionalService}
						onUpdate={updateAdditionalService}
						onRemove={removeAdditionalService}
					/>
				</TabsContent>
			</Tabs>
			<div className="flex justify-center pt-8 border-t border-gray-200 mt-8">
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={
						isPending || (plans.length === 0 && additionalServices.length === 0)
					}
					className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium min-w-[160px] group"
				>
					{isPending ? (
						<>
							<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
							Creating Plans...
						</>
					) : (
						<>
							<DollarSign className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
							Create Pricing Plans
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
