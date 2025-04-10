'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroceryListView } from './grocery-list-view';
import { getWeeklyDietPlan } from '../_actions/get-weekly-dietplan';
import { fetchSavedGroceryLists, type SavedGroceryList } from '../_actions/fetch-saved-grocery-lists';
import type { GroceryListResponse } from '@/lib/AI/prompts/grocery-list-prompts';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';
import { LoadingSpinner } from '@/components/ui/spinner';
import { CalendarIcon, Clock, RefreshCcw, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { SavedGroceryListView } from './saved-grocery-list-view';

export function GrocerySelector() {
  const [groceryList, setGroceryList] = useState<GroceryListResponse | null>(null);
  const [savedLists, setSavedLists] = useState<{
    weekly: SavedGroceryList | null;
    monthly: SavedGroceryList | null;
    others: SavedGroceryList[];
  }>({
    weekly: null,
    monthly: null,
    others: []
  });
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly'>('weekly');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [viewMode, setViewMode] = useState<'saved' | 'generating'>('saved');
  
  // Fetch saved grocery lists on component mount
  useEffect(() => {
    const loadSavedLists = async () => {
      setIsLoading(true);
      try {
        const result = await fetchSavedGroceryLists();
        
        if (result.success && result.groceryLists && result.groceryLists.length > 0) {
          // Find the most recent weekly and monthly lists
          const weeklies = result.groceryLists.filter(list => list.timeFrame === 'weekly');
          const monthlies = result.groceryLists.filter(list => list.timeFrame === 'monthly');
          
          // Sort by date, most recent first
          weeklies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          monthlies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          // Set the most recent lists and all others
          setSavedLists({
            weekly: weeklies.length > 0 ? weeklies[0] : null,
            monthly: monthlies.length > 0 ? monthlies[0] : null,
            others: result.groceryLists.filter((list, index) => 
              !(list.timeFrame === 'weekly' && index === 0) && 
              !(list.timeFrame === 'monthly' && index === 0)
            )
          });
        }
      } catch (err) {
        console.error('Error loading saved grocery lists:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedLists();
  }, []);
  
  const fetchGroceryList = async (selectedTimeFrame: 'weekly' | 'monthly') => {
    setError(null);
    setViewMode('generating');
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
  
  const handleTabChange = (value: string) => {
    const newTimeFrame = value as 'weekly' | 'monthly';
    setActiveTab(newTimeFrame);
    
    // If we have a saved list for this timeframe, show it
    if (savedLists[newTimeFrame]) {
      setViewMode('saved');
    } else {
      // If no saved list exists, we might want to generate one
      setViewMode('generating');
    }
  };

  // Show loading state while checking for saved lists
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <LoadingSpinner className="w-8 h-8 text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Loading your grocery lists...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <Tabs defaultValue="weekly" onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Grocery List</h2>
          <TabsList>
            <TabsTrigger value="weekly" disabled={isPending}>Weekly</TabsTrigger>
            <TabsTrigger value="monthly" disabled={isPending}>Monthly</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-4">
          {viewMode === 'generating' ? (
            <>
              {isPending ? (
                <div className="flex flex-col items-center justify-center p-6">
                  <LoadingSpinner className="w-8 h-8 text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Generating your {timeFrame} grocery list...
                  </p>
                </div>
              ) : error ? (
                <div className="p-4 text-center rounded-lg bg-destructive/10">
                  <p className="text-destructive text-sm">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => fetchGroceryList(activeTab)}
                  >
                    Try Again
                  </Button>
                </div>
              ) : groceryList ? (
                <GroceryListView groceryList={groceryList} timeFrame={activeTab} />
              ) : (
                <div className="p-4 text-center rounded-lg bg-muted/50">
                  <p className="mb-3 text-sm">Generate a new {activeTab} grocery list based on your diet plan</p>
                  <Button 
                    onClick={() => fetchGroceryList(activeTab)}
                    className={cn(isPending && "opacity-50 cursor-not-allowed")}
                    disabled={isPending}
                  >
                    Generate List
                  </Button>
                  {savedLists[activeTab] && (
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => setViewMode('saved')}
                    >
                      View Saved
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {savedLists[activeTab] ? (
                <div className="space-y-3">
                  <div className="bg-muted/20 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-primary" />
                        <h3 className="text-lg font-medium">
                          {activeTab === 'weekly' ? 'Weekly' : 'Monthly'} Grocery List
                        </h3>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(savedLists[activeTab]!.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs p-2 h-8"
                        onClick={() => {
                          setGroceryList(null);
                          setViewMode('generating');
                        }}
                      >
                        <RefreshCcw className="w-3 h-3 mr-1" />
                        <span>Generate New</span>
                      </Button>
                    </div>
                  </div>
                  <SavedGroceryListView groceryList={savedLists[activeTab]!} />
                </div>
              ) : (
                <div className="p-4 text-center rounded-lg bg-muted/50">
                  <p className="mb-3 text-sm">You don't have a saved {activeTab} grocery list yet</p>
                  <Button 
                    onClick={() => fetchGroceryList(activeTab)}
                    className={cn(isPending && "opacity-50 cursor-not-allowed")}
                    disabled={isPending}
                  >
                    Generate List
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
} 