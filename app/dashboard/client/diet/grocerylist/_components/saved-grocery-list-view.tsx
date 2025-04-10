'use client';

import { useState } from 'react';
import type { SavedGroceryList } from '../_actions/fetch-saved-grocery-lists';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  ChevronUp, 
  Clipboard, 
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-medium">{groceryList.name}</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={copyToClipboard}
        >
          <Clipboard className="w-4 h-4" />
          <span className="hidden sm:inline">Copy</span>
        </Button>
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
                    const isUpdatingThisItem = updatingItemId === item.id;
                    
                    return (
                      <li 
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md",
                          item.isPurchased ? "bg-muted/50" : "hover:bg-muted/20",
                          isUpdatingThisItem && "opacity-70"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={item.isPurchased}
                            onCheckedChange={() => handleToggleItem(item.id, item.isPurchased)}
                            id={`item-${item.id}`}
                            disabled={isUpdating && isUpdatingThisItem}
                          />
                          <label 
                            htmlFor={`item-${item.id}`}
                            className={cn(
                              "flex flex-col text-sm cursor-pointer",
                              item.isPurchased && "line-through text-muted-foreground"
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
                            item.isPurchased && "text-muted-foreground"
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
          {purchasedItems} of {totalItems} items purchased ({Math.round((purchasedItems / totalItems) * 100)}%)
        </span>
      </div>
    </div>
  );
} 