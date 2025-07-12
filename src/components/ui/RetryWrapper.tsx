import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import SmartErrorAlert from './SmartErrorAlert';

interface RetryWrapperProps {
  children: React.ReactNode;
  onRetry: () => Promise<void> | void;
  maxRetries?: number;
  retryDelay?: number;
  fallback?: React.ReactNode;
  errorContext?: Record<string, any>;
}

const RetryWrapper: React.FC<RetryWrapperProps> = ({
  children,
  onRetry,
  maxRetries = 3,
  retryDelay = 1000,
  fallback,
  errorContext = {}
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<any>(null);
  const { handleError } = useErrorHandler();

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    setError(null);

    try {
      // Add delay before retry
      if (retryDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      await onRetry();
      setRetryCount(0); // Reset on success
    } catch (err) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      setError(err);
      
      handleError(err, {
        ...errorContext,
        retryCount: newRetryCount,
        maxRetries,
        retryAction: newRetryCount < maxRetries ? handleRetry : undefined
      });
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, maxRetries, retryDelay, onRetry, handleError, errorContext]);

  if (error && retryCount >= maxRetries) {
    return (
      <div className="space-y-4">
        <SmartErrorAlert 
          error={{
            title: 'Maximum Retries Exceeded',
            description: `Failed after ${maxRetries} attempts. Please try again later or contact support if the problem persists.`,
            errorCode: 'MAX_RETRIES_EXCEEDED',
            isRecoverable: true,
            canRetry: false,
            actions: [
              {
                label: 'Reset and Try Again',
                action: () => {
                  setRetryCount(0);
                  setError(null);
                  handleRetry();
                }
              }
            ]
          }}
        />
        {fallback}
      </div>
    );
  }

  if (error && retryCount < maxRetries) {
    return (
      <div className="space-y-4">
        <SmartErrorAlert 
          error={{
            title: 'Action Failed',
            description: `Attempt ${retryCount} of ${maxRetries} failed. ${maxRetries - retryCount} retries remaining.`,
            errorCode: 'RETRY_AVAILABLE',
            isRecoverable: true,
            canRetry: true,
            actions: [
              {
                label: isRetrying ? 'Retrying...' : 'Retry Now',
                action: handleRetry,
                variant: 'default'
              }
            ]
          }}
        />
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RetryWrapper;