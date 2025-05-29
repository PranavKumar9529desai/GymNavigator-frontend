"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GymData, FitnessPlan } from "../../types/gym-types";
import { useState, useEffect } from 'react';

interface PricingEditFormProps {
  data: GymData; // Pass the whole GymData for potential future needs
  onDataChange: (data: GymData) => void;
}

export function PricingEditForm({ data, onDataChange }: PricingEditFormProps) {
  // Assuming fitnessPlans is an array within GymData
  const [plansFormData, setPlansFormData] = useState<FitnessPlan[]>(data.fitnessPlans || []);

   useEffect(() => {
    setPlansFormData(data.fitnessPlans || []);
  }, [data.fitnessPlans]);

  const handlePlanChange = (index: number, field: keyof FitnessPlan, value: any) => {
    const updatedPlans = plansFormData.map((plan, i) =>
      i === index ? { ...plan, [field]: value } : plan
    );
    setPlansFormData(updatedPlans);
    // Pass the updated full gym data back
    onDataChange({ ...data, fitnessPlans: updatedPlans });
  };

   // This is a simplified example. A real implementation might need adding/removing plans and features.

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Edit existing pricing plans. Adding/removing not yet supported.</p>
      {plansFormData.length === 0 && <p>No pricing plans found.</p>}
      {plansFormData.map((plan, index) => (
        <div key={plan.id} className="border p-4 rounded-md space-y-3">
          <h4 className="font-semibold">{plan.name}</h4>
          <div className="space-y-2">
            <Label htmlFor={`plan-name-${index}`}>Plan Name</Label>
            <Input
              id={`plan-name-${index}`}
              value={plan.name}
              onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
              placeholder="Plan name"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor={`plan-description-${index}`}>Description</Label>
            <Input
              id={`plan-description-${index}`}
              value={plan.description}
              onChange={(e) => handlePlanChange(index, 'description', e.target.value)}
              placeholder="Plan description"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor={`plan-price-${index}`}>Price</Label>
            <Input
              id={`plan-price-${index}`}
              value={plan.price}
              onChange={(e) => handlePlanChange(index, 'price', e.target.value)}
              placeholder="Plan price"
            />
          </div>
           {/* Editing features would require a more complex component, placeholder for now */}
           <div>
              <p className="font-medium text-gray-700 text-sm mb-1">Features:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                  {plan.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex}>{feature}</li>
                  ))}
              </ul>
              {/* Add input for editing features if needed */}
           </div>
           {/* Add fields for duration, popular if needed */}
        </div>
      ))}

       {/* Additional Services - This would require a separate section/component */}
        <div className="mt-6">
            <h3 className="text-lg font-semibold">Additional Services</h3>
            <p className="text-sm text-gray-500">Editing not yet supported.</p>
            {/* Add form fields for additional services if needed */}
        </div>
    </div>
  );
} 