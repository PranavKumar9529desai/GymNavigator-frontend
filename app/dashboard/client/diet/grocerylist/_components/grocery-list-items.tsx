import { useState } from "react";

type GroceryItemProps = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isPurchased: boolean;
  onToggle: (id: string) => void;
};

export function GroceryListItem({ id, name, quantity, unit, isPurchased, onToggle }: GroceryItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <input 
          type="checkbox" 
          checked={isPurchased} 
          onChange={() => onToggle(id)}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          id={`item-${id}`}
        />
        <label 
          htmlFor={`item-${id}`}
          className={`text-lg ${isPurchased ? 'line-through text-gray-500' : 'text-gray-900'}`}
        >
          {name} ({quantity} {unit})
        </label>
      </div>
    </div>
  );
}
