
import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface FeatureTooltipProps {
  children: React.ReactNode;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showIcon?: boolean;
}

const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  children,
  title,
  description,
  position = 'top',
  showIcon = true
}) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <div className="inline-block relative group">
            {children}
            {showIcon && (
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full p-0.5 cursor-help">
                <Info className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side={position} className="bg-white p-3 shadow-lg border border-border max-w-xs">
          <div className="space-y-1">
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeatureTooltip;
