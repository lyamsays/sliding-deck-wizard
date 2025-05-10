
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
}

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  onOpenChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      title: "Welcome to SlideAI",
      description: "Create professional presentations in seconds using AI. Let's walk through how it works."
    },
    {
      title: "Input Your Content",
      description: "Start by pasting your notes or bullet points. Choose your profession and presentation purpose to customize the output."
    },
    {
      title: "Generate Slides",
      description: "Our AI will transform your content into beautifully formatted slides with suggested visuals."
    },
    {
      title: "Edit and Customize",
      description: "Fine-tune your slides directly in the editor. Change text, adjust layouts, and add images."
    },
    {
      title: "Export Your Presentation",
      description: "When you're satisfied, export your presentation as a PDF or PowerPoint file."
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
    }
  };
  
  const handleSkip = () => {
    onOpenChange(false);
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Progress indicator */}
          <div className="flex justify-center mb-4">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 rounded-full mx-1 transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-primary' 
                    : index < currentStep 
                      ? 'w-4 bg-primary/70' 
                      : 'w-4 bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          {/* Step content */}
          <div className="text-center space-y-4 px-4">
            <div className="h-32 flex items-center justify-center">
              {currentStep === 0 && (
                <div className="animate-float">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </div>
                </div>
              )}
              
              {currentStep > 0 && (
                <div className="text-2xl font-bold text-primary animate-fade-in">
                  Step {currentStep}
                </div>
              )}
            </div>
            
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip}>
              Skip Tour
            </Button>
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
