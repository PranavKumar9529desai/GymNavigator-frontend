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
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 shadow-lg scale-105'
          : 'hover:shadow-md'
      } ${isFeatured ? 'ring-2 ring-yellow-400' : ''}`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
            Featured
          </Badge>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="mb-2">
          <IconComponent className="w-8 h-8 mx-auto text-blue-600" />
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        {plan.description && (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price */}
        <div className="text-center">
          <div className="text-3xl font-bold">{plan.price}</div>
          <div className="text-sm text-muted-foreground">per {plan.duration}</div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-semibold mb-3">What's included:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature.id} className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Time Slots */}
        {plan.planTimeSlots.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Available Times:</h4>
            <div className="space-y-1">
              {plan.planTimeSlots.map((slot) => (
                <div key={slot.id} className="text-sm text-muted-foreground">
                  {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
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
          className="w-full"
          onClick={onSelect}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </Button>
      </CardContent>
    </Card>
  );
} 