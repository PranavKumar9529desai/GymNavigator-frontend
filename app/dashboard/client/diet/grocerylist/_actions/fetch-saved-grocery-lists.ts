'use server';

import { auth } from '@/app/(auth)/auth';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

export type SavedGroceryList = {
  id: number;
  userId: number;
  timeFrame: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  categories: Array<{
    id: number;
    groceryListId: number;
    categoryId: string;
    name: string;
    items: Array<{
      id: number;
      groceryCategoryId: number;
      name: string;
      quantity: number;
      unit: string;
      notes: string | null;
      isPurchased: boolean;
    }>;
  }>;
};

export type FetchGroceryListsResult = {
  success: boolean;
  groceryLists?: SavedGroceryList[];
  error?: string;
};

/**
 * Fetch all saved grocery lists for the authenticated user
 */
export async function fetchSavedGroceryLists(): Promise<FetchGroceryListsResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Fetch saved grocery lists from the backend
    const clientAxios = await ClientReqConfig();
    const response = await clientAxios.get('/client/diet/grocerylists');
    
    if (!response.data?.success) {
      return { 
        success: false, 
        error: response.data?.error || 'Failed to fetch grocery lists'
      };
    }
    
    return {
      success: true,
      groceryLists: response.data.data
    };
    
  } catch (error) {
    console.error('Error in fetchSavedGroceryLists:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Fetch a specific grocery list by ID
 */
export async function fetchGroceryListById(id: number): Promise<FetchGroceryListsResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Fetch the specific grocery list from the backend
    const clientAxios = await ClientReqConfig();
    const response = await clientAxios.get(`/client/diet/grocerylist/${id}`);
    
    if (!response.data?.success) {
      return { 
        success: false, 
        error: response.data?.error || 'Failed to fetch grocery list'
      };
    }
    
    return {
      success: true,
      groceryLists: [response.data.data]
    };
    
  } catch (error) {
    console.error('Error in fetchGroceryListById:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
} 