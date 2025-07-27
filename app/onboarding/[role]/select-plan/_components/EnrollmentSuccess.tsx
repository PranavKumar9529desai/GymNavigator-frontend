'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Dumbbell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  currentMembers?: number;
  genderCategory: 'MALE' | 'FEMALE' | 'OTHER' | 'ALL';
  minAge?: number;
  maxAge?: number;
}

interface GymData {
  id: number;
  name: string;
  logo: string;
}

interface EnrollmentSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  gym: GymData;
  onGoToDashboard: () => void;
}

export function EnrollmentSuccess({
  isOpen,
  onClose,
  plan,
  gym,
  onGoToDashboard
}: EnrollmentSuccessProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
    
    if (countdown === 0) {
      onGoToDashboard();
    }
  }, [isOpen, countdown, onGoToDashboard]);

  if (!plan) return null;

  return (
    <div className="mt-10 sm:mt-4 h-screen w-full sm:flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 p-4 sm:p-6">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-pulse" />
              <CheckCircle className="relative w-full h-full text-green-500 dark:text-green-400 animate-in zoom-in duration-700 delay-300" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Enrollment Successful!
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
            Welcome to {gym.name}! You're all set to start your fitness journey
          </p>

          {/* Plan Info */}
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full mb-8">
            <Dumbbell className="w-5 h-5 text-gray-500" />
            <span className="text-base text-gray-600 dark:text-gray-300">
              {plan.name} - ₹{plan.price}
            </span>
          </div>

          <div className="space-y-3 px-4 sm:px-0">
            <Button
              onClick={onGoToDashboard}
              className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-12 text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Explore More
            </Button>
          </div>

          {/* Countdown Timer */}
          <p className="text-sm text-gray-500 mt-6">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
} 