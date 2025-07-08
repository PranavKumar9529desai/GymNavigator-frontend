'use client';

import { cn } from '@/lib/utils';
import { DollarSign, Zap } from 'lucide-react';
import type { GymDetailsData } from '../_actions/get-gym-details';

interface PricingPlansProps {
  pricingPlans: GymDetailsData['gym']['pricingPlans'];
}

export function PricingPlans({ pricingPlans }: PricingPlansProps) {
  if (pricingPlans.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
          <DollarSign className="h-3 w-3 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Available Plans</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'p-6 rounded-xl border transition-all hover:shadow-lg',
              plan.isFeatured 
                ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                : 'bg-white border-blue-100 hover:border-blue-200'
            )}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{plan.name}</h3>
                {plan.isFeatured && (
                  <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1 rounded text-xs font-medium">Featured</span>
                )}
              </div>
              
              <div>
                <span className="text-3xl font-bold text-slate-800">₹{plan.price}</span>
                <span className="text-slate-600">{plan.duration}</span>
              </div>
              
              {plan.description && (
                <p className="text-sm text-slate-600 leading-relaxed">{plan.description}</p>
              )}
              
              {plan.features.length > 0 && (
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <Zap className="h-3 w-3 text-emerald-500" />
                      <span className="text-slate-700">{feature.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
