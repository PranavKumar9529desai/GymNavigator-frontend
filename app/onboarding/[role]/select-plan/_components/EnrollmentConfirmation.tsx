'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Check, 
  X, 
  Clock, 
  Users, 
  Shield, 
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';

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

interface EnrollmentConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  plan: Plan | null;
  gym: GymData;
  isEnrolling: boolean;
}

export function EnrollmentConfirmation({
  isOpen,
  onClose,
  onConfirm,
  plan,
  gym,
  isEnrolling
}: EnrollmentConfirmationProps) {
  if (!plan) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done in parent component
      console.error('Enrollment error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Confirm Enrollment
          </DialogTitle>
          <DialogDescription>
            Please review your plan selection before confirming enrollment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Gym Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            {gym.logo && (
              <img 
                src={gym.logo} 
                alt={`${gym.name} logo`}
                className="h-10 w-auto"
              />
            )}
            <div>
              <h3 className="font-semibold text-slate-800">{gym.name}</h3>
              <p className="text-sm text-slate-600">Gym Membership</p>
            </div>
          </div>

          {/* Plan Summary */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-800">{plan.name}</CardTitle>
                {plan.isFeatured && (
                  <Badge className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              {plan.description && (
                <p className="text-sm text-slate-600">{plan.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-slate-800">₹{plan.price}</div>
                <div className="text-sm text-slate-600">{plan.duration}</div>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Plan Includes:
                </h4>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature) => (
                    <li key={feature.id} className="text-sm text-slate-700 flex items-start">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <Check className="w-2 h-2 text-green-600" />
                      </div>
                      {feature.description}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-sm text-slate-600 italic">
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Time Slots */}
              {plan.planTimeSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    Available Times:
                  </h4>
                  <div className="space-y-1">
                    {plan.planTimeSlots.map((slot) => (
                      <div key={slot.id} className="text-sm text-slate-600 bg-white px-2 py-1 rounded">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {plan.maxMembers && (
                <div className="bg-white p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Availability</span>
                    <span className="text-xs text-slate-500">
                      {plan.currentMembers || 0}/{plan.maxMembers} members
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full"
                      style={{ 
                        width: `${Math.round(((plan.maxMembers - (plan.currentMembers || 0)) / plan.maxMembers) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {plan.maxMembers - (plan.currentMembers || 0)} spots available
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Important Information</p>
                <ul className="text-amber-700 space-y-1 text-xs">
                  <li>• Membership starts immediately upon confirmation</li>
                  <li>• You can access gym facilities right away</li>
                  <li>• Contact gym staff for any questions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isEnrolling}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isEnrolling}
            className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500"
          >
            {isEnrolling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enrolling...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirm Enrollment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 