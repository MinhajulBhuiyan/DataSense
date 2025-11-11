import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Theme } from '@/types';

/**
 * Custom hook for managing theme state with next-themes
 * Wraps next-themes to maintain backward compatibility with existing code
 */
export function useTheme() {
  const { theme: nextTheme, setTheme: setNextTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual theme being used
  const resolvedTheme = (nextTheme === 'system' ? systemTheme : nextTheme) as Theme;

  const toggleTheme = () => {
    setNextTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return { 
    theme: resolvedTheme || 'light',
    toggleTheme, 
    mounted 
  };
}

