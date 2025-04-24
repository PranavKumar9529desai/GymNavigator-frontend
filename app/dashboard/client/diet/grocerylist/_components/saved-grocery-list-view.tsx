'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useTransition } from 'react';
import type { SavedGroceryList } from '../_actions/fetch-saved-grocery-lists';
import { updateGroceryItem } from '../_actions/update-grocery-item';

interface SavedGroceryListViewProps {
	groceryList: SavedGroceryList;
}

export function SavedGroceryListView({
	groceryList,
}: SavedGroceryListViewProps) {
	const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
		new Set(
			groceryList.categories.map((cat) => cat.id), // Default all expanded
		),
	);
	const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
	const { toast } = useToast();
	const queryClient = useQueryClient();

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
			.map((category) => {
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

	// Use React Query mutation for updating grocery items
	const { mutate: toggleItemPurchased, isPending: isUpdating } = useMutation({
		mutationFn: async ({
			itemId,
			currentStatus,
		}: {
			itemId: number;
			currentStatus: boolean;
		}) => {
			const result = await updateGroceryItem({
				itemId,
				isPurchased: !currentStatus,
			});

			if (!result.success) {
				throw new Error(result.error || 'Failed to update item status');
			}

			return { itemId, isPurchased: !currentStatus };
		},
		onMutate: async ({ itemId, currentStatus }) => {
			setUpdatingItemId(itemId);

			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['groceryLists'] });

			// Snapshot the previous value
			const previousGroceryLists = queryClient.getQueryData(['groceryLists']);

			// Optimistically update the UI
			queryClient.setQueryData(
				['groceryLists'],
				(old: SavedGroceryList[] | undefined) => {
					if (!old) return old;

					return old.map((list) => {
						if (list.id === groceryList.id) {
							return {
								...list,
								categories: list.categories.map((category) => ({
									...category,
									items: category.items.map((item) =>
										item.id === itemId
											? { ...item, isPurchased: !currentStatus }
											: item,
									),
								})),
							};
						}
						return list;
					});
				},
			);

			// Update the current groceryList prop to reflect the change
			const updatedCategories = groceryList.categories.map((category) => ({
				...category,
				items: category.items.map((item) =>
					item.id === itemId ? { ...item, isPurchased: !currentStatus } : item,
				),
			}));

			groceryList.categories = updatedCategories;

			return { previousGroceryLists };
		},
		onSuccess: (_data, variables) => {
			toast({
				title: variables.currentStatus
					? 'Item unmarked'
					: 'Item marked as purchased',
				duration: 2000,
			});
		},
		onError: (error, _variables, context) => {
			// Revert to the previous state if mutation fails
			if (context?.previousGroceryLists) {
				queryClient.setQueryData(
					['groceryLists'],
					context.previousGroceryLists,
				);
			}

			toast({
				variant: 'destructive',
				title: 'Update failed',
				description: (error as Error).message || 'An unexpected error occurred',
				duration: 3000,
			});
			console.error(error);
		},
		onSettled: () => {
			setUpdatingItemId(null);
			// Refresh the data
			queryClient.invalidateQueries({ queryKey: ['groceryLists'] });
		},
	});

	const handleToggleItem = (itemId: number, currentStatus: boolean) => {
		toggleItemPurchased({ itemId, currentStatus });
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
							onKeyUp={() => toggleCategory(category.id)}
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
													'flex items-center justify-between p-2 rounded-md transition-all duration-200',
													item.isPurchased ? 'bg-muted/40' : 'bg-background',
													isUpdatingThisItem && 'opacity-70',
												)}
											>
												<div className="flex items-center gap-2">
													<Checkbox
														checked={item.isPurchased}
														onCheckedChange={() =>
															handleToggleItem(item.id, item.isPurchased)
														}
														id={`item-${item.id}`}
														disabled={isUpdating && isUpdatingThisItem}
														className={cn(
															'h-4 w-4 rounded-sm border-primary/50',
															item.isPurchased && 'bg-primary border-primary',
														)}
													/>
													<label
														htmlFor={`item-${item.id}`}
														className={cn(
															'flex flex-col cursor-pointer',
															item.isPurchased &&
																'line-through text-muted-foreground',
														)}
													>
														<span className="text-sm font-medium">
															{item.name}
														</span>
														{item.notes && (
															<span className="text-xs text-muted-foreground">
																{item.notes}
															</span>
														)}
													</label>
												</div>
												<span
													className={cn(
														'text-xs font-medium px-2 py-1 rounded-md bg-primary/5',
														item.isPurchased &&
															'bg-muted text-muted-foreground',
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
						{Math.round((purchasedItems / totalItems) * 100)}%
					</span>
				</div>
			</div>
		</div>
	);
}
