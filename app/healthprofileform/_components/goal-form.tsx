'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useHealthProfileStore, type GoalType } from '../_store/health-profile-store';

const goalOptions: { value: GoalType; label: string; description: string }[] = [
  { 
    value: 'fat-loss', 
    label: 'Fat Loss', 
    description: 'Focus on reducing body fat percentage'
  },
  { 
    value: 'muscle-building', 
    label: 'Muscle Building', 
    description: 'Focus on building muscle mass and strength'
  },
  { 
    value: 'muscle-building-with-fat-loss', 
    label: 'Muscle Building with Fat Loss', 
    description: 'Aim to build muscle while reducing body fat (body recomposition)'
  },
  { 
    value: 'bodybuilding', 
    label: 'Bodybuilding', 
    description: 'Competitive bodybuilding focused on aesthetics and physique'
  },
  { 
    value: 'maintenance', 
    label: 'Maintenance', 
    description: 'Maintain current body composition and fitness level'
  },
  { 
    value: 'general-fitness', 
    label: 'General Fitness', 
    description: 'Improve overall health and fitness'
  },
  { 
    value: 'other', 
    label: 'Other', 
    description: 'Specify your own fitness goal'
  },
];

export default function GoalForm() {
  const { 
    goal, 
    otherGoal,
    setGoal, 
    setOtherGoal,
    nextStep,
    prevStep
  } = useHealthProfileStore();

  const handleSubmit = () => {
    nextStep();
  };

  return (
    <div className="flex flex-col min-h-[60vh] justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Fitness Goal</h1>
        <p className="text-gray-500 mb-6">What is your primary fitness goal?</p>

        <div className="space-y-4">
          {goalOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setGoal(option.value)}
              className={cn(
                "w-full p-4 rounded-lg border flex flex-col items-start text-left",
                goal === option.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">{option.label}</span>
                {goal === option.value && (
                  <div className="h-4 w-4 rounded-full bg-blue-500" />
                )}
              </div>
              <span className="text-sm text-gray-500 mt-1">{option.description}</span>
            </button>
          ))}

          {goal === 'other' && (
            <div className="mt-4">
              <label htmlFor="otherGoal" className="block text-sm font-medium text-gray-700 mb-1">
                Please specify your fitness goal
              </label>
              <Input
                id="otherGoal"
                value={otherGoal}
                onChange={(e) => setOtherGoal(e.target.value)}
                placeholder="Enter your fitness goal"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!goal || (goal === 'other' && !otherGoal)}
          className={cn(
            "w-full py-6 flex items-center justify-center gap-2 text-base",
            "bg-gradient-to-r from-blue-500 to-blue-600"
          )}
        >
          Continue <ArrowRight className="h-5 w-5" />
        </Button>

        <Button
          onClick={prevStep}
          variant="outline"
          className="w-full py-6 flex items-center justify-center gap-2 text-base"
        >
          <ArrowLeft className="h-5 w-5" /> Go Back
        </Button>
      </div>
    </div>
  );
}
