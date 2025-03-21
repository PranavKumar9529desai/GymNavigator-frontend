import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { m } from 'framer-motion';
import type { DietPlanInterface } from '../diet-plan-types';

interface StepOneProps {
  dietPlan: DietPlanInterface;
  setDietPlan: React.Dispatch<React.SetStateAction<DietPlanInterface>>;
}

export default function StepOne({ dietPlan, setDietPlan }: StepOneProps) {
  return (
    <m.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Diet Plan Basics</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="plan-name">
            Plan Name
          </label>
          <Input
            id="plan-name"
            value={dietPlan.name}
            onChange={(e) => setDietPlan((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Weight Loss Meal Plan"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="plan-description">
            Description
          </label>
          <Textarea
            id="plan-description"
            value={dietPlan.description}
            onChange={(e) =>
              setDietPlan((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Describe the goals and features of this diet plan..."
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="plan-target-calories">
            Target Daily Calories: {dietPlan.targetCalories}
          </label>
          <Slider
            id="plan-target-calories"
            defaultValue={[dietPlan.targetCalories]}
            max={4000}
            min={1200}
            step={100}
            onValueChange={([value]) =>
              setDietPlan((prev) => ({
                ...prev,
                targetCalories: value,
              }))
            }
          />
        </div>
      </div>
    </m.div>
  );
}
