export interface GroceryItem {
	id: number;
	name: string;
	quantity: number | string;
	unit: string;
	isPurchased: boolean;
}

export interface GroceryCategory {
	id: number;
	name: string;
	items: GroceryItem[];
}

export interface SavedGroceryList {
	id: number;
	name: string;
	categories: GroceryCategory[];
}
