import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Play, RotateCcw } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

interface OnboardingProgressProps {
  className?: string;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ className }) => {
  const {
    state,
    startFlow,
    isFlowCompleted,
    resetOnboarding
  } = useOnboarding();

  const flows = [
    {
      id: 'main',
      name: 'Getting Started',
      description: 'Learn the basics of creating presentations',
      steps: 6
    },
    {
      id: 'slide-editing',
      name: 'Slide Editing',
      description: 'Master slide editing and customization',
      steps: 3
    }
  ];

  const completedFlows = flows.filter(flow => isFlowCompleted(flow.id));
  const totalProgress = (completedFlows.length / flows.length) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Learning Progress</CardTitle>
          <Badge variant="outline" className="text-xs">
            {completedFlows.length}/{flows.length} Complete
          </Badge>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {flows.map((flow) => {
          const isCompleted = isFlowCompleted(flow.id);
          const isActive = state.currentFlow === flow.id;
          
          return (
            <div
              key={flow.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isActive ? 'bg-primary/5 border-primary/20' : 
                isCompleted ? 'bg-green-50 border-green-200' : 
                'bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 ${
                  isCompleted ? 'text-green-500' : 
                  isActive ? 'text-primary' : 
                  'text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-sm">{flow.name}</h4>
                  <p className="text-xs text-muted-foreground">{flow.description}</p>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Step {state.currentStep + 1} of {flow.steps}
                    </Badge>
                  )}
                </div>
              </div>

              {!isCompleted && !isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startFlow(flow.id)}
                  className="flex items-center gap-1"
                >
                  <Play className="h-3 w-3" />
                  Start
                </Button>
              )}

              {isCompleted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startFlow(flow.id)}
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Replay
                </Button>
              )}
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={resetOnboarding}
            className="w-full text-xs text-muted-foreground"
          >
            Reset All Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingProgress;