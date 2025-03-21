'use client';

import { useSession } from 'next-auth/react';
// biome-ignore lint/style/useImportType: <Diet hsitory provider need it>
import React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getDietHistory } from '../../_actions/get-diet-history';
import type { DietHistoryItem } from '../../_store/diet-view-store';
import { useDietViewStore } from '../../_store/diet-view-store';

interface DietHistoryContextType {
  loading: boolean;
  history: DietHistoryItem[];
  error: string | null;
  refreshHistory: () => Promise<void>;
}

const DietHistoryContext = createContext<DietHistoryContextType>({
  loading: true,
  history: [],
  error: null,
  refreshHistory: async () => {},
});

export const useDietHistory = () => useContext(DietHistoryContext);

export function DietHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<DietHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { getSavedDiets } = useDietViewStore();

  const fetchHistory = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      // First get diets from localStorage
      const localDiets = getSavedDiets(session.user.id);

      // Then get diets from backend
      const result = await getDietHistory(session.user.id);

      if (result.success && result.data) {
        // Combine local and backend diets, removing duplicates by id
        const backendDiets = result.data;
        const backendIds = new Set(backendDiets.map((diet) => diet.id));

        // Filter out local diets that already exist in backend results
        const uniqueLocalDiets = localDiets.filter((diet) => !backendIds.has(diet.id));

        // Combine and sort by createdAt (newest first)
        const combinedDiets = [...backendDiets, ...uniqueLocalDiets].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setHistory(combinedDiets);
        setError(null);
      } else {
        // If backend fails but we have local diets, use them without showing an error
        if (localDiets.length > 0) {
          setHistory(localDiets);
          setError(null);
        } else {
          // Only show error if we have no local diets to display
          setHistory(localDiets);
          setError(result.message || 'Failed to load diet history');
        }
      }
    } catch (err) {
      console.error('Error fetching diet history:', err);

      // Try to use local diets if backend fails
      const localDiets = getSavedDiets(session.user.id);
      if (localDiets.length > 0) {
        setHistory(localDiets);
        setError(null); // Don't show error when we have local diets
      } else {
        setError('An unexpected error occurred while loading diet history');
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, getSavedDiets]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session?.user?.id, fetchHistory]);

  return (
    <DietHistoryContext.Provider
      value={{
        loading,
        history,
        error,
        refreshHistory: fetchHistory,
      }}
    >
      {children}
    </DietHistoryContext.Provider>
  );
}
