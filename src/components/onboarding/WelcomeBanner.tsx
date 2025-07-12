import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, Lightbulb, Target } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

const WelcomeBanner: React.FC = () => {
  const { shouldShowOnboarding, startFlow, isFlowCompleted } = useOnboarding();

  if (!shouldShowOnboarding() || isFlowCompleted('main')) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg">Welcome to Sliding.io! 🎉</h3>
              <p className="text-muted-foreground text-sm">
                Transform your ideas into professional slide decks in seconds. Let's get you started with a quick tour.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Join 50K+ professionals</span>
              </div>
              <div className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                <span>AI-powered creation</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>Professional results</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => startFlow('main')}
                size="sm"
                className="flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                Start Tour (2 min)
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.setItem('hasSeenApp', 'true');
                  window.location.reload();
                }}
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;