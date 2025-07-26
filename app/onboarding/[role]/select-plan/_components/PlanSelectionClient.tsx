'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { updateSessionWithGym } from '../../../../(common)/_actions/session/updateSessionWithGym';
import type { GymInfo } from '@/types/next-auth';
import { PlanCard } from './PlanCard';
import { enrollInGym } from '../_actions/enroll-in-gym';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration: string;
  features: Array<{ id: number; description: string }>;
  planTimeSlots: Array<{ id: number; startTime: string; endTime: string }>;
  isFeatured?: boolean;
  color?: string;
  icon?: string;
  maxMembers?: number;
  genderCategory: 'MALE' | 'FEMALE' | 'OTHER' | 'ALL';
  minAge?: number;
  maxAge?: number;
}

interface GymData {
  id: number;
  name: string;
  logo: string;
}

interface PlanSelectionClientProps {
  gym: GymData;
  plans: Plan[];
  gymname: string;
  gymid: string;
  hash: string;
}

export function PlanSelectionClient({ 
  gym, 
  plans, 
  gymname, 
  gymid, 
  hash 
}: PlanSelectionClientProps) {
  const { update } = useSession();
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePlanSelect = (planId: number) => {
    setSelectedPlanId(planId);
    setErrorMessage(null);
  };

  const handleEnroll = async () => {
    if (!selectedPlanId) return;
    
    setIsEnrolling(true);
    setErrorMessage(null);
    
    try {
      await enrollInGym(gymid, selectedPlanId.toString(), hash);
      
      // Update session with gym info
      const newGym: GymInfo = {
        id: gymid,
        gym_name: gymname,
      };
      
      await updateSessionWithGym(newGym, update);
      
      // Redirect to dashboard
      router.push('/dashboard/');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to enroll in gym');
      setIsEnrolling(false);
      console.error('Error enrolling in gym:', error);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Plans Available
          </h2>
          
          <p className="text-gray-600 mb-6">
            This gym doesn't have any membership plans available at the moment. Please contact the gym directly for more information.
          </p>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gym Header */}
        <div className="text-center mb-8">
          {gym.logo && (
            <div className="mb-4">
              <img 
                src={gym.logo} 
                alt={`${gym.name} logo`}
                className="h-16 w-auto mx-auto"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to {gym.name}
          </h1>
          <p className="text-lg text-gray-600">
            Choose a membership plan that fits your needs
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              onSelect={() => handlePlanSelect(plan.id)}
            />
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-center mb-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Enrollment Button */}
        {selectedPlanId && (
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="px-8"
            >
              {isEnrolling ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enrolling...
                </>
              ) : (
                'Enroll Now'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 