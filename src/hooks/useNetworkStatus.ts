import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

export const useNetworkStatus = () => {
  const { toast } = useToast();
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    effectiveType: '4g',
    downlink: 10,
    rtt: 100
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      const isSlowConnection = connection ? 
        (connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' ||
         connection.downlink < 1.5) : false;

      setNetworkStatus({
        isOnline: navigator.onLine,
        isSlowConnection,
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || '4g',
        downlink: connection?.downlink || 10,
        rtt: connection?.rtt || 100
      });
    };

    const handleOnline = () => {
      updateNetworkStatus();
      toast({
        title: 'Connection Restored',
        description: 'You are back online. Any pending actions will resume.',
        variant: 'default'
      });
    };

    const handleOffline = () => {
      updateNetworkStatus();
      toast({
        title: 'Connection Lost',
        description: 'You are currently offline. Some features may not work until connection is restored.',
        variant: 'destructive'
      });
    };

    const handleConnectionChange = () => {
      updateNetworkStatus();
      
      // Show warning for slow connections
      const connection = (navigator as any).connection;
      if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        toast({
          title: 'Slow Connection Detected',
          description: 'Your connection appears slow. Some features may take longer to load.',
          variant: 'default'
        });
      }
    };

    // Initial status update
    updateNetworkStatus();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Listen for connection changes if supported
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [toast]);

  return networkStatus;
};