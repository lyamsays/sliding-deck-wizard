
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIGenerateTab from './image-generation/AIGenerateTab';
import { supabase } from "@/integrations/supabase/client";
import { Slide } from '@/types/deck';

interface ImageGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateImage: (prompt: string) => void;
  onUploadImage: (file: File) => void;
  isGenerating: boolean;
  slideTitle: string;
}

const ImageGenerationDialog: React.FC<ImageGenerationDialogProps> = ({
  open,
  onOpenChange,
  onGenerateImage,
  onUploadImage,
  isGenerating,
  slideTitle
}) => {
  const [selectedTab, setSelectedTab] = useState('ai-generate');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        });
        return;
      }
      
      onUploadImage(file);
    }
  };

  // Generate contextual suggestions based on the slide title
  const getContextualSuggestions = (title: string): string[] => {
    const titleLower = title.toLowerCase();
    const suggestions: string[] = [];
    
    // Business/Strategy related
    if (titleLower.includes('strategy') || titleLower.includes('plan') || titleLower.includes('business')) {
      suggestions.push(
        "Professional business meeting with diverse team around conference table",
        "Strategic planning session with charts and graphs on whiteboard",
        "Modern office workspace with laptops and documents"
      );
    }
    
    // Technology related
    if (titleLower.includes('tech') || titleLower.includes('digital') || titleLower.includes('innovation')) {
      suggestions.push(
        "Modern technology workspace with multiple monitors and code",
        "Digital transformation concept with connecting nodes and data flows",
        "Innovative tech startup office with modern equipment"
      );
    }
    
    // Finance related
    if (titleLower.includes('finance') || titleLower.includes('revenue') || titleLower.includes('profit')) {
      suggestions.push(
        "Financial charts and graphs on computer screens",
        "Professional financial analyst reviewing data",
        "Modern banking and finance office environment"
      );
    }
    
    // Marketing related
    if (titleLower.includes('market') || titleLower.includes('brand') || titleLower.includes('customer')) {
      suggestions.push(
        "Creative marketing team brainstorming with colorful sticky notes",
        "Digital marketing dashboard with analytics and metrics",
        "Brand presentation setup with modern design elements"
      );
    }
    
    // Generic business suggestions if no specific matches
    if (suggestions.length === 0) {
      suggestions.push(
        "Professional business presentation setup",
        "Modern office environment with natural lighting",
        "Team collaboration in contemporary workspace",
        "Clean minimal business concept illustration"
      );
    }
    
    return suggestions.slice(0, 4); // Return max 4 suggestions
  };

  const suggestions = getContextualSuggestions(slideTitle);

  const capitalizeWords = (str: string): string => {
    return str.split(' ').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto gap-2">
        <DialogHeader>
          <DialogTitle>Add Image to Slide</DialogTitle>
          <DialogDescription>
            Generate an AI image or upload your own for "{slideTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-generate">AI Generate</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-generate">
            <AIGenerateTab
              onGenerateImage={onGenerateImage}
              isGenerating={isGenerating}
              suggestions={suggestions}
              slideTitle={slideTitle}
            />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-primary">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </div>
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationDialog;
