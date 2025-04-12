"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getUserCompleteInfo,
  type CompleteUserInfo,
} from "../_actions/get-user-assigned-by-id";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserProfileComponentProps {
  userId: string;
}

export function UserProfileComponent({ userId }: UserProfileComponentProps) {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserCompleteInfo(userId),
  });

  if (!data?.success || !data.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load user information</p>
      </div>
    );
  }

  const user = data.data;
  const avatarUrl =
    user.HealthProfile?.gender === "Female"
      ? "https://avatar.iran.liara.run/public/girl"
      : "https://avatar.iran.liara.run/public/boy";

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Navigation Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 -mx-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-gray-100"
          onClick={() =>
            router.push("/dashboard/trainer/assignedusers/assignedusersroute")
          }
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assigned Users
        </Button>
      </div>

      {/* Basic Information */}
      <div className="flex flex-col items-center space-y-4 p-4">
        <Avatar className="w-24 h-24 ring-2 ring-offset-2 ring-gray-200">
          <Image
            src={avatarUrl}
            alt={user.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
            priority
          />
          <AvatarFallback className="bg-gray-100">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Badge variant="secondary">{user.role}</Badge>
            <span className="text-sm text-gray-500 text-center w-full">
              Member since {format(new Date(user.createdAt), "MMM yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Health Profile */}
      {user.HealthProfile && (
        <div className="space-y-6 p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Health Profile
          </h2>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="text-lg font-medium">
                {user.HealthProfile.weightValue} {user.HealthProfile.weightUnit}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Height</p>
              <p className="text-lg font-medium">
                {user.HealthProfile.heightValue} {user.HealthProfile.heightUnit}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Age</p>
              <p className="text-lg font-medium">
                {user.HealthProfile.age} years
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="text-lg font-medium">{user.HealthProfile.gender}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Goal</p>
              <p className="text-lg font-medium">{user.HealthProfile.goal}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Activity Level</p>
              <p className="text-lg font-medium">
                {user.HealthProfile.activityLevel}
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Dietary Preferences</h3>
              <p className="text-gray-700">
                {user.HealthProfile.dietaryPreference}
                {user.HealthProfile.otherDietaryPreference &&
                  ` (${user.HealthProfile.otherDietaryPreference})`}
              </p>
            </div>

            {user.HealthProfile.religiousPreference && (
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Religious Preference
                </h3>
                <p className="text-gray-700">
                  {user.HealthProfile.religiousPreference}
                  {user.HealthProfile.otherReligiousPreference &&
                    ` (${user.HealthProfile.otherReligiousPreference})`}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-2">Medical Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {user.HealthProfile.medicalConditions
                  .filter((condition) => condition.selected)
                  .map((condition) => (
                    <Badge key={condition.id} variant="outline">
                      {condition.name}
                    </Badge>
                  ))}
                {user.HealthProfile.otherMedicalCondition && (
                  <Badge variant="outline">
                    {user.HealthProfile.otherMedicalCondition}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {user.HealthProfile.allergies
                  .filter((allergy) => allergy.selected)
                  .map((allergy) => (
                    <Badge key={allergy.id} variant="outline">
                      {allergy.name}
                    </Badge>
                  ))}
                {user.HealthProfile.otherAllergy && (
                  <Badge variant="outline">
                    {user.HealthProfile.otherAllergy}
                  </Badge>
                )}
              </div>
            </div>

            {user.HealthProfile.dietaryRestrictions &&
              user.HealthProfile.dietaryRestrictions.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Dietary Restrictions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.HealthProfile.dietaryRestrictions.map(
                      (restriction, index) => (
                        <Badge key={index} variant="outline">
                          {restriction}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

            {user.HealthProfile.nonVegDays && (
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Non-Vegetarian Days
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.HealthProfile.nonVegDays
                    .filter((day) => day.selected)
                    .map((day) => (
                      <Badge key={day.day} variant="outline">
                        {day.day}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6">
              {user.HealthProfile.bmi && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="text-lg font-medium">
                    {user.HealthProfile.bmi.toFixed(1)}
                  </p>
                </div>
              )}
              {user.HealthProfile.bmr && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">BMR</p>
                  <p className="text-lg font-medium">
                    {user.HealthProfile.bmr.toFixed(0)} kcal
                  </p>
                </div>
              )}
              {user.HealthProfile.tdee && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">TDEE</p>
                  <p className="text-lg font-medium">
                    {user.HealthProfile.tdee.toFixed(0)} kcal
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Workout Plan */}
      {user.activeWorkoutPlan && (
        <div className="space-y-4 p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Active Workout Plan
          </h2>
          <Separator />
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div>
              <p className="text-sm text-gray-500">Plan Name</p>
              <p className="text-lg font-medium">
                {user.activeWorkoutPlan.name}
              </p>
            </div>
            {user.activeWorkoutPlan.description && (
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">
                  {user.activeWorkoutPlan.description}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="text-gray-700">
                {format(new Date(user.activeWorkoutPlan.createdAt), "PPP")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Diet Plan */}
      {user.DietPlan && (
        <div className="space-y-4 p-4">
          <h2 className="text-xl font-semibold text-gray-900">Diet Plan</h2>
          <Separator />
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div>
              <p className="text-sm text-gray-500">Plan Name</p>
              <p className="text-lg font-medium">{user.DietPlan.name}</p>
            </div>
            {user.DietPlan.description && (
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{user.DietPlan.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Calories</p>
                <p className="text-lg font-medium">
                  {user.DietPlan.totalCalories} kcal
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500">Protein</p>
                <p className="text-lg font-medium">{user.DietPlan.protein}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="text-lg font-medium">{user.DietPlan.carbs}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fat</p>
                <p className="text-lg font-medium">{user.DietPlan.fat}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
