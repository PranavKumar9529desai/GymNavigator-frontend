'use client';

import { useState } from 'react';
import type { SavedGroceryList } from '../_actions/fetch-saved-grocery-lists';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  ChevronUp, 
  ShoppingCart 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateGroceryItem } from '../_actions/update-grocery-item';
import { useTransition } from 'react';

interface SavedGroceryListViewProps {
  groceryList: SavedGroceryList;
}

export function SavedGroceryListView({ groceryList }: SavedGroceryListViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set(
    groceryList.categories.map(cat => cat.id) // Default all expanded
  )); 
  const [isUpdating, startUpdating] = useTransition();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const toggleCategory = (categoryId: number) => {
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
          .map(item => `• ${item.name} - ${item.quantity} ${item.unit}${item.isPurchased ? ' ✓' : ''}`)
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
  
  const handleToggleItem = (itemId: number, currentStatus: boolean) => {
    setUpdatingItemId(itemId);
    startUpdating(async () => {
      try {
        const result = await updateGroceryItem({
          itemId,
          isPurchased: !currentStatus
        });
        
        if (result.success) {
          // Update the UI optimistically
          const updatedCategories = groceryList.categories.map(category => ({
            ...category,
            items: category.items.map(item => 
              item.id === itemId ? { ...item, isPurchased: !currentStatus } : item
            )
          }));
          
          // This is a trick to force a re-render since we're mutating a prop
          // In a real app, you'd use a state management solution
          groceryList.categories = updatedCategories;
          
          toast({
            title: currentStatus ? "Item unmarked" : "Item marked as purchased",
            duration: 2000,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: result.error || "Failed to update item status",
            duration: 3000,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "An unexpected error occurred",
          duration: 3000,
        });
        console.error(error);
      } finally {
        setUpdatingItemId(null);
      }
    });
  };
  
  // Calculate statistics
  const totalItems = groceryList.categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const purchasedItems = groceryList.categories.reduce((sum, cat) => 
    sum + cat.items.filter(item => item.isPurchased).length, 0);
  
  return (
    <div className="space-y-5 px-1">
      <div className="flex items-center justify-between mb-4">
        {/* <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">{groceryList.name}</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-primary/10 transition-colors"
          onClick={copyToClipboard}
        >
          Copy
        </Button> */}
      </div>
      
      <div className="space-y-4">
        {groceryList.categories.map((category) => (
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
                    const isUpdatingThisItem = updatingItemId === item.id;
                    
                    return (
                      <li 
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md transition-all duration-200",
                          item.isPurchased ? "bg-muted/40" : "bg-background",
                          isUpdatingThisItem && "opacity-70"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={item.isPurchased}
                            onCheckedChange={() => handleToggleItem(item.id, item.isPurchased)}
                            id={`item-${item.id}`}
                            disabled={isUpdating && isUpdatingThisItem}
                            className={cn(
                              "h-4 w-4 rounded-sm border-primary/50",
                              item.isPurchased && "bg-primary border-primary"
                            )}
                          />
                          <label 
                            htmlFor={`item-${item.id}`}
                            className={cn(
                              "flex flex-col cursor-pointer",
                              item.isPurchased && "line-through text-muted-foreground"
                            )}
                          >
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.notes && (
                              <span className="text-xs text-muted-foreground">{item.notes}</span>
                            )}
                          </label>
                        </div>
                        <span 
                          className={cn(
                            "text-xs font-medium px-2 py-1 rounded-md bg-primary/5",
                            item.isPurchased && "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.quantity} {item.unit}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="sticky bottom-0 left-0 right-0 mt-4 p-3 bg-background border-t border-border shadow-md">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.round((purchasedItems / totalItems) * 100)}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span>
            {purchasedItems} of {totalItems} items
          </span>
          <span className="font-bold text-primary">
            {Math.round((purchasedItems / totalItems) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
} 