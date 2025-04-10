'use client';

import { useState } from 'react';
import type { GroceryListResponse, GroceryCategory, GroceryItem } from '@/lib/AI/prompts/grocery-list-prompts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Clipboard, 
  Download, 
  Save,
  ShoppingCart 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveGroceryList } from '../_actions/save-grocery-list';
import { useTransition } from 'react';

interface GroceryListViewProps {
  groceryList: GroceryListResponse;
  timeFrame: 'weekly' | 'monthly';
}

export function GroceryListView({ groceryList, timeFrame }: GroceryListViewProps) {
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(
    groceryList.categories.map(cat => cat.id) // Default all expanded
  )); 
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();
  
  const toggleItemPurchased = (categoryId: string, itemName: string) => {
    const itemId = `${categoryId}-${itemName}`;
    const newPurchasedItems = new Set(purchasedItems);
    
    if (newPurchasedItems.has(itemId)) {
      newPurchasedItems.delete(itemId);
    } else {
      newPurchasedItems.add(itemId);
    }
    
    setPurchasedItems(newPurchasedItems);
  };
  
  const toggleCategory = (categoryId: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    
    if (newExpandedCategories.has(categoryId)) {
      newExpandedCategories.delete(categoryId);
    } else {
      newExpandedCategories.add(categoryId);
    }
    
    setExpandedCategories(newExpandedCategories);
  };
  
  const copyToClipboard = () => {
    const text = groceryList.categories
      .map(category => {
        return `== ${category.name} ==\n${category.items
          .map(item => `• ${item.name} - ${item.quantity} ${item.unit}`)
          .join('\n')}`;
      })
      .join('\n\n');
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Grocery list copied to clipboard",
      duration: 3000,
    });
  };
  
  const handleSaveList = () => {
    startSaving(async () => {
      try {
        const result = await saveGroceryList({
          timeFrame,
          groceryList
        });
        
        if (result.success) {
          toast({
            title: "Grocery list saved",
            description: "Your grocery list has been saved successfully",
            duration: 3000,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Save failed",
            description: result.error || "Failed to save grocery list",
            duration: 3000,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "An unexpected error occurred",
          duration: 3000,
        });
        console.error(error);
      }
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">
          {timeFrame === 'weekly' ? 'Weekly' : 'Monthly'} Grocery List
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={copyToClipboard}
          >
            <Clipboard className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleSaveList}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groceryList.categories.map((category) => (
          <Card key={category.id} className="shadow-sm">
            <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleCategory(category.id)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                  {category.name}
                  <Badge variant="outline" className="ml-2">
                    {category.items.length}
                  </Badge>
                </CardTitle>
                {expandedCategories.has(category.id) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            
            {expandedCategories.has(category.id) && (
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item) => {
                    const itemId = `${category.id}-${item.name}`;
                    const isPurchased = purchasedItems.has(itemId);
                    
                    return (
                      <li 
                        key={`${category.id}-${item.name}`}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md",
                          isPurchased ? "bg-muted/50" : "hover:bg-muted/20"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={isPurchased}
                            onCheckedChange={() => toggleItemPurchased(category.id, item.name)}
                            id={itemId}
                          />
                          <label 
                            htmlFor={itemId}
                            className={cn(
                              "flex flex-col text-sm cursor-pointer",
                              isPurchased && "line-through text-muted-foreground"
                            )}
                          >
                            <span className="font-medium">{item.name}</span>
                            {item.notes && (
                              <span className="text-xs text-muted-foreground">{item.notes}</span>
                            )}
                          </label>
                        </div>
                        <span 
                          className={cn(
                            "text-sm font-medium",
                            isPurchased && "text-muted-foreground"
                          )}
                        >
                          {item.quantity} {item.unit}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {purchasedItems.size} of {groceryList.categories.reduce((acc, cat) => acc + cat.items.length, 0)} items purchased
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setPurchasedItems(new Set())}
          disabled={purchasedItems.size === 0}
        >
          Reset
        </Button>
      </div>
    </div>
  );
} 