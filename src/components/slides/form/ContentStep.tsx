
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand, Lightbulb } from "lucide-react";

interface ContentStepProps {
  slideContent: string;
  setSlideContent: (content: string) => void;
  isGenerating: boolean;
  generationProgress: number;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onTryExample: () => void;
  autoGenerateImages?: boolean;
  setAutoGenerateImages?: (autoGenerate: boolean) => void;
}

const ContentStep: React.FC<ContentStepProps> = ({
  slideContent,
  setSlideContent,
  isGenerating,
  generationProgress,
  onSubmit,
  onBack,
  onTryExample,
  autoGenerateImages,
  setAutoGenerateImages
}) => {
  const [showExample, setShowExample] = useState(true);

  // Effect to hide example button when user starts typing
  useEffect(() => {
    if (slideContent.trim() !== '') {
      setShowExample(false);
    } else {
      setShowExample(true);
    }
  }, [slideContent]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-center mb-4">Step 2: Content Input</h2>
        <p className="text-muted-foreground text-center mb-6">
          Enter your content below and we'll transform it into slides.
        </p>
      </div>
      
      <div className="space-y-4 relative">
        <Textarea
          placeholder="Enter your content here..."
          value={slideContent}
          onChange={(e) => setSlideContent(e.target.value)}
          className="min-h-[300px]"
        />
        
        {showExample && (
          <div className="absolute top-2 right-2 bg-purple-100 border border-purple-300 rounded-md shadow-sm transition-opacity">
            <Button
              type="button"
              onClick={onTryExample}
              variant="ghost"
              size="sm"
              className="text-xs text-purple-700 hover:bg-purple-200 hover:text-purple-900 flex items-center gap-1.5 p-1.5"
              disabled={isGenerating}
            >
              <Lightbulb className="h-4 w-4" />
              Try an Example
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-center mt-6 gap-3">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onBack}
            disabled={isGenerating}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            onClick={onSubmit}
            disabled={isGenerating || !slideContent.trim()}
            className="btn-enhanced"
          >
            <Wand className="mr-2 h-4 w-4" />
            {isGenerating ? `Generating... ${generationProgress}%` : "Generate Slides"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentStep;
