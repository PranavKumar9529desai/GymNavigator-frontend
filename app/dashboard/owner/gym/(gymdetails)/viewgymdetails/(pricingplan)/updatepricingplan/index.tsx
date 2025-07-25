'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { usePricingData } from './hooks/usePricingData';
import { PricingEditForm } from './components/PricingEditForm';
import { Loading, FeedbackError } from '../../components/Feedback';
import type { GymData } from './types/pricing-types';

export default function PricingTab() {
  const router = useRouter();
  const { gymData, setGymData, loading, error, refetch } = usePricingData();

  const handleDataChange = (updatedData: GymData) => {
    setGymData(updatedData);
  };

  const handleSave = () => {
    toast.success('Pricing updated successfully!');
    router.push('/dashboard/owner/gym/viewgymdetails');
    // Optionally navigate back or stay on the page
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) return <Loading message="Loading gym data..." />;
  if (error || !gymData)
    return (
      <FeedbackError
        message={error || 'Failed to load gym data'}
        onRetry={refetch}
        onGoBack={handleGoBack}
      />
    );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Update Pricing Plans
            </h1>
            <p className="text-slate-600">
              Set up your gym's pricing structure
            </p>
          </div>
        </div>
      </div>
      {/* Page Title and Pricing Edit Form */}
      <Card>
        <CardContent className="p-6">
          <PricingEditForm
            data={gymData}
            onDataChange={handleDataChange}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  );
} 