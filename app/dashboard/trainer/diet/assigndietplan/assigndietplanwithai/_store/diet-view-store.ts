'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DietPlan } from '../../_actions /GetallDiets';

export interface DietHistoryItem {
  id: string;
  clientName: string;
  dietPlan: DietPlan;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export type TabType = 'generate' | 'diet' | 'history';

interface DietViewStore {
  // State
  activeTab: TabType;
  activeDiet: { clientName: string; dietPlan: DietPlan } | null;
  showDietDetails: boolean;

  // Actions
  setActiveTab: (tab: TabType) => void;
  setActiveDiet: (diet: { clientName: string; dietPlan: DietPlan } | null) => void;
  setShowDietDetails: (show: boolean) => void;
  reset: () => void;

  // Storage actions
  saveDietToLocalStorage: (
    diet: { clientName: string; dietPlan: DietPlan },
    userId: string,
  ) => string;
  getSavedDiets: (userId?: string) => DietHistoryItem[];
  clearDietHistory: () => void;
}

// Helper to generate a unique ID
const generateId = () => `diet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useDietViewStore = create<DietViewStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'generate',
      activeDiet: null,
      showDietDetails: false,

      // Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setActiveDiet: (diet) => set({ activeDiet: diet }),
      setShowDietDetails: (show) => set({ showDietDetails: show }),
      reset: () =>
        set({
          activeTab: 'generate',
          activeDiet: null,
          showDietDetails: false,
        }),

      // Storage actions
      saveDietToLocalStorage: (diet, userId) => {
        const dietId = generateId();

        // Create the diet history item
        const dietHistoryItem: DietHistoryItem = {
          id: dietId,
          clientName: diet.clientName,
          dietPlan: diet.dietPlan,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: userId,
        };

        // Get existing saved diets
        const existingSavedDiets = get().getSavedDiets();

        // Add the new diet
        const updatedDiets = [...existingSavedDiets, dietHistoryItem];

        // Save the updated diets to localStorage
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('gym-navigator-saved-diets', JSON.stringify(updatedDiets));
          }
        } catch (error) {
          console.error('Failed to save diet to localStorage:', error);
        }

        return dietId;
      },

      getSavedDiets: (userId) => {
        if (typeof window === 'undefined') return [];

        try {
          const savedDietsStr = localStorage.getItem('gym-navigator-saved-diets');
          if (!savedDietsStr) return [];

          const allSavedDiets = JSON.parse(savedDietsStr) as DietHistoryItem[];

          // Filter by userId if provided
          return userId ? allSavedDiets.filter((diet) => diet.userId === userId) : allSavedDiets;
        } catch (error) {
          console.error('Failed to retrieve saved diets:', error);
          return [];
        }
      },

      clearDietHistory: () => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('gym-navigator-saved-diets');
          } catch (error) {
            console.error('Failed to clear diet history:', error);
          }
        }
      },
    }),
    {
      name: 'diet-view-store', // unique name for localStorage
      // Only persist specific keys
      partialize: (state) => ({
        activeTab: state.activeTab,
        activeDiet: state.activeDiet,
      }),
    },
  ),
);
