'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function TargetWeightForm() {
  const { targetWeight, weight, setTargetWeight, nextStep, prevStep } = useHealthProfileStore();
  const [value, setValue] = useState<number>(targetWeight.value || weight.value || 65);
  const [unit, setUnit] = useState<'kg' | 'lb'>(targetWeight.unit || weight.unit || 'kg');
  
  // Convert between kg and lb when unit changes
  useEffect(() => {
    if (unit === 'kg' && targetWeight.unit === 'lb' && targetWeight.value) {
      // Convert from lb to kg
      setValue(Math.round(targetWeight.value * 0.453592));
    } else if (unit === 'lb' && targetWeight.unit === 'kg' && targetWeight.value) {
      // Convert from kg to lb
      setValue(Math.round(targetWeight.value * 2.20462));
    }
  }, [unit, targetWeight.unit, targetWeight.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const handleIncrement = () => {
    setValue(prev => prev + (unit === 'kg' ? 1 : 2));
  };

  const handleDecrement = () => {
    setValue(prev => Math.max(prev - (unit === 'kg' ? 1 : 2), unit === 'kg' ? 40 : 88));
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
    setTargetWeight(value, unit);
    nextStep();
  };
  
  const minWeight = unit === 'kg' ? 40 : 88;
  const maxWeight = unit === 'kg' ? 150 : 330;
  
  // Calculate the difference from current weight
  const getCurrentWeightInSameUnit = () => {
    if (weight.unit === unit) return weight.value || 0;
    return unit === 'kg' 
      ? Math.round((weight.value || 0) * 0.453592) // lb to kg
      : Math.round((weight.value || 0) * 2.20462); // kg to lb
  };
  
  const currentWeight = getCurrentWeightInSameUnit();
  const difference = value - currentWeight;
  const differenceText = difference > 0 
    ? `+${difference} ${unit} (gain)` 
    : difference < 0 
      ? `${difference} ${unit} (loss)` 
      : `0 ${unit} (maintain)`;

  return (
    <div className="flex flex-col min-h-[60vh] justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">What's your target weight?</h1>
        <p className="text-gray-500 mb-6">Set a realistic goal that you want to achieve</p>
        
        <div className="flex flex-col items-center justify-center space-y-8 mt-10">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="h-10 w-10 text-blue-600" />
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 mr-3"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
                <p className="text-4xl font-bold text-blue-600">{value} {unit}</p>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 ml-3"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
              </div>
              <p className={`mt-2 text-sm font-medium ${
                difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {differenceText} from current
              </p>
            </div>
          </div>
          
          <div className="w-full px-4">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={toggleUnit}
                className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
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
