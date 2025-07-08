'use client';

import { Zap } from 'lucide-react';
import type { GymDetailsData } from '../_actions/get-gym-details';

interface AdditionalServicesProps {
  additionalServices: GymDetailsData['gym']['additionalServices'];
}

export function AdditionalServices({ additionalServices }: AdditionalServicesProps) {
  if (additionalServices.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-lg shadow-blue-100/20 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Additional Services</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {additionalServices.map((service) => (
          <div key={service.id} className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{service.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">₹{service.price}</div>
                <div className="text-sm text-slate-600">{service.duration}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
