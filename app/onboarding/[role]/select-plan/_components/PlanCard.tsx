import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Dumbbell, Heart, Star, Zap, Target, Users, Calendar } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration: string;
  features: Array<{ id: number; description: string }>;
  planTimeSlots: Array<{ id: number; startTime: string; endTime: string }>;
  isFeatured?: boolean;
  color?: string;
  icon?: string;
  maxMembers?: number;
  genderCategory: 'MALE' | 'FEMALE' | 'OTHER' | 'ALL';
  minAge?: number;
  maxAge?: number;
}

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}

// Icon mapping for plan types
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'dumbbell': Dumbbell,
  'heart': Heart,
  'star': Star,
  'zap': Zap,
  'target': Target,
  'users': Users,
  'calendar': Calendar,
  // Add more icon mappings as needed
};

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const isFeatured = plan.isFeatured;
  
  // Get the icon component from the mapping
  const IconComponent = plan.icon ? iconMap[plan.icon.toLowerCase()] : Dumbbell;

  return (
    <Card 
      className={`relative cursor-pointer transition-all duration-200 bg-white ${
        isSelected
          ? 'border-blue-500 shadow-lg scale-105'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      } ${isFeatured ? 'ring-2 ring-blue-100' : ''}`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white border-0">
            Featured
          </Badge>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center mx-auto">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-lg font-semibold text-slate-800">{plan.name}</CardTitle>
        {plan.description && (
          <p className="text-sm text-slate-600">{plan.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price */}
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800">{plan.price}</div>
          <div className="text-sm text-slate-600">per {plan.duration}</div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-sm font-medium text-slate-800 mb-3">What's included:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature.id} className="flex items-start">
                <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-700">{feature.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Time Slots */}
        {plan.planTimeSlots.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-800 mb-3">Available Times:</h4>
            <div className="space-y-1">
              {plan.planTimeSlots.map((slot) => (
                <div key={slot.id} className="text-sm text-slate-600">
                  {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-slate-500 space-y-1">
          {plan.genderCategory !== 'ALL' && (
            <div>Gender: {plan.genderCategory}</div>
          )}
          {plan.minAge && plan.maxAge && (
            <div>Age: {plan.minAge} - {plan.maxAge} years</div>
          )}
          {plan.maxMembers && (
            <div>Max Members: {plan.maxMembers}</div>
          )}
        </div>

        {/* Select Button */}
        <Button
          variant={isSelected ? "default" : "outline"}
          className={`w-full ${
            isSelected 
              ? 'bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500' 
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          onClick={onSelect}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </Button>
      </CardContent>
    </Card>
  );
} 