import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, ArrowRight, ArrowLeft, Target, Sparkles, CheckCircle } from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveGuideProps {
  step: OnboardingStep;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  onDismiss: () => void;
  className?: string;
}

const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  onDismiss,
  className
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [highlightPosition, setHighlightPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Find and highlight target element
  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Calculate position for highlight
        const rect = element.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });

        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
    } else {
      setTargetElement(null);
      setHighlightPosition(null);
    }
  }, [step.target]);

  const progress = ((currentStepIndex + 1) / totalSteps) * 100;
  const canGoBack = currentStepIndex > 0 && onPrevious;

  return (
    <>
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Element highlight */}
      {highlightPosition && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[65] pointer-events-none"
          style={{
            top: highlightPosition.top - 8,
            left: highlightPosition.left - 8,
            width: highlightPosition.width + 16,
            height: highlightPosition.height + 16,
          }}
        >
          <div className="w-full h-full border-2 border-primary rounded-lg shadow-lg shadow-primary/20 animate-pulse" />
          <div className="absolute -top-2 -right-2">
            <Target className="h-5 w-5 text-primary animate-bounce" />
          </div>
        </motion.div>
      )}

      {/* Guide card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`fixed z-[70] ${className || 'bottom-8 right-8 max-w-sm'}`}
      >
        <Card className="shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur">
          <CardHeader className="relative pb-3">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                Step {currentStepIndex + 1} of {totalSteps}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Progress value={progress} className="h-1.5 mb-3" />
            
            <CardTitle className="text-lg flex items-center gap-2">
              {step.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
              {step.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>

            {step.content && (
              <div className="bg-muted/30 p-3 rounded-md border">
                {step.content}
              </div>
            )}

            {step.action && (
              <div className="bg-primary/5 p-3 rounded-md border border-primary/20">
                <Button
                  onClick={step.action.onClick}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/50 hover:bg-primary/10"
                >
                  {step.action.label}
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex gap-2">
                {canGoBack && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevious}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back
                  </Button>
                )}
                
                {step.skippable && onSkip && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSkip}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Skip
                  </Button>
                )}
              </div>

              <Button
                onClick={onNext}
                size="sm"
                className="flex items-center gap-1"
              >
                {currentStepIndex + 1 === totalSteps ? 'Complete' : 'Next'}
                {currentStepIndex + 1 < totalSteps && <ArrowRight className="h-3 w-3" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default InteractiveGuide;