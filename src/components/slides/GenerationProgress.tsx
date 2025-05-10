
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GenerationProgressProps {
  isGenerating: boolean;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ isGenerating }) => {
  if (!isGenerating) {
    return null;
  }
  
  return (
    <div className="mt-16 space-y-12 animate-fade-up">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Preparing Your Slides</h2>
      
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden border-gray-200">
            <CardHeader className="bg-primary/5 pb-3">
              <Skeleton className="h-7 w-3/4" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GenerationProgress;
