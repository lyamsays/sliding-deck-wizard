import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Users, Target } from 'lucide-react';

interface SmartLoadingProps {
  message: string;
  progress?: number;
  tips?: string[];
  showProgress?: boolean;
}

const SmartLoading: React.FC<SmartLoadingProps> = ({ 
  message, 
  progress = 0, 
  tips = [],
  showProgress = false 
}) => {
  const defaultTips = [
    "💡 Tip: Be specific about your audience for better results",
    "🎯 Tip: Include key points you want to emphasize",
    "⚡ Tip: Mention the presentation length for optimal structure",
    "🎨 Tip: Professional themes work best for business presentations",
    "📊 Tip: Our AI automatically suggests relevant charts and visuals"
  ];

  const displayTips = tips.length > 0 ? tips : defaultTips;
  const currentTip = displayTips[Math.floor((progress / 100) * displayTips.length)] || displayTips[0];

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <CardTitle className="text-xl text-primary">
          {message}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showProgress && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Rotating tips */}
        <div className="bg-secondary/30 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            While you wait...
          </div>
          <div className="text-sm text-foreground">
            {currentTip}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <div className="text-xs text-muted-foreground">Avg. 30s</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <div className="text-xs text-muted-foreground">50K+ users</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Target className="h-4 w-4 text-primary" />
            <div className="text-xs text-muted-foreground">99% success</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartLoading;