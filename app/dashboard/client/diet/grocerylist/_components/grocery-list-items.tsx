import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type GroceryItemProps = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	isPurchased: boolean;
	onToggle: (id: string) => void;
};

export function GroceryListItem({
	id,
	name,
	quantity,
	unit,
	isPurchased,
	onToggle,
}: GroceryItemProps) {
	return (
		<div className="flex items-center justify-between p-2 rounded-md bg-background hover:bg-muted/20 transition-colors">
			<div className="flex items-center gap-2">
				<Checkbox
					checked={isPurchased}
					onCheckedChange={() => onToggle(id)}
					id={`item-${id}`}
					className={cn(
						"h-4 w-4 rounded-sm border-primary/50",
						isPurchased && "bg-primary border-primary"
					)}
				/>
				<label
					htmlFor={`item-${id}`}
					className={cn(
						"text-sm font-medium cursor-pointer",
						isPurchased && "line-through text-muted-foreground"
					)}
				>
					{name}
				</label>
			</div>
			<span className="text-xs px-2 py-1 rounded-md bg-primary/5">
				{quantity} {unit}
			</span>
		</div>
	);
}
