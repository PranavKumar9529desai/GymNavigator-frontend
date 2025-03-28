'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useHealthProfileStore } from '../_store/health-profile-store';

interface MedicalConditionsFormProps {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export default function MedicalConditionsForm({ onSubmit, isSubmitting }: MedicalConditionsFormProps) {
  const { 
    medicalConditions, 
    otherMedicalCondition, 
    toggleMedicalCondition, 
    setOtherMedicalCondition,
    prevStep 
  } = useHealthProfileStore();
  
  const [newCondition, setNewCondition] = useState('');
  
  const handleAddCondition = () => {
    if (newCondition.trim()) {
      // Instead of directly adding, set to "other" field
      setOtherMedicalCondition(newCondition.trim());
      setNewCondition('');
    }
  };
  
  const handleSubmit = async () => {
    await onSubmit();
  };
  
  return (
    <div className="flex flex-col min-h-[60vh] justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Medical Conditions</h1>
        <p className="text-gray-500 mb-6">Select any medical conditions that apply to you</p>
        
        <div className="space-y-4">
          {medicalConditions.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-3">
              <Checkbox 
                id={`condition-${condition.id}`} 
                checked={condition.selected}
                onCheckedChange={() => toggleMedicalCondition(condition.id)}
              />
              <label 
                htmlFor={`condition-${condition.id}`}
                className="text-base font-medium cursor-pointer"
              >
                {condition.name}
              </label>
            </div>
          ))}
          
          <div className="pt-4">
            <label className="text-base font-medium mb-2 block">Other condition not listed?</label>
            <div className="flex gap-2">
              <Input 
                placeholder="Type condition here" 
                value={newCondition} 
                onChange={(e) => setNewCondition(e.target.value)} 
                className="flex-grow"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddCondition} 
                disabled={!newCondition.trim()}
              >
                Add
              </Button>
            </div>
            
            {otherMedicalCondition && (
              <div className="mt-2 p-3 bg-blue-50 rounded-md text-blue-800 flex items-center">
                <Check size={16} className="mr-2" />
                <span>{otherMedicalCondition}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-6 flex items-center justify-center gap-2 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Complete Profile <Check className="h-5 w-5" />
            </>
          )}
        </Button>
        
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={isSubmitting}
          className="w-full py-6 flex items-center justify-center gap-2 text-base"
        >
          <ArrowLeft className="h-5 w-5" /> Go Back
        </Button>
      </div>
    </div>
  );
}
