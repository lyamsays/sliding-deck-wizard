import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline';
}

export interface EnhancedError {
  title: string;
  description: string;
  actions?: ErrorAction[];
  canRetry?: boolean;
  isRecoverable?: boolean;
  errorCode?: string;
  context?: Record<string, any>;
}

export const useErrorHandler = () => {
  const { toast } = useToast();
  const [lastError, setLastError] = useState<EnhancedError | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const parseError = useCallback((error: any, context?: Record<string, any>): EnhancedError => {
    // Handle different types of errors and provide user-friendly messages
    
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        title: 'Connection Problem',
        description: isOffline 
          ? 'You appear to be offline. Please check your internet connection.'
          : 'Unable to connect to our servers. This might be a temporary issue.',
        actions: [
          {
            label: 'Try Again',
            action: () => window.location.reload(),
            variant: 'default'
          },
          {
            label: 'Check Connection',
            action: () => window.open('https://www.google.com', '_blank'),
            variant: 'outline'
          }
        ],
        canRetry: true,
        isRecoverable: true,
        errorCode: 'NETWORK_ERROR',
        context
      };
    }

    // Timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      return {
        title: 'Request Timed Out',
        description: 'The request took too long to complete. This usually happens when our servers are busy.',
        actions: [
          {
            label: 'Retry',
            action: () => context?.retryAction?.(),
            variant: 'default'
          }
        ],
        canRetry: true,
        isRecoverable: true,
        errorCode: 'TIMEOUT_ERROR',
        context
      };
    }

    // OpenAI/AI specific errors
    if (error.message?.includes('quota') || error.message?.includes('exceeded')) {
      return {
        title: 'Service Temporarily Unavailable',
        description: 'Our AI service has reached its usage limit. This will reset soon, or you can try again later.',
        actions: [
          {
            label: 'Try Again Later',
            action: () => context?.retryAction?.(),
            variant: 'default'
          },
          {
            label: 'Use Example Content',
            action: () => context?.useExampleAction?.(),
            variant: 'outline'
          }
        ],
        canRetry: true,
        isRecoverable: true,
        errorCode: 'QUOTA_EXCEEDED',
        context
      };
    }

    // Authentication errors
    if (error.message?.includes('unauthorized') || error.message?.includes('authentication')) {
      return {
        title: 'Authentication Required',
        description: 'You need to sign in to access this feature.',
        actions: [
          {
            label: 'Sign In',
            action: () => window.location.href = '/signin',
            variant: 'default'
          }
        ],
        canRetry: false,
        isRecoverable: true,
        errorCode: 'AUTH_ERROR',
        context
      };
    }

    // Validation errors
    if (error.message?.includes('validation') || error.message?.includes('invalid')) {
      return {
        title: 'Invalid Input',
        description: 'Please check your input and try again. Make sure all required fields are filled out correctly.',
        actions: [
          {
            label: 'Review Input',
            action: () => context?.focusFirstError?.(),
            variant: 'default'
          }
        ],
        canRetry: true,
        isRecoverable: true,
        errorCode: 'VALIDATION_ERROR',
        context
      };
    }

    // File upload errors
    if (error.message?.includes('file') || error.message?.includes('upload')) {
      return {
        title: 'File Upload Failed',
        description: 'There was a problem uploading your file. Please check the file size and format.',
        actions: [
          {
            label: 'Try Again',
            action: () => context?.retryAction?.(),
            variant: 'default'
          },
          {
            label: 'Choose Different File',
            action: () => context?.selectFileAction?.(),
            variant: 'outline'
          }
        ],
        canRetry: true,
        isRecoverable: true,
        errorCode: 'FILE_ERROR',
        context
      };
    }

    // Generic server errors
    if (error.status >= 500) {
      return {
        title: 'Server Error',
        description: 'Something went wrong on our end. Our team has been notified and is working on a fix.',
        actions: [
          {
            label: 'Try Again',
            action: () => context?.retryAction?.(),
            variant: 'default'
          },
          {
            label: 'Go Back',
            action: () => window.history.back(),
            variant: 'outline'
          }
        ],
        canRetry: true,
        isRecoverable: true,
        errorCode: 'SERVER_ERROR',
        context
      };
    }

    // Default error
    return {
      title: 'Something Went Wrong',
      description: error.message || 'An unexpected error occurred. Please try again.',
      actions: [
        {
          label: 'Try Again',
          action: () => context?.retryAction?.(),
          variant: 'default'
        }
      ],
      canRetry: true,
      isRecoverable: true,
      errorCode: 'UNKNOWN_ERROR',
      context
    };
  }, [isOffline]);

  const handleError = useCallback((error: any, context?: Record<string, any>) => {
    const enhancedError = parseError(error, context);
    setLastError(enhancedError);

    // Log error for debugging (in production, this would go to an error tracking service)
    console.error('Enhanced Error:', {
      original: error,
      enhanced: enhancedError,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Show toast notification
    toast({
      title: enhancedError.title,
      description: enhancedError.description,
      variant: enhancedError.isRecoverable ? 'default' : 'destructive'
    });

    return enhancedError;
  }, [parseError, toast]);

  const retryLastAction = useCallback(() => {
    if (lastError?.context?.retryAction) {
      lastError.context.retryAction();
      setLastError(null);
    }
  }, [lastError]);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    handleError,
    lastError,
    retryLastAction,
    clearError,
    isOffline
  };
};