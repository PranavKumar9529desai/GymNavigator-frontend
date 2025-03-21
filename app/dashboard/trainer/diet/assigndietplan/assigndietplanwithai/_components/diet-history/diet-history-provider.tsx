"use client";

import { useSession } from "next-auth/react";
// biome-ignore lint/style/useImportType: <Diet hsitory provider need it>
import  React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getDietHistory } from "../../_actions/get-diet-history";
import type { DietHistoryItem } from "../../_store/diet-view-store";

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

  const fetchHistory = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const result = await getDietHistory(session.user.id);
      if (result.success && result.data) {
        setHistory(result.data);
        setError(null);
      } else {
        setError(result.message || "Failed to load diet history");
      }
    } catch (err) {
      console.error("Error fetching diet history:", err);
      setError("An unexpected error occurred while loading diet history");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

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
