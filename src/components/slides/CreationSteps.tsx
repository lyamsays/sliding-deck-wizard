
import React from 'react';
import { Check, Edit, FileText, Download } from 'lucide-react';

interface CreationStepsProps {
  currentStep: 'input' | 'generating' | 'editing' | 'exporting';
}

const CreationSteps: React.FC<CreationStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 'input', label: 'Input Content', icon: FileText },
    { id: 'generating', label: 'Generate Slides', icon: Check },
    { id: 'editing', label: 'Edit & Customize', icon: Edit },
    { id: 'exporting', label: 'Export', icon: Download }
  ];
  
  // Find the index of the current step
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          // Determine the status of this step
          const isActive = step.id === currentStep;
          const isComplete = index < currentIndex;
          const isPending = index > currentIndex;
          
          // Dynamic classes based on step status
          const circleClasses = isActive
            ? "bg-primary text-primary-foreground border-primary"
            : isComplete
              ? "bg-primary/20 text-primary border-primary"
              : "bg-gray-100 text-gray-400 border-gray-200";
              
          const lineClasses = index < steps.length - 1 
            ? isComplete || isActive
              ? "bg-primary"
              : "bg-gray-200"
            : "";
            
          const textClasses = isActive
            ? "text-primary font-medium"
            : isComplete
              ? "text-gray-700"
              : "text-gray-400";
          
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${circleClasses} transition-all duration-300`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`mt-2 text-xs sm:text-sm ${textClasses} transition-all duration-300`}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${lineClasses} transition-all duration-500`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CreationSteps;
