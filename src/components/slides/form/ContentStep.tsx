
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-center mb-4">Step 2: Content Input</h2>
        <p className="text-muted-foreground text-center mb-6">
          Enter your content below and we'll transform it into slides.
        </p>
      </div>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your content here..."
          value={slideContent}
          onChange={(e) => setSlideContent(e.target.value)}
          className="min-h-[300px]"
        />
        
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
            type="button" 
            onClick={onTryExample}
            variant="outline"
            disabled={isGenerating}
          >
            Try an Example
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
