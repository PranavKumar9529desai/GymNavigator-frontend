'use client';

import { useState } from 'react';
import type { GroceryListResponse, GroceryCategory, GroceryItem } from '@/lib/AI/prompts/grocery-list-prompts';
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
  ShoppingCart,
  MinusCircle
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
  const [modifiedGroceryList, setModifiedGroceryList] = useState<GroceryListResponse>(groceryList);
  
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
  
  const deleteItem = (categoryId: string, itemName: string) => {
    setModifiedGroceryList(prevList => {
      const newList = {...prevList};
      
      // Find the category and remove the item
      const categoryIndex = newList.categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex !== -1) {
        // Filter out the item with the matching name
        newList.categories[categoryIndex] = {
          ...newList.categories[categoryIndex],
          items: newList.categories[categoryIndex].items.filter(item => item.name !== itemName)
        };
        
        // If the category is now empty, remove it
        if (newList.categories[categoryIndex].items.length === 0) {
          newList.categories = newList.categories.filter((_, index) => index !== categoryIndex);
        }
      }
      
      // Also remove from purchased items if it was there
      const itemId = `${categoryId}-${itemName}`;
      if (purchasedItems.has(itemId)) {
        const newPurchasedItems = new Set(purchasedItems);
        newPurchasedItems.delete(itemId);
        setPurchasedItems(newPurchasedItems);
      }
      
      return newList;
    });
    
    toast({
      title: "Item removed",
      description: `"${itemName}" has been removed from your grocery list`,
      duration: 3000,
    });
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
    const text = modifiedGroceryList.categories
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
          groceryList: modifiedGroceryList
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">
          {timeFrame === 'weekly' ? 'Weekly' : 'Monthly'} Grocery List
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
          >
            <Clipboard className="w-4 h-4 mr-1 sm:mr-0" />
            <span className="hidden sm:inline ml-1">Copy</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSaveList}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-1 sm:mr-0" />
            <span className="hidden sm:inline ml-1">Save</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {modifiedGroceryList.categories.map((category) => (
          <div key={category.id} className="pb-2">
            <div 
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer" 
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary/70" />
                <span className="font-medium">{category.name}</span>
                <span className="ml-1 text-xs text-muted-foreground">
                  ({category.items.length})
                </span>
              </div>
              {expandedCategories.has(category.id) ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            
            {expandedCategories.has(category.id) && (
              <div className="pt-2 px-1">
                <ul className="space-y-2">
                  {category.items.map((item) => {
                    const itemId = `${category.id}-${item.name}`;
                    const isPurchased = purchasedItems.has(itemId);
                    
                    return (
                      <li 
                        key={`${category.id}-${item.name}`}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md transition-all duration-200",
                          isPurchased ? "bg-muted/40" : "bg-background"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={isPurchased}
                            onCheckedChange={() => toggleItemPurchased(category.id, item.name)}
                            id={itemId}
                            className={cn(
                              "h-4 w-4 rounded-sm border-primary/50",
                              isPurchased && "bg-primary border-primary"
                            )}
                          />
                          <label 
                            htmlFor={itemId}
                            className={cn(
                              "flex flex-col cursor-pointer",
                              isPurchased && "line-through text-muted-foreground"
                            )}
                          >
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.notes && (
                              <span className="text-xs text-muted-foreground">{item.notes}</span>
                            )}
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <span 
                            className={cn(
                              "text-xs font-medium px-2 py-1 rounded-md bg-primary/5",
                              isPurchased && "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.quantity} {item.unit}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500/70 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItem(category.id, item.name);
                            }}
                          >
                            <MinusCircle className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 