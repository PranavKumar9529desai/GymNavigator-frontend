"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Save, Trash2, Utensils } from "lucide-react";
import { useState } from "react";
import type { DietPlan } from "../../../_actions /GetallDiets";
import { saveDietPlan } from "../../_actions/save-diet-plan";

interface DietResultsProps {
  dietPlan: DietPlan;
  onSuccess: () => void;
  clientName: string;
  userId: string;
  userName?: string;
}

export default function DietResults({
  dietPlan,
  onSuccess,
  clientName = "Client",
  userId,
  userName,
}: DietResultsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setSaveSuccess(false);

    try {
      const result = await saveDietPlan(dietPlan);

      if (result.success) {
        setSaveSuccess(true);
        setSaveMessage("Diet plan saved successfully!");

        // Call the onSave callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        setSaveSuccess(false);
        setSaveMessage(result.message || "Failed to save diet plan");
      }
    } catch (error) {
      console.error("Error saving diet plan:", error);
      setSaveSuccess(false);
      setSaveMessage("An unexpected error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with save/discard buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{dietPlan.name}</h2>
          <p className="text-muted-foreground">{dietPlan.description}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
            onClick={() => onSuccess()}
          >
            <Trash2 className="h-4 w-4" />
            <span>Discard</span>
          </Button>

          <Button
            variant="default"
            className="gap-1 bg-gradient-to-br from-green-600/90 via-emerald-600/80 to-green-700/90 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
            onClick={handleSave}
            disabled={isSaving || saveSuccess}
          >
            {isSaving ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Diet Plan</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`p-3 rounded-md ${
            saveSuccess
              ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30"
              : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30"
          }`}
        >
          {saveMessage}
        </div>
      )}

      {/* Diet summary */}
      <Card className="bg-white/70 dark:bg-gray-950/70  border border-green-100/50 dark:border-green-800/30">
        <CardHeader className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-950/50 dark:via-emerald-950/30 dark:to-green-950/50 border-b border-green-100/50 dark:border-green-800/30">
          <CardTitle className="text-xl">Diet Plan Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-green-50/50 dark:bg-green-900/20 rounded-md border border-green-100/50 dark:border-green-800/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Daily Calories
              </div>
              <div className="text-xl font-semibold text-green-700 dark:text-green-300">
                {dietPlan.targetCalories} kcal
              </div>
            </div>

            <div className="p-3 bg-green-50/50 dark:bg-green-900/20 rounded-md border border-green-100/50 dark:border-green-800/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Protein</div>
              <div className="text-xl font-semibold text-green-700 dark:text-green-300">
                {Math.round(dietPlan.proteinRatio * 100)}%
              </div>
            </div>

            <div className="p-3 bg-green-50/50 dark:bg-green-900/20 rounded-md border border-green-100/50 dark:border-green-800/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Meals per Day
              </div>
              <div className="text-xl font-semibold text-green-700 dark:text-green-300">
                {dietPlan.meals.length}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-medium text-lg flex items-center gap-2 text-green-800 dark:text-green-300">
              <Utensils className="h-5 w-5" />
              <span>Daily Meal Plan</span>
            </h3>

            <div className="space-y-4">
              {dietPlan.meals.map((meal) => (
                <Card
                  key={meal.id}
                  className="overflow-hidden border border-green-100/50 dark:border-green-800/30"
                >
                  <CardHeader className="py-3 px-4 bg-green-50/70 dark:bg-green-900/30">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">
                        {meal.name}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {meal.timeOfDay}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Calories:</span>{" "}
                        <span className="font-medium">
                          {meal.calories} kcal
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Protein:</span>{" "}
                        <span className="font-medium">{meal.protein}g</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Carbs:</span>{" "}
                        <span className="font-medium">{meal.carbs}g</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Fats:</span>{" "}
                        <span className="font-medium">{meal.fats}g</span>
                      </div>
                    </div>

                    {meal.instructions && (
                      <div className="mt-2 text-sm">
                        <div className="text-muted-foreground font-medium mb-1">
                          Instructions:
                        </div>
                        <p className="text-sm">{meal.instructions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom action buttons (mobile friendly duplication) */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
          onClick={() => onSuccess()}
        >
          <Trash2 className="h-4 w-4" />
          <span>Discard</span>
        </Button>

        <Button
          variant="default"
          className="gap-1 bg-gradient-to-br from-green-600/90 via-emerald-600/80 to-green-700/90 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
          onClick={handleSave}
          disabled={isSaving || saveSuccess}
        >
          {isSaving ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Diet Plan</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
