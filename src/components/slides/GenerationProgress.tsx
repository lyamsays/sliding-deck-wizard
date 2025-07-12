import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Palette, FileImage, CheckCircle } from 'lucide-react';

interface GenerationProgressProps {
  isGenerating: boolean;
  generationProgress: number;
  currentStep: string;
  autoGenerateImages: boolean;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  isGenerating,
  generationProgress,
  currentStep,
  autoGenerateImages
}) => {
  const steps = [
    {
      id: 'analyzing',
      label: 'Analyzing Content',
      icon: Brain,
      description: 'Understanding your presentation needs'
    },
    {
      id: 'structuring',
      label: 'Creating Structure',
      icon: Sparkles,
      description: 'Building professional slide outline'
    },
    {
      id: 'designing',
      label: 'Applying Design',
      icon: Palette,
      description: 'Adding visual elements and styling'
    },
    {
      id: 'images',
      label: 'Generating Images',
      icon: FileImage,
      description: 'Creating relevant visuals',
      conditional: autoGenerateImages
    },
    {
      id: 'finalizing',
      label: 'Finalizing',
      icon: CheckCircle,
      description: 'Polishing your presentation'
    }
  ].filter(step => !step.conditional || step.conditional);

  const getStepStatus = (stepProgress: number) => {
    if (generationProgress >= stepProgress + 20) return 'completed';
    if (generationProgress >= stepProgress) return 'active';
    return 'pending';
  };

  const getCurrentMessage = () => {
    if (generationProgress < 20) return "Analyzing your content and requirements...";
    if (generationProgress < 40) return "Creating professional slide structure...";
    if (generationProgress < 60) return "Applying design and formatting...";
    if (generationProgress < 80 && autoGenerateImages) return "Generating relevant images...";
    if (generationProgress < 90) return "Adding final touches...";
    return "Almost ready! Finalizing your presentation...";
  };

  if (!isGenerating) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          Creating Your Presentation
        </CardTitle>
        <p className="text-muted-foreground">
          {getCurrentMessage()}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <Badge variant="secondary" className="animate-pulse">
              {Math.round(generationProgress)}%
            </Badge>
          </div>
          <Progress value={generationProgress} className="h-3" />
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const stepProgress = (index * 100) / steps.length;
            const status = getStepStatus(stepProgress);
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  status === 'completed' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : status === 'active'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-secondary/20 border-border text-muted-foreground'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  status === 'completed' 
                    ? 'bg-green-100' 
                    : status === 'active'
                    ? 'bg-primary/20'
                    : 'bg-secondary'
                }`}>
                  <step.icon className={`h-4 w-4 ${
                    status === 'active' ? 'animate-pulse' : ''
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">
                    {step.label}
                  </div>
                  <div className="text-xs opacity-75 truncate">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Estimate */}
        <div className="text-center p-4 bg-secondary/20 rounded-lg">
          <div className="text-sm text-muted-foreground">
            Estimated time: {autoGenerateImages ? '30-45' : '15-30'} seconds
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Creating professional slides optimized for your audience
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerationProgress;