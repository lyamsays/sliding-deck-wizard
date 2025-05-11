
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, ImageIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { DialogFooter } from "@/components/ui/dialog";

interface AIGenerateTabProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  progressValue: number;
  handleGenerate: () => void;
}

const AIGenerateTab: React.FC<AIGenerateTabProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  progressValue,
  handleGenerate
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Describe the image you would like to generate for this slide:
          </p>
          <Input 
            placeholder="E.g., 'A professional bar chart showing growth trends'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      </div>
      
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
          disabled={isGenerating}
          className="w-full"
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
