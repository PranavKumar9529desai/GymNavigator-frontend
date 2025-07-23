'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
	ChevronDown,
	Copy,
	Loader2,
	ShoppingCart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateGroceryItem } from '../_actions/update-grocery-item';
import type { SavedGroceryList } from '../_types/grocery-list-types';

interface SavedGroceryListViewProps {
	groceryList: SavedGroceryList;
}

export function SavedGroceryListView({
	groceryList,
}: SavedGroceryListViewProps) {
	const router = useRouter();
	const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
		new Set(
			groceryList.categories.map((cat) => cat.id), // Default all expanded
		),
	);
	const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
	const [_isPending, startTransition] = useTransition();
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

	const _copyToClipboard = () => {
		const text = groceryList.categories
			.map(category => {
				return `== ${category.name} ==\n${category.items
					.map(
						(item) =>
							`• ${item.name} - ${item.quantity} ${item.unit}${item.isPurchased ? ' ✓' : ''}`,
					)
					.join('\n')}`;
			})
			.join('\n\n');

		navigator.clipboard.writeText(text);
		toast({
			title: 'Copied to clipboard',
			description: 'Grocery list copied to clipboard',
			duration: 3000,
		});
	};

	const handleToggleItem = (itemId: number, currentStatus: boolean) => {
		setUpdatingItemId(itemId);
		startTransition(async () => {
			try {
				const result = await updateGroceryItem({
					itemId,
					isPurchased: !currentStatus,
				});

				if (result.success) {
					toast({
						title: currentStatus
							? 'Item unmarked'
							: 'Item marked as purchased',
						duration: 2000,
					});
					router.refresh();
				} else {
					toast({
						variant: 'destructive',
						title: 'Update failed',
						description: result.error || 'An unexpected error occurred',
						duration: 3000,
					});
				}
			} catch (error) {
				toast({
					variant: 'destructive',
					title: 'Update failed',
					description:
						(error as Error).message || 'An unexpected error occurred',
					duration: 3000,
				});
				console.error(error);
			} finally {
				setUpdatingItemId(null);
			}
		});
	};

	// Calculate statistics
	const totalItems = groceryList.categories.reduce(
		(sum, cat) => sum + cat.items.length,
		0,
	);
	const purchasedItems = groceryList.categories.reduce(
		(sum, cat) => sum + cat.items.filter((item) => item.isPurchased).length,
		0,
	);

	return (
		<div className="space-y-5 px-1">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<ShoppingCart className="w-5 h-5 text-primary" />
					<h2 className="text-xl font-semibold">{groceryList.name}</h2>
				</div>
				<Button
					variant="ghost"
					size="sm"
					className="hover:bg-primary/10 transition-colors"
					onClick={_copyToClipboard}
				>
					<Copy className="w-4 h-4 mr-2" />
					Copy
				</Button>
			</div>

			<div className="space-y-4">
				{groceryList.categories.map((category) => (
					<div key={category.id} className="pb-2">
						<button
							type="button"
							className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer w-full text-left"
							onClick={() => toggleCategory(category.id)}
							onKeyDown={(e) => e.key === 'Enter' && toggleCategory(category.id)}
							aria-expanded={expandedCategories.has(category.id)}
						>
							<h3 className="font-semibold text-md">{category.name}</h3>
							<ChevronDown
								className={`w-5 h-5 transition-transform ${
									expandedCategories.has(category.id) ? 'rotate-180' : ''
								}`}
							/>
						</button>

						{expandedCategories.has(category.id) && (
							<ul className="mt-2 space-y-2 pl-4 border-l-2 border-primary/20">
								{category.items.map((item) => (
									<li
										key={item.id}
										className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
									>
										<div className="flex items-center gap-3">
											<Checkbox
												id={`item-${item.id}`}
												checked={item.isPurchased}
												onCheckedChange={() =>
													handleToggleItem(item.id, item.isPurchased)
												}
												disabled={updatingItemId === item.id}
											/>
											<label
												htmlFor={`item-${item.id}`}
												className={`text-sm ${
													item.isPurchased ? 'line-through text-muted-foreground' : ''
												}`}
											>
												{item.name} -{' '}
												<span className="text-xs text-muted-foreground">
													{item.quantity} {item.unit}
												</span>
											</label>
										</div>
										{updatingItemId === item.id && (
											<Loader2 className="w-4 h-4 animate-spin" />
										)}
									</li>
								))}
							</ul>
						)}
					</div>
				))}
			</div>

			<div className="sticky bottom-0 left-0 right-0 mt-4 p-3 bg-background border-t border-border shadow-md">
				<div className="w-full bg-muted rounded-full h-2">
					<div
						className="bg-primary h-2 rounded-full transition-all duration-300"
						style={{
							width: `${Math.round((purchasedItems / totalItems) * 100)}%`,
						}}
					/>
				</div>
				<div className="flex items-center justify-between mt-2 text-xs">
					<span>
						{purchasedItems} of {totalItems} items
					</span>
					<span className="font-bold text-primary">
						{totalItems > 0
							? `${Math.round((purchasedItems / totalItems) * 100)}%`
							: '0%'}
					</span>
				</div>
			</div>
		</div>
	);
}
