
import React from 'react';
import { FileText, Palette, Edit, Download } from 'lucide-react';

interface CreationStepsProps {
  currentStep: 'input' | 'generating' | 'editing' | 'exporting';
}

const CreationSteps: React.FC<CreationStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 'input', label: 'Input Content', icon: FileText },
    { id: 'generating', label: 'Design Slides', icon: Palette },
    { id: 'editing', label: 'Customize', icon: Edit },
    { id: 'exporting', label: 'Present', icon: Download }
  ];
  
  // Find the index of the current step
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
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
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${circleClasses} transition-all duration-300`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`mt-2 text-sm sm:text-base font-display ${textClasses} transition-all duration-300`}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 ${lineClasses} transition-all duration-500 transform`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CreationSteps;
