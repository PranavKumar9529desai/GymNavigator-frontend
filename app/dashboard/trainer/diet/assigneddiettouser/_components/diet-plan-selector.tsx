"use client";

import { useState, useEffect } from "react";
import { Search, Utensils, Clock, Target, ChefHat, Filter, Leaf, Drumstick, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { attachDietPlanToUser } from "../../dietassignedusers/_actions /AttachDietPlanToUser";
import { toast } from "@/hooks/use-toast";

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
  createdByTrainer?: {
    id: number;
    name: string;
  } | null;
  isOwnPlan?: boolean;
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
  userId: string; // Add userId prop
  onSelectDietPlan: (dietPlan: DietPlan) => void;
}

export function DietPlanSelector({ 
  dietPlans, 
  userProfile, 
  userId,
  onSelectDietPlan 
}: DietPlanSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorFilter, setCreatorFilter] = useState<string>("all");
  const [mealTimesFilter, setMealTimesFilter] = useState<string>("all");
  const [dietTypeFilter, setDietTypeFilter] = useState<string>("all");
  const [selectedDietPlan, setSelectedDietPlan] = useState<DietPlan | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Auto-apply filters based on user health profile
  useEffect(() => {
    if (userProfile.HealthProfile) {
      const health = userProfile.HealthProfile;
      
      // Auto-set meal times filter
      if (health.mealTimes) {
        setMealTimesFilter(health.mealTimes);
      }
      
      // Auto-set diet type filter
      if (health.dietaryPreference) {
        if (health.dietaryPreference.toLowerCase().includes("vegetarian")) {
          setDietTypeFilter("vegetarian");
        } else if (health.dietaryPreference.toLowerCase().includes("non-vegetarian")) {
          setDietTypeFilter("non-vegetarian");
        }
      }
    }
  }, [userProfile]);

  // Helper function to determine diet type from plan
  const getDietType = (plan: DietPlan): string => {
    const planName = plan.name.toLowerCase();
    const planDesc = (plan.description || "").toLowerCase();
    
    if (planName.includes("veg") || planDesc.includes("vegetarian") || planDesc.includes("vegan")) {
      return "vegetarian";
    }if (planName.includes("non-veg") || planDesc.includes("non-vegetarian") || 
               planName.includes("chicken") || planName.includes("meat") || planName.includes("fish")) {
      return "non-vegetarian";
    }
    return "mixed";
  };

  // Filter diet plans based on search and filters
  const filteredDietPlans = dietPlans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (plan.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    // Creator filter
    let matchesCreator = true;
    if (creatorFilter === "own") {
      matchesCreator = plan.isOwnPlan === true;
    } else if (creatorFilter === "others") {
      matchesCreator = plan.isOwnPlan === false;
    }
    
    // Meal times filter
    let matchesMealTimes = true;
    if (mealTimesFilter !== "all") {
      const targetMealCount = Number.parseInt(mealTimesFilter);
      matchesMealTimes = plan.meals.length === targetMealCount;
    }
    
    // Diet type filter
    let matchesDietType = true;
    if (dietTypeFilter !== "all") {
      const planDietType = getDietType(plan);
      matchesDietType = planDietType === dietTypeFilter || planDietType === "mixed";
    }
    
    return matchesSearch && matchesCreator && matchesMealTimes && matchesDietType;
  });

  // Get recommendations based on user profile
  const getRecommendations = (plan: DietPlan) => {
    const recommendations: string[] = [];
    const health = userProfile.HealthProfile;
    
    if (!health) return recommendations;

    // Check if both meal times and diet preference match
    const userMealTimes = Number.parseInt(health.mealTimes);
    const planDietType = getDietType(plan);
    const userDietType = health.dietaryPreference?.toLowerCase().includes("vegetarian") ? "vegetarian" : "non-vegetarian";
    
    const mealTimesMatch = plan.meals.length === userMealTimes;
    const dietTypeMatch = planDietType === userDietType || planDietType === "mixed";
    
    if (mealTimesMatch && dietTypeMatch) {
      recommendations.push("Meal and Diet preference Match");
    } else {
      if (mealTimesMatch) {
        recommendations.push("Matches preferred meal frequency");
      }
      if (dietTypeMatch) {
        recommendations.push("Matches dietary preference");
      }
    }
    
    // Check goal compatibility
    if (health.goal.toLowerCase().includes("weight loss") && plan.name.toLowerCase().includes("weight loss")) {
      recommendations.push("Aligned with weight loss goal");
    }
    
    if (health.goal.toLowerCase().includes("muscle") && (plan.proteinPercent || 0) > 25) {
      recommendations.push("High protein for muscle building");
    }

    return recommendations;
  };

  const handleSelectPlan = (plan: DietPlan) => {
    setSelectedDietPlan(plan);
  };

  const handleConfirmSelection = async () => {
    if (!selectedDietPlan) return;

    setIsAssigning(true);
    try {
      const result = await attachDietPlanToUser(userId, selectedDietPlan.id.toString());
      
      if (result.success) {
        toast({
          title: "Diet Plan Assigned Successfully",
          description: `${selectedDietPlan.name} has been assigned to ${userProfile.name}`,
        });
        
        // Call the original callback to proceed to next step
        onSelectDietPlan(selectedDietPlan);
      } else {
        toast({
          title: "Assignment Failed",
          description: result.message || "Failed to assign diet plan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Error assigning diet plan:", error);
      toast({
        title: "Assignment Failed",
        description: error instanceof Error ? error.message : "Failed to assign diet plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
            <Utensils className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-800">Available Diet Plans</CardTitle>
            <CardDescription>
              Choose the best diet plan for {userProfile.name} • {dietPlans.length} plans available from your gym
            </CardDescription>
          </div>
          {dietPlans.some(plan => plan.isOwnPlan) && (
            <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
              {dietPlans.filter(plan => plan.isOwnPlan).length} Your Plans
            </Badge>
          )}
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <div className="flex items-center gap-1">
              <Filter className="h-3 w-3 text-slate-600" />
              <span className="text-xs text-slate-600">Filters:</span>
            </div>
            <Select value={creatorFilter} onValueChange={setCreatorFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Creator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trainers</SelectItem>
                <SelectItem value="own">My Plans</SelectItem>
                <SelectItem value="others">Other Trainers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={mealTimesFilter} onValueChange={setMealTimesFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Meal Times" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Meals</SelectItem>
                <SelectItem value="3">3 Meals</SelectItem>
                <SelectItem value="4">4 Meals</SelectItem>
                <SelectItem value="5">5 Meals</SelectItem>
                <SelectItem value="6">6 Meals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dietTypeFilter} onValueChange={setDietTypeFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Diet Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Diet Plans List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredDietPlans.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              {dietPlans.length === 0 ? (
                <div>
                  <p className="font-medium">No diet plans available</p>
                  <p className="text-sm mt-1">Create some diet plans or check with other trainers in your gym.</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">No diet plans match your filters</p>
                  <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
                </div>
              )}
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800">{plan.name}</h3>
                          {plan.isOwnPlan ? (
                            <Badge className="bg-blue-600 text-white text-xs">Your Plan</Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs">
                              By {plan.createdByTrainer?.name || 'Unknown'}
                            </Badge>
                          )}
                        </div>
                        {plan.description && (
                          <p className="text-sm text-slate-600 mt-1">{plan.description}</p>
                        )}
                      </div>
                      {isSelected && (
                        <Badge className="bg-blue-600 text-white ml-2">Selected</Badge>
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
              disabled={isAssigning}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isAssigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning Diet Plan...
                </>
              ) : (
                `Assign "${selectedDietPlan.name}" to ${userProfile.name}`
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
