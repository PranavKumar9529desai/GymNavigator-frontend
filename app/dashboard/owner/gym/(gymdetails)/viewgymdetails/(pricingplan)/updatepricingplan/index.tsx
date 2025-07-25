'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePricingData } from './hooks/usePricingData';
import { PlansList } from '../createpricingplan/_components/plans-list';
import { AdditionalServicesList } from '../createpricingplan/_components/additional-services-list';
import type { FitnessPlan, AdditionalService } from './types/pricing-types';

export default function UpdatePricingPlan() {
  const router = useRouter();
  const { gymData, setGymData, loading, error, refetch } = usePricingData();
  const [activeTab, setActiveTab] = useState('plans');
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (gymData) {
      setPlans(gymData.fitnessPlans || []);
      // If you fetch additionalServices separately, set them here
      // setAdditionalServices(gymData.additionalServices || []);
    }
  }, [gymData]);

  const addNewPlan = () => {
    const newPlan: FitnessPlan = {
      name: 'New Plan',
      description: 'Plan description',
      price: '0',
      duration: '/month',
      features: ['Basic access'],
      color: '#3B82F6',
      icon: 'dumbbell',
      sessionDuration: 60,
      genderCategory: 'ALL',
      minAge: 14,
      maxAge: 60,
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (index: number, updatedPlan: FitnessPlan) => {
    const updatedPlans = plans.map((plan, i) => (i === index ? updatedPlan : plan));
    setPlans(updatedPlans);
  };

  const removePlan = (index: number) => {
    setPlans(plans.filter((_, i) => i !== index));
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
          features: (plan.features || []).filter((f: string) => !!f && f.trim() !== ''),
        }));
        // TODO: Call your update API here
        // await updatePricingPlan({ plans: plansWithSortOrder, additionalServices });
        toast.success('Pricing plans updated successfully!');
        // Optionally navigate back or stay on the page
      } catch (error) {
        console.error('Error updating pricing plans:', error);
        toast.error('Failed to update pricing plans. Please try again.');
      }
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !gymData)
    return (
      <div className="p-8 text-center text-red-500">{error || 'Failed to load gym data'}</div>
    );

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
            <h1 className="text-2xl font-bold text-slate-800">Update Pricing Plans</h1>
            <p className="text-slate-600">Edit your gym's pricing structure</p>
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
              Saving Plans...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Save Pricing Plans
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 