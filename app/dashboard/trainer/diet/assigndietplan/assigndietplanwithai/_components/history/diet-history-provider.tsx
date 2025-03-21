"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDietHistory } from "../../_actions/get-diet-history";
import type { DietHistoryItem } from "../../_store/diet-view-store";
import { useDietViewStore } from "../../_store/diet-view-store";

interface DietHistoryProviderProps {
  userId: string;
  serverFallbackHistory: DietHistoryItem[];
}

export function DietHistoryProvider({
  userId,
  serverFallbackHistory,
}: DietHistoryProviderProps) {
  const [history, setHistory] = useState<DietHistoryItem[]>(serverFallbackHistory || []);
  const [isLoading, setIsLoading] = useState(false);

  const { setDietFromHistory } = useDietViewStore();

  useEffect(() => {
    const loadHistory = async () => {
      if (serverFallbackHistory.length > 0) {
        // Use the server data if available
        setHistory(serverFallbackHistory);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getDietHistory(userId);
        if (response.success && response.data) {
          setHistory(response.data);
        }
      } catch (error) {
        console.error("Failed to load diet history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [userId, serverFallbackHistory]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          No diet plans have been generated yet.
        </p>
        <Button 
          variant="outline"
          className="border-green-200 dark:border-green-800/30"
          onClick={() => {
            // Handle navigation to generate tab
            document.querySelector('[data-state="inactive"][value="generate"]')?.click();
          }}
        >
          Generate your first diet plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div 
          key={item.id}
          className="p-4 border border-green-100/50 dark:border-green-800/30 rounded-lg hover:bg-gradient-to-br hover:from-green-50/50 hover:via-emerald-50/30 hover:to-green-50/50 dark:hover:from-green-950/50 dark:hover:via-emerald-950/30 dark:hover:to-green-950/50 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">{item.dietPlan.name}</h4>
            <span className="text-xs text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.dietPlan.description || 'No description available'}
          </p>
          
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-300">
              {item.dietPlan.targetCalories} kcal
            </span>
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-300">
              {Math.round(item.dietPlan.proteinRatio * 100)}% protein
            </span>
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-300">
              {item.dietPlan.meals.length} meals
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full border-green-200 dark:border-green-800/30 hover:bg-green-50 dark:hover:bg-green-900/30"
            onClick={() => setDietFromHistory(item)}
          >
            View Diet Plan
          </Button>
        </div>
      ))}
    </div>
  );
} 