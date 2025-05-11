
import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import MetadataStep from './MetadataStep';
import ContentStep from './ContentStep';

interface SlideFormStepsProps {
  isGenerating: boolean;
  error: string | null;
  currentStep: 'metadata' | 'content';
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
  handleNext: () => void;
  handleBack: () => void;
  onTryExample: () => void;
}

const SlideFormSteps: React.FC<SlideFormStepsProps> = ({
  isGenerating,
  error,
  currentStep,
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
  handleNext,
  handleBack,
  onTryExample
}) => {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6 animate-fade-down">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Metadata & Theme Selection */}
      {currentStep === 'metadata' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">Step 1: Presentation Setup</h2>
            <p className="text-gray-500 mt-1">Let's start by setting up your presentation details</p>
          </div>

          <MetadataStep 
            profession={profession}
            purpose={purpose}
            tone={tone}
            selectedTheme={selectedTheme}
            framework={framework}
            setProfession={setProfession}
            setPurpose={setPurpose}
            setTone={setTone}
            setSelectedTheme={setSelectedTheme}
            setFramework={setFramework}
            isGenerating={isGenerating}
          />
          
          <div className="flex justify-end pt-4">
            <Button 
              type="button" 
              onClick={handleNext} 
              disabled={isGenerating || !profession || !tone}
              className="text-white bg-primary hover:bg-primary/90"
            >
              Continue to Content
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Content Input */}
      {currentStep === 'content' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-center">Step 2: Content Input</h2>
            <p className="text-gray-500 mt-1">Now, let's add your presentation content</p>
          </div>

          <ContentStep 
            slideContent={slideContent}
            setSlideContent={setSlideContent}
            autoGenerateImages={autoGenerateImages}
            setAutoGenerateImages={setAutoGenerateImages}
            isGenerating={isGenerating}
            onTryExample={onTryExample}
          />
          
          <div className="flex justify-between pt-4 max-w-3xl mx-auto">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={isGenerating}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Setup
            </Button>
            
            <Button 
              type="submit" 
              disabled={isGenerating || !slideContent.trim()}
              className="text-white bg-primary hover:bg-primary/90"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin" />
                  <span>Generating slides...</span>
                </div>
              ) : (
                "Generate Slides"
              )}
            </Button>
          </div>
        </motion.div>
      )}
      
      {isGenerating && (
        <div className="w-full mt-6 space-y-2">
          <Progress value={generationProgress} className="h-2 w-full" />
          <p className="text-sm text-center text-gray-500 italic">
            {generationProgress < 30 ? "Preparing your content..." : 
             generationProgress < 60 ? "Creating slides with AI..." : 
             generationProgress < 90 ? "Polishing your presentation..." : 
             "Finalizing your slides..."}
          </p>
        </div>
      )}
    </>
  );
};

export default SlideFormSteps;
