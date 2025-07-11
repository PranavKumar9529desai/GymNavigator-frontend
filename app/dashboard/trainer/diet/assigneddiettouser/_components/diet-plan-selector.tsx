"use client";

import { useState } from "react";
import { Search, Utensils, Clock, Target, ChefHat, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DietPlan {
  id: number;
  name: string;
  description: string;
  targetCalories?: number;
  proteinPercent?: number;
  carbPercent?: number;
  fatPercent?: number;
  meals: {
    id: number;
    name: string;
    mealTime: string;
    calories?: number;
    proteinPercent?: number;
    carbPercent?: number;
    fatPercent?: number;
    instructions: string;
  }[];
  createdByTrainerId?: number;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  HealthProfile: {
    dietaryPreference: string;
    mealTimes: string;
    goal: string;
    activityLevel: string;
  } | null;
}

interface DietPlanSelectorProps {
  dietPlans: DietPlan[];
  userProfile: UserProfile;
  onSelectDietPlan: (dietPlan: DietPlan) => void;
}

export function DietPlanSelector({ 
  dietPlans, 
  userProfile, 
  onSelectDietPlan 
}: DietPlanSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [selectedDietPlan, setSelectedDietPlan] = useState<DietPlan | null>(null);

  // Filter diet plans based on search and filters
  const filteredDietPlans = dietPlans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (plan.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "high-protein") return matchesSearch && (plan.proteinPercent || 0) > 25;
    if (filterBy === "low-carb") return matchesSearch && (plan.carbPercent || 0) < 30;
    if (filterBy === "balanced") return matchesSearch && 
      (plan.proteinPercent || 0) >= 20 && (plan.proteinPercent || 0) <= 30 &&
      (plan.carbPercent || 0) >= 40 && (plan.carbPercent || 0) <= 50;
    
    return matchesSearch;
  });

  // Get recommendations based on user profile
  const getRecommendations = (plan: DietPlan) => {
    const recommendations: string[] = [];
    const health = userProfile.HealthProfile;
    
    if (!health) return recommendations;

    // Check dietary preference compatibility
    if (health.dietaryPreference === "vegetarian" && plan.name.toLowerCase().includes("veg")) {
      recommendations.push("Matches dietary preference");
    }
    
    // Check goal compatibility
    if (health.goal.toLowerCase().includes("weight loss") && plan.name.toLowerCase().includes("weight loss")) {
      recommendations.push("Aligned with weight loss goal");
    }
    
    if (health.goal.toLowerCase().includes("muscle") && (plan.proteinPercent || 0) > 25) {
      recommendations.push("High protein for muscle building");
    }

    // Check meal frequency
    const userMealTimes = Number.parseInt(health.mealTimes);
    if (plan.meals.length === userMealTimes) {
      recommendations.push("Matches preferred meal frequency");
    }

    return recommendations;
  };

  const handleSelectPlan = (plan: DietPlan) => {
    setSelectedDietPlan(plan);
  };

  const handleConfirmSelection = () => {
    if (selectedDietPlan) {
      onSelectDietPlan(selectedDietPlan);
    }
  };

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
            <Utensils className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-slate-800">Available Diet Plans</CardTitle>
            <CardDescription>
              Choose the best diet plan for {userProfile.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search diet plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="high-protein">High Protein</SelectItem>
                <SelectItem value="low-carb">Low Carb</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Diet Plans List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredDietPlans.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No diet plans found matching your criteria.</p>
            </div>
          ) : (
            filteredDietPlans.map((plan) => {
              const recommendations = getRecommendations(plan);
              const isSelected = selectedDietPlan?.id === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? "border-blue-500 bg-blue-50/50" 
                      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectPlan(plan);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="space-y-3">
                    {/* Plan Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">{plan.name}</h3>
                        {plan.description && (
                          <p className="text-sm text-slate-600 mt-1">{plan.description}</p>
                        )}
                      </div>
                      {isSelected && (
                        <Badge className="bg-blue-600 text-white">Selected</Badge>
                      )}
                    </div>

                    {/* Plan Details */}
                    <div className="grid grid-cols-2 gap-3">
                      {plan.targetCalories && (
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-orange-600" />
                          <span className="text-xs text-slate-600">
                            {plan.targetCalories} calories
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-slate-600">
                          {plan.meals.length} meals
                        </span>
                      </div>
                    </div>

                    {/* Macros */}
                    {(plan.proteinPercent || plan.carbPercent || plan.fatPercent) && (
                      <div className="flex gap-2">
                        {plan.proteinPercent && (
                          <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                            P: {plan.proteinPercent}%
                          </Badge>
                        )}
                        {plan.carbPercent && (
                          <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700">
                            C: {plan.carbPercent}%
                          </Badge>
                        )}
                        {plan.fatPercent && (
                          <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                            F: {plan.fatPercent}%
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Recommendations */}
                    {recommendations.length > 0 && (
                      <div className="p-2 bg-green-50/50 border border-green-200 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <ChefHat className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Recommended</span>
                        </div>
                        <div className="space-y-1">
                          {recommendations.map((rec, index) => (
                            <p key={index} className="text-xs text-green-600">• {rec}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meals Preview */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-2">Meals included:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.meals.slice(0, 4).map((meal) => (
                          <Badge 
                            key={meal.id} 
                            variant="secondary" 
                            className="text-xs bg-slate-100 text-slate-700"
                          >
                            {meal.mealTime}
                          </Badge>
                        ))}
                        {plan.meals.length > 4 && (
                          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                            +{plan.meals.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Confirm Selection Button */}
        {selectedDietPlan && (
          <div className="pt-4 border-t border-slate-200">
            <Button 
              onClick={handleConfirmSelection}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue with "{selectedDietPlan.name}"
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
