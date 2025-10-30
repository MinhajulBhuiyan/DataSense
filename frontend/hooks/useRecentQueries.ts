import { useState, useEffect } from 'react';
import { STORAGE_KEYS, MAX_RECENT_QUERIES } from '@/utils/constants';

/**
 * Custom hook for managing recent queries with localStorage persistence
 */
export function useRecentQueries() {
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_QUERIES);
    if (saved) {
      try {
        setRecentQueries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent queries:', e);
      }
    }
  }, []);

  const saveRecentQuery = (query: string) => {
    const updatedQueries = [query, ...recentQueries.filter(q => q !== query)]
      .slice(0, MAX_RECENT_QUERIES);
    setRecentQueries(updatedQueries);
    localStorage.setItem(STORAGE_KEYS.RECENT_QUERIES, JSON.stringify(updatedQueries));
  };

  return { recentQueries, saveRecentQuery };
}
