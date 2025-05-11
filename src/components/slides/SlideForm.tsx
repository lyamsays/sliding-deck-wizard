
import React, { useState, useEffect } from 'react';
import { Loader } from "lucide-react";
import SlideFormSteps from './form/SlideFormSteps';

interface SlideFormProps {
  isGenerating: boolean;
  error: string | null;
  slideContent: string;
  profession: string;
  purpose: string;
  tone: string;
  generationProgress: number;
  autoGenerateImages: boolean;
  selectedTheme: string;
  framework?: string;
  setSlideContent: (content: string) => void;
  setProfession: (profession: string) => void;
  setPurpose: (purpose: string) => void;
  setTone: (tone: string) => void;
  setAutoGenerateImages: (autoGenerate: boolean) => void;
  setSelectedTheme: (theme: string) => void;
  setFramework?: (framework: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTryExample: () => void;
}

const SlideForm: React.FC<SlideFormProps> = ({
  isGenerating,
  error,
  slideContent,
  profession,
  purpose,
  tone,
  generationProgress,
  autoGenerateImages,
  selectedTheme,
  framework,
  setSlideContent,
  setProfession,
  setPurpose,
  setTone,
  setAutoGenerateImages,
  setSelectedTheme,
  setFramework,
  onSubmit,
  onTryExample
}) => {
  // New state for the two-step process
  const [currentStep, setCurrentStep] = useState<'metadata' | 'content'>('metadata');
  
  const handleNext = () => {
    setCurrentStep('content');
  };

  const handleBack = () => {
    setCurrentStep('metadata');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };
  
  return (
    <form onSubmit={handleSubmitForm} className="space-y-6 animate-fade-up">
      <SlideFormSteps
        isGenerating={isGenerating}
        error={error}
        currentStep={currentStep}
        slideContent={slideContent}
        profession={profession}
        purpose={purpose}
        tone={tone}
        generationProgress={generationProgress}
        autoGenerateImages={autoGenerateImages}
        selectedTheme={selectedTheme}
        framework={framework}
        setSlideContent={setSlideContent}
        setProfession={setProfession}
        setPurpose={setPurpose}
        setTone={setTone}
        setAutoGenerateImages={setAutoGenerateImages}
        setSelectedTheme={setSelectedTheme}
        setFramework={setFramework}
        handleNext={handleNext}
        handleBack={handleBack}
        onTryExample={onTryExample}
      />
    </form>
  );
};

export default SlideForm;
