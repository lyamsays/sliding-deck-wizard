
import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreationStepsProps {
  currentStep: 'input' | 'generating' | 'editing' | 'exporting';
}

const CreationSteps: React.FC<CreationStepsProps> = ({ currentStep }) => {
  const steps = [
    {
      id: 'input',
      name: 'Input',
      description: 'Add content',
      status: currentStep === 'input' ? 'active' : 'completed',
    },
    {
      id: 'generating',
      name: 'Generating',
      description: 'AI creating slides',
      status: currentStep === 'generating' ? 'active' : currentStep === 'editing' || currentStep === 'exporting' ? 'completed' : 'upcoming',
    },
    {
      id: 'editing',
      name: 'Editing',
      description: 'Customize slides',
      status: currentStep === 'editing' ? 'active' : currentStep === 'exporting' ? 'completed' : 'upcoming',
    },
    {
      id: 'exporting',
      name: 'Exporting',
      description: 'Download or save',
      status: currentStep === 'exporting' ? 'active' : 'upcoming',
    },
  ];
  
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <li 
            key={step.id} 
            className={cn(
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-12' : '',
              'relative'
            )}
          >
            <div className="flex items-center">
              <div 
                className={cn(
                  step.status === 'completed' ? 'bg-primary' : 
                  step.status === 'active' ? 'border-2 border-primary bg-background' : 
                  'bg-gray-200',
                  'rounded-full h-8 w-8 flex items-center justify-center'
                )}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <span 
                    className={cn(
                      step.status === 'active' ? 'text-primary' : 'text-gray-500',
                      'text-sm font-medium'
                    )}
                  >
                    {stepIdx + 1}
                  </span>
                )}
              </div>
              <div className="hidden sm:block ml-4">
                <p 
                  className={cn(
                    step.status === 'active' ? 'text-primary' : 
                    step.status === 'completed' ? 'text-gray-900' : 
                    'text-gray-500',
                    'text-sm font-medium'
                  )}
                >
                  {step.name}
                </p>
                <p className="text-xs text-gray-500">
                  {step.description}
                </p>
              </div>
            </div>
            
            {stepIdx !== steps.length - 1 && (
              <div className={cn(
                'hidden sm:block absolute top-4 left-0 w-full',
                'flex items-center',
                stepIdx === 0 && 'ml-8'
              )}>
                <div
                  className={cn(
                    step.status === 'completed' ? 'bg-primary' : 'bg-gray-200',
                    'h-0.5 w-full ml-8'
                  )}
                />
                <ArrowRight
                  className={cn(
                    step.status === 'completed' ? 'text-primary' : 'text-gray-200',
                    'h-3 w-3 ml-1'
                  )}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CreationSteps;
