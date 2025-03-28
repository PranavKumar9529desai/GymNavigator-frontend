'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Activity, ArrowLeft, ArrowRight, Bike, Dumbbell, Footprints, Zap } from 'lucide-react';
import { useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function ActivityForm() {
  const { activityLevel, setActivityLevel, nextStep, prevStep } = useHealthProfileStore();
  const [selected, setSelected] = useState<string | null>(activityLevel || null);
  
  const handleNext = () => {
    if (selected) {
      setActivityLevel(selected as 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive');
      nextStep();
    }
  };

  const activities = [
    {
      id: 'sedentary',
      name: 'Sedentary',
      description: 'Little to no exercise',
      icon: <Footprints className={`h-6 w-6 ${selected === 'sedentary' ? 'text-blue-600' : 'text-gray-600'}`} />
    },
    {
      id: 'light',
      name: 'Light',
      description: 'Light exercise 1-3 days/week',
      icon: <Activity className={`h-6 w-6 ${selected === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
    },
    {
      id: 'moderate',
      name: 'Moderate',
      description: 'Moderate exercise 3-5 days/week',
      icon: <Dumbbell className={`h-6 w-6 ${selected === 'moderate' ? 'text-blue-600' : 'text-blue-500'}`} />
    },
    {
      id: 'active',
      name: 'Active',
      description: 'Hard exercise 6-7 days/week',
      icon: <Zap className={`h-6 w-6 ${selected === 'active' ? 'text-blue-600' : 'text-blue-600'}`} />
    },
    {
      id: 'veryActive',
      name: 'Very Active',
      description: 'Intense training 2x daily',
      icon: <Bike className={`h-6 w-6 ${selected === 'veryActive' ? 'text-blue-600' : 'text-blue-700'}`} />
    }
  ];

  return (
    <div className="flex flex-col min-h-[60vh] justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">What's your activity level?</h1>
        <p className="text-gray-500 mb-6">This helps us calculate your daily calorie needs</p>
        
        <div className="grid grid-cols-1 gap-3">
          {activities.map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => setSelected(activity.id)}
              className={cn(
                "flex items-center p-4 rounded-xl border-2 transition-all",
                selected === activity.id
                  ? "border-blue-500 bg-blue-50"
                  : 'border-gray-200 hover:border-blue-200'
              )}
              aria-pressed={selected === activity.id}
            >
              <div className={`w-10 h-10 ${selected === activity.id ? 'bg-blue-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mr-3`}>
                {activity.icon}
              </div>
              <div className="text-left">
                <span className="font-medium text-gray-800 block">{activity.name}</span>
                <span className="text-xs text-gray-500">{activity.description}</span>
              </div>
            </button>
          ))}
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
          disabled={!selected}
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
