import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  Lightbulb,
  Users
} from 'lucide-react';

type StatusType = 'loading' | 'success' | 'error' | 'warning';

interface StatusMessage {
  type: StatusType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  tips?: string[];
  estimatedTime?: string;
}

interface SmartStatusProps {
  status: StatusMessage;
  progress?: number;
  showProgress?: boolean;
}

const SmartStatus: React.FC<SmartStatusProps> = ({ 
  status, 
  progress = 0,
  showProgress = false 
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Rotate tips every 3 seconds
  useEffect(() => {
    if (status.tips && status.tips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % status.tips!.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [status.tips]);

  const getIcon = () => {
    switch (status.type) {
      case 'loading':
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getVariant = () => {
    switch (status.type) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  const getBgColor = () => {
    switch (status.type) {
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Alert className={`${getBgColor()} relative overflow-hidden`} variant={getVariant()}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertDescription className="font-semibold text-base m-0">
                {status.title}
              </AlertDescription>
              {status.estimatedTime && status.type === 'loading' && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  ~{status.estimatedTime}
                </Badge>
              )}
            </div>
            <AlertDescription className="text-sm m-0">
              {status.message}
            </AlertDescription>
          </div>

          {/* Progress bar for loading states */}
          {showProgress && status.type === 'loading' && (
            <div className="space-y-1">
              <div className="w-full bg-white/60 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </div>
            </div>
          )}

          {/* Tips section */}
          {status.tips && status.tips.length > 0 && (
            <div className="bg-white/60 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Lightbulb className="h-3 w-3" />
                <span>Pro Tip</span>
                {status.tips.length > 1 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {currentTipIndex + 1}/{status.tips.length}
                  </Badge>
                )}
              </div>
              <div className="text-sm">
                {status.tips[currentTipIndex]}
              </div>
            </div>
          )}

          {/* Action button */}
          {status.action && (
            <Button 
              onClick={status.action.onClick}
              size="sm"
              variant={status.type === 'error' ? 'destructive' : 'default'}
              className="mt-3"
            >
              {status.action.label}
            </Button>
          )}
        </div>
      </div>

      {/* Success celebration effect */}
      {status.type === 'success' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse" />
      )}
    </Alert>
  );
};

export default SmartStatus;