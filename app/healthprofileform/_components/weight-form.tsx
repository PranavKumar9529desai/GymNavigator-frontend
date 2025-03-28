'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Scale } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function WeightForm() {
  const { weight, setWeight, nextStep, prevStep } = useHealthProfileStore();
  const [value, setValue] = useState<number>(weight.value || 70);
  const [unit, setUnit] = useState<'kg' | 'lb'>(weight.unit || 'kg');
  
  // Convert between kg and lb when unit changes
  useEffect(() => {
    if (unit === 'kg' && weight.unit === 'lb' && weight.value) {
      // Convert from lb to kg
      setValue(Math.round(weight.value * 0.453592));
    } else if (unit === 'lb' && weight.unit === 'kg' && weight.value) {
      // Convert from kg to lb
      setValue(Math.round(weight.value * 2.20462));
    }
  }, [unit, weight.unit, weight.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const toggleUnit = () => {
    if (unit === 'kg') {
      setUnit('lb');
      setValue(Math.round(value * 2.20462)); // kg to lb
    } else {
      setUnit('kg');
      setValue(Math.round(value * 0.453592)); // lb to kg
    }
  };

  const handleNext = () => {
    setWeight(value, unit);
    nextStep();
  };
  
  const minWeight = unit === 'kg' ? 40 : 88;
  const maxWeight = unit === 'kg' ? 200 : 440;
  
  const getWeightDisplay = () => {
    return `${value} ${unit}`;
  };

  return (
    <div className="flex flex-col min-h-[60vh] justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">What's your current weight?</h1>
        <p className="text-gray-500 mb-6">This helps us track your fitness progress</p>
        
        <div className="flex flex-col items-center justify-center space-y-8 mt-10">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Scale className="h-10 w-10 text-blue-600" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-4xl font-bold text-blue-600">{value} {unit}</p>
            </div>
          </div>
          
          <div className="w-full px-4">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={toggleUnit}
                className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                aria-label={`Switch to ${unit === 'kg' ? 'pounds' : 'kg'}`}
              >
                Switch to {unit === 'kg' ? 'pounds' : 'kg'}
              </button>
            </div>
            
            <input 
              type="range" 
              min={minWeight} 
              max={maxWeight} 
              value={value} 
              onChange={handleChange} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label={`Select weight between ${minWeight} and ${maxWeight} ${unit}`}
            />
            <div className="flex justify-between text-xs text-gray-400 px-1 mt-1">
              <span>{minWeight} {unit}</span>
              <span>{maxWeight} {unit}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-2">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          className={cn(
            "flex items-center justify-center gap-1",
            "bg-gradient-to-r from-blue-500 to-blue-600"
          )}
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
