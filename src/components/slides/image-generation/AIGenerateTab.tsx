
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, ImageIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { DialogFooter } from "@/components/ui/dialog";

interface AIGenerateTabProps {
  onGenerateImage: (prompt: string) => void;
  isGenerating: boolean;
  suggestions: string[];
  slideTitle: string;
}

const AIGenerateTab: React.FC<AIGenerateTabProps> = ({
  onGenerateImage,
  isGenerating,
  suggestions,
  slideTitle
}) => {
  const [prompt, setPrompt] = useState('');
  const [progressValue, setProgressValue] = useState(0);
  
  // Simulate progress when generating
  useEffect(() => {
    if (isGenerating) {
      setProgressValue(0);
      const interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setProgressValue(0);
    }
  }, [isGenerating]);

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerateImage(prompt);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          ✨ Enhanced with GPT-Image-1 for professional presentation quality:
        </p>
        <Input 
          placeholder="E.g., 'A professional bar chart showing growth trends'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Suggestions:</p>
          <div className="grid gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Generating image...</span>
            <span className="text-sm font-medium">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      )}
      
      <DialogFooter>
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AIGenerateTab;
