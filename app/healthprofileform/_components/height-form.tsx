'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Ruler } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function HeightForm() {
  const { height, setHeight, nextStep, prevStep } = useHealthProfileStore();
  const [value, setValue] = useState<number>(height.value || 170);
  const [unit, setUnit] = useState<'cm' | 'ft'>(height.unit || 'cm');
  
  // Convert between cm and ft when unit changes
  useEffect(() => {
    if (unit === 'cm' && height.unit === 'ft' && height.value) {
      // Convert from ft to cm (approximate)
      setValue(Math.round(height.value * 30.48));
    } else if (unit === 'ft' && height.unit === 'cm' && height.value) {
      // Convert from cm to ft (approximate)
      setValue(Math.round(height.value / 30.48 * 10) / 10);
    }
  }, [unit, height.unit, height.value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const toggleUnit = () => {
    if (unit === 'cm') {
      setUnit('ft');
      setValue(Math.round(value / 30.48 * 10) / 10); // cm to ft
    } else {
      setUnit('cm');
      setValue(Math.round(value * 30.48)); // ft to cm
    }
  };

  const handleNext = () => {
    setHeight(value, unit);
    nextStep();
  };
  
  const minHeight = unit === 'cm' ? 140 : 4.5;
  const maxHeight = unit === 'cm' ? 220 : 7.2;
  
  const getHeightDisplay = () => {
    if (unit === 'cm') {
      return `${value} cm`;
    }
    
    const feet = Math.floor(value);
    const inches = Math.round((value - feet) * 12);
    return `${feet}'${inches}"`;
  };

  return (
    <div className="flex flex-col min-h-[60vh] justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">How tall are you?</h1>
        <p className="text-gray-500 mb-6">Your height helps us calculate your ideal body metrics</p>
        
        <div className="flex flex-col items-center justify-center space-y-8 mt-10">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Ruler className="h-10 w-10 text-blue-600" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-4xl font-bold text-blue-600">{getHeightDisplay()}</p>
            </div>
          </div>
          
          <div className="w-full px-4">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={toggleUnit}
                className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                aria-label={`Switch to ${unit === 'cm' ? 'feet' : 'cm'}`}
              >
                Switch to {unit === 'cm' ? 'feet' : 'cm'}
              </button>
            </div>
            
            <input 
              type="range" 
              min={minHeight} 
              max={maxHeight}
              step={unit === 'cm' ? 1 : 0.1}
              value={value} 
              onChange={handleChange} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label={`Select height value between ${minHeight} and ${maxHeight} ${unit}`}
            />
            <div className="flex justify-between text-xs text-gray-400 px-1 mt-1">
              <span>{minHeight}{unit === 'cm' ? 'cm' : 'ft'}</span>
              <span>{maxHeight}{unit === 'cm' ? 'cm' : 'ft'}</span>
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
