'use client';

import * as React from 'react';
import { Wifi, WifiOff, Cloud, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConnectionStatusIndicator() {
  const [isOnline, setIsOnline] = React.useState(true);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Set initial state from navigator
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }
    

    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);

      // Simulate a sync process
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        setIsSyncing(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsSyncing(false);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);
  
  if (isOnline && !isSyncing) {
    return null; // Don't show anything when everything is normal
  }

  const getStatusContent = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-5 w-5" />,
        bgColor: 'bg-yellow-600 dark:bg-yellow-700',
        title: 'You are offline',
        message: 'Your changes are being saved locally.',
      };
    }
    if (isSyncing) {
      return {
        icon: <Cloud className="h-5 w-5 animate-pulse" />,
        bgColor: 'bg-blue-600 dark:bg-blue-700',
        title: 'Back online!',
        message: 'Syncing your data...',
      };
    }
    // This state is very brief as the component will hide, but we handle it
    return {
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: 'bg-green-600 dark:bg-green-700',
      title: 'All data synced',
      message: 'Your device is up to date.',
    };
  };

  const { icon, bgColor, title, message } = getStatusContent();

  return (
    <div className={cn("fixed top-[65px] md:top-0 left-0 right-0 z-50 text-white py-2 px-4 animate-in fade-in-50", bgColor)}>
      <div className="container mx-auto flex items-center justify-center text-center gap-3">
        {icon}
        <div>
            <p className="font-bold text-sm">{title}</p>
            <p className="text-xs">{message}</p>
        </div>
      </div>
    </div>
  );
}
