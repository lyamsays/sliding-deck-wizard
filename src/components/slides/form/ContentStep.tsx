
import React from 'react';
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ContentStepProps {
  slideContent: string;
  setSlideContent: (content: string) => void;
  autoGenerateImages: boolean;
  setAutoGenerateImages: (autoGenerate: boolean) => void;
  isGenerating: boolean;
  onTryExample: () => void;
}

const ContentStep: React.FC<ContentStepProps> = ({
  slideContent,
  setSlideContent,
  autoGenerateImages,
  setAutoGenerateImages,
  isGenerating,
  onTryExample
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm text-gray-500">Content</label>
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onTryExample}
            size="sm"
            className="text-xs flex items-center gap-1"
            disabled={isGenerating}
          >
            <Sparkles className="h-3 w-3" />
            Try Example
          </Button>
        </div>
      </div>

      <Textarea 
        className="min-h-[300px] w-full bg-white border-0 resize-none focus-visible:ring-1 focus-visible:ring-primary text-base md:text-lg"
        placeholder="Paste your content here... (bullet points, notes, or paragraphs)"
        value={slideContent}
        onChange={(e) => setSlideContent(e.target.value)}
        disabled={isGenerating}
      />
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>Enter your presentation content here</p>
      </div>
      
      <div className="flex items-center gap-2 mt-4 justify-center">
        <input 
          type="checkbox" 
          id="auto-generate-images" 
          checked={autoGenerateImages} 
          onChange={(e) => setAutoGenerateImages(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary"
        />
        <label htmlFor="auto-generate-images" className="text-sm text-gray-600">
          Automatically generate images for slides
        </label>
      </div>
    </div>
  );
};

export default ContentStep;
