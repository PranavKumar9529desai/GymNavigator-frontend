'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroceryListView } from './grocery-list-view';
import { getWeeklyDietPlan } from '../_actions/get-weekly-dietplan';
import type { GroceryListResponse } from '@/lib/AI/prompts/grocery-list-prompts';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';
import { LoadingSpinner } from '@/components/ui/spinner';

export function GrocerySelector() {
  const [groceryList, setGroceryList] = useState<GroceryListResponse | null>(null);
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly'>('weekly');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  const fetchGroceryList = async (selectedTimeFrame: 'weekly' | 'monthly') => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await getWeeklyDietPlan({ timeFrame: selectedTimeFrame });
        
        if (!result.success || !result.groceryList) {
          setError(result.error || 'Failed to load grocery list');
          return;
        }
        
        setGroceryList(result.groceryList);
        setTimeFrame(selectedTimeFrame);
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      }
    });
  };
  
  return (
    <div className="w-full">
      <Tabs defaultValue="weekly" onValueChange={(value) => fetchGroceryList(value as 'weekly' | 'monthly')} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Grocery List</h2>
          <TabsList>
            <TabsTrigger value="weekly" disabled={isPending}>Weekly</TabsTrigger>
            <TabsTrigger value="monthly" disabled={isPending}>Monthly</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-4">
          {isPending ? (
            <div className="flex flex-col items-center justify-center p-10">
              <LoadingSpinner className="w-10 h-10 text-primary" />
              <p className="mt-4 text-muted-foreground">
                Generating your {timeFrame} grocery list...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 text-center border rounded-lg bg-destructive/10 border-destructive/20">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => fetchGroceryList(timeFrame)}
              >
                Try Again
              </Button>
            </div>
          ) : groceryList ? (
            <GroceryListView groceryList={groceryList} timeFrame={timeFrame} />
          ) : (
            <div className="p-6 text-center border rounded-lg bg-muted">
              <p className="mb-4">Select a time frame to generate your grocery list</p>
              <Button 
                onClick={() => fetchGroceryList('weekly')}
                className={cn("mr-2", isPending && "opacity-50 cursor-not-allowed")}
                disabled={isPending}
              >
                Generate Weekly List
              </Button>
              <Button 
                onClick={() => fetchGroceryList('monthly')}
                variant="outline"
                className={cn(isPending && "opacity-50 cursor-not-allowed")}
                disabled={isPending}
              >
                Generate Monthly List
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
} 