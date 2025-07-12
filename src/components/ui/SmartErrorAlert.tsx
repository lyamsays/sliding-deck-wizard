import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { EnhancedError } from '@/hooks/useErrorHandler';

interface SmartErrorAlertProps {
  error: EnhancedError;
  onDismiss?: () => void;
  className?: string;
}

const SmartErrorAlert: React.FC<SmartErrorAlertProps> = ({ 
  error, 
  onDismiss,
  className 
}) => {
  const getIcon = () => {
    switch (error.errorCode) {
      case 'NETWORK_ERROR':
        return <WifiOff className="h-4 w-4" />;
      case 'TIMEOUT_ERROR':
        return <Clock className="h-4 w-4" />;
      case 'QUOTA_EXCEEDED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    return error.isRecoverable ? 'default' : 'destructive';
  };

  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      <AlertTitle className="flex items-center justify-between">
        {error.title}
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDismiss}
            className="h-auto p-1 ml-2"
          >
            ×
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{error.description}</p>
        
        {error.actions && error.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {error.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.action}
                className="h-8"
              >
                {action.label === 'Try Again' && <RefreshCw className="mr-1 h-3 w-3" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {error.errorCode && (
          <div className="text-xs text-muted-foreground font-mono">
            Error Code: {error.errorCode}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SmartErrorAlert;