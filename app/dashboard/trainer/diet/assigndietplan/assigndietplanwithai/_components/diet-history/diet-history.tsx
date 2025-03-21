"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Check,
  ChevronRight,
  RefreshCw,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import React, { useEffect } from "react";
import type { DietHistoryItem } from "../../_store/diet-view-store";
import { useDietViewStore } from "../../_store/diet-view-store";
import { useDietHistory } from "./diet-history-provider";

interface DietHistoryProps {
  onSelectDiet: (diet: DietHistoryItem) => void;
  userId: string;
}

export function DietHistory({ onSelectDiet, userId }: DietHistoryProps) {
  const { loading, history, error, refreshHistory } = useDietHistory();
  const { getSavedDiets } = useDietViewStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [localHistory, setLocalHistory] = React.useState<DietHistoryItem[]>([]);

  useEffect(() => {
    // When API is loading or errors out, show diets from localStorage
    if (loading || error) {
      setLocalHistory(getSavedDiets(userId));
    } else {
      setLocalHistory(history);
    }
  }, [loading, error, history, getSavedDiets, userId]);

  const filteredHistory = React.useMemo(() => {
    if (!searchQuery.trim()) return localHistory;

    const query = searchQuery.toLowerCase();
    return localHistory.filter(
      (item) =>
        item.dietPlan.name.toLowerCase().includes(query) ||
        item.dietPlan.description?.toLowerCase().includes(query)
    );
  }, [localHistory, searchQuery]);

  // Show loading state with local diets if available
  if (loading) {
    const localDiets = getSavedDiets(userId);
    if (localDiets.length > 0) {
      // If we have local diets, show them while loading
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Loading from server, showing saved diets...
            </p>
            <RefreshCw className="h-4 w-4 animate-spin" />
          </div>
          <DietHistoryList 
            diets={localDiets} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onSelectDiet={onSelectDiet} 
          />
        </div>
      );
    }
    
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Show error state with local diets if available
  if (error) {
    const localDiets = getSavedDiets(userId);
    if (localDiets.length > 0) {
      // If we have local diets, show them despite the error
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-red-500">
              {error} (showing locally saved diets)
            </p>
            <Button variant="outline" size="sm" onClick={refreshHistory}>
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </div>
          <DietHistoryList 
            diets={localDiets} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onSelectDiet={onSelectDiet} 
          />
        </div>
      );
    }
    
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={refreshHistory}>
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  if (filteredHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No diet plans saved yet</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          Generate and save a diet plan to see it here
        </p>
      </div>
    );
  }

  return (
    <DietHistoryList 
      diets={filteredHistory} 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery} 
      onSelectDiet={onSelectDiet} 
    />
  );
}

interface DietHistoryListProps {
  diets: DietHistoryItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectDiet: (diet: DietHistoryItem) => void;
}

function DietHistoryList({ diets, searchQuery, setSearchQuery, onSelectDiet }: DietHistoryListProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search diet plans..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {diets.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              No matching diet plans found
            </p>
          </div>
        ) : (
          diets.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:border-green-300 transition-colors cursor-pointer"
              onClick={() => onSelectDiet(item)}
            >
              <CardContent className="p-0">
                <div className="flex items-start gap-3 p-4">
                  <div className="flex-shrink-0 p-2 bg-green-100 rounded-md">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold truncate">
                        {item.dietPlan.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="whitespace-nowrap">
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.dietPlan.description || "No description"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        <Check className="h-3 w-3 mr-1" />
                        {item.dietPlan.meals.length} meals
                      </div>
                      <div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {Math.round(item.dietPlan.targetCalories)} calories
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
