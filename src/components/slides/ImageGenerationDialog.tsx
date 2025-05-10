
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";

interface ImageGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  slideTitle: string;
}

const ImageGenerationDialog: React.FC<ImageGenerationDialogProps> = ({ 
  open, 
  onOpenChange, 
  onGenerateImage,
  isGenerating,
  slideTitle
}) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [promptMode, setPromptMode] = useState<string>("presets");
  
  // Generate predefined presets based on the slide title
  const getPresetPrompt = (style: string): string => {
    const basePrompt = `Create a professional ${style.toLowerCase()} related to "${slideTitle}"`;
    
    switch (style) {
      case "Diagram":
        return `${basePrompt}. Simple, clean flow chart or concept diagram with minimal text.`;
      case "Illustration":
        return `${basePrompt}. Clean, modern, conceptual illustration with minimal detail.`;
      case "Icon Set":
        return `${basePrompt}. Set of 3-5 simple, related icons in a consistent style.`;
      case "Photo":
        return `${basePrompt}. Professional, high-quality stock photo style image.`;
      case "Abstract":
        return `${basePrompt}. Abstract representation using shapes and colors, minimalist design.`;
      default:
        return basePrompt;
    }
  };
  
  const handleGenerateWithPreset = (style: string) => {
    const prompt = getPresetPrompt(style);
    onGenerateImage(prompt);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onGenerateImage(customPrompt);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>What kind of image would you like on this slide?</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="presets" value={promptMode} onValueChange={setPromptMode} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Suggested Styles</TabsTrigger>
            <TabsTrigger value="custom">Custom Description</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="mt-4 space-y-4">
            <p className="text-sm text-gray-500">Pick a style for your slide image:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleGenerateWithPreset("Diagram")}
                disabled={isGenerating}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span>Diagram</span>
                <span className="text-xs text-gray-500 mt-1">Flow charts, processes</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleGenerateWithPreset("Illustration")}
                disabled={isGenerating}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span>Illustration</span>
                <span className="text-xs text-gray-500 mt-1">Modern, conceptual</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleGenerateWithPreset("Icon Set")}
                disabled={isGenerating}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span>Icon Set</span>
                <span className="text-xs text-gray-500 mt-1">Simple, related symbols</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleGenerateWithPreset("Photo")}
                disabled={isGenerating}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span>Photo</span>
                <span className="text-xs text-gray-500 mt-1">Realistic imagery</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleGenerateWithPreset("Abstract")}
                disabled={isGenerating}
                className="h-20 flex flex-col items-center justify-center col-span-2"
              >
                <span>Abstract</span>
                <span className="text-xs text-gray-500 mt-1">Shapes, colors, patterns</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Describe what you'd like to see:</p>
                <Textarea
                  placeholder="e.g., 'pie chart showing rational vs irrational decisions', 'cartoon brain with economic graphs'"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  disabled={isGenerating}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isGenerating || !customPrompt.trim()} 
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Images are generated using DALL·E</p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationDialog;
