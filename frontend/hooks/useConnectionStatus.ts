import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/utils/constants';

/**
 * Custom hook for checking API connection status
 */
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loraAvailable, setLoraAvailable] = useState(false);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setLoraAvailable(data.lora_available || false);
      } else {
        setIsConnected(false);
      }
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return { isConnected, loraAvailable, checkConnection };
}
