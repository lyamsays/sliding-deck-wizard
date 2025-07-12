import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, X, ArrowRight, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureCalloutProps {
  title: string;
  description: string;
  target?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | 'center';
  autoShow?: boolean;
  delay?: number;
}

const FeatureCallout: React.FC<FeatureCalloutProps> = ({
  title,
  description,
  target,
  action,
  onDismiss,
  variant = 'primary',
  position = 'top-right',
  autoShow = true,
  delay = 2000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [autoShow, delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-primary/20 bg-primary/5';
      case 'secondary':
        return 'border-secondary/20 bg-secondary/5';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`fixed z-50 max-w-sm ${getPositionClasses()}`}
      >
        <Card className={`shadow-lg ${getVariantClasses()}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  New Feature
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-5 w-5 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {target && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Target className="h-3 w-3" />
                Look for the highlighted element
              </div>
            )}

            {action && (
              <Button
                onClick={action.onClick}
                size="sm"
                className="w-full flex items-center gap-1"
              >
                {action.label}
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureCallout;