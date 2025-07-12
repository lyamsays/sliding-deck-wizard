import React from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NetworkIndicator: React.FC = () => {
  const networkStatus = useNetworkStatus();

  if (networkStatus.isOnline && !networkStatus.isSlowConnection) {
    return null; // Don't show indicator when everything is fine
  }

  const getIndicatorContent = () => {
    if (!networkStatus.isOnline) {
      return {
        icon: <WifiOff className="h-3 w-3" />,
        text: 'Offline',
        variant: 'destructive' as const,
        tooltip: 'You are currently offline. Some features may not work.'
      };
    }

    if (networkStatus.isSlowConnection) {
      return {
        icon: <Signal className="h-3 w-3" />,
        text: 'Slow',
        variant: 'secondary' as const,
        tooltip: `Slow connection detected (${networkStatus.effectiveType}). Some features may take longer to load.`
      };
    }

    return {
      icon: <Wifi className="h-3 w-3" />,
      text: 'Online',
      variant: 'default' as const,
      tooltip: 'Connected to the internet'
    };
  };

  const { icon, text, variant, tooltip } = getIndicatorContent();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className="flex items-center gap-1 text-xs">
            {icon}
            {text}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NetworkIndicator;