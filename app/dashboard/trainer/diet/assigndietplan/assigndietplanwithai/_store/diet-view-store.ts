"use client";

import { create } from 'zustand';
import type { DietPlan } from '../../_actions /GetallDiets';

export interface DietHistoryItem {
  id: string;
  clientName: string;
  dietPlan: DietPlan;
  createdAt: string;
  updatedAt: string;
}

export type TabType = "generate" | "diet" | "history";

interface DietViewStore {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  activeDiet: { clientName: string; dietPlan: DietPlan } | null;
  setActiveDiet: (diet: { clientName: string; dietPlan: DietPlan } | null) => void;
  
  showDietDetails: boolean;
  setShowDietDetails: (show: boolean) => void;
  
  reset: () => void;
}

export const useDietViewStore = create<DietViewStore>((set) => ({
  activeTab: "generate",
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  activeDiet: null,
  setActiveDiet: (diet) => set({ activeDiet: diet }),
  
  showDietDetails: false,
  setShowDietDetails: (show) => set({ showDietDetails: show }),
  
  reset: () => set({
    activeTab: "generate",
    activeDiet: null,
    showDietDetails: false,
  }),
})); 