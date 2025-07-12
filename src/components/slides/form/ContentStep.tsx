
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand, Lightbulb, Sparkles } from "lucide-react";
import { useSmartDefaults } from '@/hooks/useSmartDefaults';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  profession?: string;
  purpose?: string;
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
  setAutoGenerateImages,
  profession = 'Consultant',
  purpose = ''
}) => {
  const [showExample, setShowExample] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { getSmartSuggestions } = useSmartDefaults();
  const contentSuggestions = getSmartSuggestions(profession, purpose);

  // Effect to hide example button when user starts typing
  useEffect(() => {
    if (slideContent.trim() !== '') {
      setShowExample(false);
      setShowSuggestions(false);
    } else {
      setShowExample(true);
      // Show suggestions if we have profession and purpose
      if (profession && purpose && contentSuggestions.length > 0) {
        setShowSuggestions(true);
      }
    }
  }, [slideContent, profession, purpose, contentSuggestions.length]);

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
        
        {showSuggestions && contentSuggestions.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Smart Content Suggestions
                <Badge variant="secondary" className="text-xs">
                  For {profession} • {purpose}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Based on your profession and purpose, here are some content ideas to get you started:
              </p>
              <div className="space-y-2">
                {contentSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background rounded-md border border-border hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSlideContent(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSuggestions(false)}
                className="mt-2"
              >
                Hide suggestions
              </Button>
            </CardContent>
          </Card>
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
