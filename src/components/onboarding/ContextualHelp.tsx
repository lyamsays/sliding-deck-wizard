import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Lightbulb, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextualHelpProps {
  title: string;
  content: string | React.ReactNode;
  trigger?: 'hover' | 'click';
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'tooltip' | 'popover';
  className?: string;
  children?: React.ReactNode;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({
  title,
  content,
  trigger = 'hover',
  position = 'top',
  variant = 'tooltip',
  className,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'tooltip') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {children || (
              <Button
                variant="ghost"
                size="sm"
                className={`h-5 w-5 p-0 text-muted-foreground hover:text-foreground ${className}`}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent side={position} className="max-w-sm">
            <div className="space-y-1">
              <p className="font-medium text-sm">{title}</p>
              <div className="text-xs text-muted-foreground">
                {typeof content === 'string' ? <p>{content}</p> : content}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="relative inline-block">
      <div
        onClick={() => trigger === 'click' && setIsOpen(!isOpen)}
        onMouseEnter={() => trigger === 'hover' && setIsOpen(true)}
        onMouseLeave={() => trigger === 'hover' && setIsOpen(false)}
      >
        {children || (
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 text-muted-foreground hover:text-foreground ${className}`}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 w-80 ${
              position === 'top' ? 'bottom-full mb-2' :
              position === 'bottom' ? 'top-full mt-2' :
              position === 'left' ? 'right-full mr-2' :
              'left-full ml-2'
            }`}
          >
            <Card className="shadow-lg border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">{title}</h4>
                  </div>
                  {trigger === 'click' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {typeof content === 'string' ? <p>{content}</p> : content}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextualHelp;