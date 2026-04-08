
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import ProfessionStep from './steps/ProfessionStep';
import PurposeStep from './steps/PurposeStep';
import ThemeStep from './steps/ThemeStep';
import ContentStep from './steps/ContentStep';
import { motion, AnimatePresence } from 'framer-motion';

export interface SetupData {
  profession: string;
  purpose: string;
  tone: string;
  selectedTheme: string;
  content: string;
  autoGenerateImages: boolean;
}

interface SetupWizardProps {
  onComplete: (data: SetupData) => void;
  onCancel: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    profession: 'Consultant',
    purpose: '',
    tone: 'Professional',
    selectedTheme: 'pristine',
    content: '',
    autoGenerateImages: true,
  });

  const steps = [
    { id: 'profession', title: 'Your Role', description: 'Tell us about yourself' },
    { id: 'purpose', title: 'Presentation Purpose', description: 'What are you presenting?' },
    { id: 'theme', title: 'Choose Style', description: 'Pick your visual theme' },
    { id: 'content', title: 'Add Content', description: 'Paste your notes or ideas' },
  ];

  const updateSetupData = (updates: Partial<SetupData>) => {
    setSetupData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the setup and trigger automatic slide generation
      onComplete(setupData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return setupData.profession.trim() !== '';
      case 1: return setupData.purpose.trim() !== '';
      case 2: return setupData.selectedTheme !== '';
      case 3: return setupData.content.trim() !== '';
      default: return true;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <h1 className="text-2xl font-bold text-purple-600">Setup Your Presentation</h1>
            <div className="w-16" /> {/* Spacer */}
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
        </CardHeader>

        <CardContent className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
                <p className="text-gray-600">{steps[currentStep].description}</p>
              </div>

              {currentStep === 0 && (
                <ProfessionStep
                  profession={setupData.profession}
                  setProfession={(profession) => updateSetupData({ profession })}
                />
              )}

              {currentStep === 1 && (
                <PurposeStep
                  purpose={setupData.purpose}
                  tone={setupData.tone}
                  setPurpose={(purpose) => updateSetupData({ purpose })}
                  setTone={(tone) => updateSetupData({ tone })}
                />
              )}

              {currentStep === 2 && (
                <ThemeStep
                  selectedTheme={setupData.selectedTheme}
                  setSelectedTheme={(selectedTheme) => updateSetupData({ selectedTheme })}
                  autoGenerateImages={setupData.autoGenerateImages}
                  setAutoGenerateImages={(autoGenerateImages) => updateSetupData({ autoGenerateImages })}
                />
              )}

              {currentStep === 3 && (
                <ContentStep
                  content={setupData.content}
                  setContent={(content) => updateSetupData({ content })}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Presentation
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupWizard;
