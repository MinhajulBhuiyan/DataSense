import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/utils/constants';

/**
 * Custom hook for checking API connection status
 */
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      setIsConnected(response.ok);
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return { isConnected, checkConnection };
}
