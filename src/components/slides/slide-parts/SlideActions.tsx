
import React, { useEffect, useState } from 'react';
import { Slide } from '@/types/deck';
import { Button } from "@/components/ui/button";
import { Wand2, Image, PencilRuler, Trash2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SlideActionsProps {
  slide: Slide;
  isGeneratingImage: boolean;
  onOpenImageDialog: () => void;
  onOpenEditDialog: () => void;
  onEditImage: () => void;
  onRemoveImage?: () => void;
  accentColor?: string;
}

const SlideActions: React.FC<SlideActionsProps> = ({
  slide,
  isGeneratingImage,
  onOpenImageDialog,
  onOpenEditDialog,
  onEditImage,
  onRemoveImage,
  accentColor = '#6E59A5'
}) => {
  const [recommendedImageType, setRecommendedImageType] = useState<'ai' | 'real' | null>(null);

  useEffect(() => {
    // Logic to determine if real images would be more appropriate based on slide content
    const analyzeSlideContent = () => {
      const title = slide.title?.toLowerCase() || '';
      const content = slide.content?.toLowerCase() || '';
      const combinedContent = title + ' ' + content;
      
      // Keywords that suggest real photos might be better
      const realPhotoKeywords = [
        'team', 'person', 'people', 'customer', 'client', 'stakeholder', 
        'collaboration', 'meeting', 'leader', 'leadership', 'office',
        'interview', 'testimonial', 'showcase', 'employee', 'staff',
        'workspace', 'environment', 'location', 'venue', 'event'
      ];
      
      // Keywords that suggest AI images might be better
      const aiImageKeywords = [
        'concept', 'abstract', 'idea', 'workflow', 'process', 'strategy',
        'system', 'framework', 'model', 'theory', 'future', 'innovation',
        'technology', 'digital', 'virtual', 'diagram', 'metaphor', 'vision'
      ];
      
      // Check if any real photo keywords are present
      const hasRealPhotoKeyword = realPhotoKeywords.some(keyword => 
        combinedContent.includes(keyword)
      );
      
      // Check if any AI image keywords are present
      const hasAiImageKeyword = aiImageKeywords.some(keyword => 
        combinedContent.includes(keyword)
      );
      
      // Determine the recommendation
      if (hasRealPhotoKeyword && !hasAiImageKeyword) {
        return 'real';
      } else if (hasAiImageKeyword && !hasRealPhotoKeyword) {
        return 'ai';
      }
      
      return null; // No strong recommendation
    };
    
    setRecommendedImageType(analyzeSlideContent());
  }, [slide.title, slide.content]);

  const renderAddImageButton = () => {
    // Base button that will be wrapped in tooltip if needed
    const addImageButton = (
      <Button
        size="sm"
        variant="outline"
        className="flex gap-1 items-center text-xs h-8"
        onClick={onOpenImageDialog}
        disabled={isGeneratingImage}
      >
        <Image className="h-3.5 w-3.5" style={{ color: accentColor }} />
        <span>{isGeneratingImage ? 'Generating...' : 'Add Image'}</span>
      </Button>
    );
    
    // If we have a recommendation, wrap in tooltip
    if (recommendedImageType === 'real') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative inline-flex">
                {addImageButton}
                <span className="absolute -right-1 -top-1">
                  <AlertCircle className="h-3 w-3 text-blue-500" />
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Real photos recommended for this content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return addImageButton;
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="flex gap-1 items-center text-xs h-8"
        onClick={onOpenEditDialog}
      >
        <Wand2 className="h-3.5 w-3.5" style={{ color: accentColor }} />
        <span>Edit with AI</span>
      </Button>
      
      {slide.imageUrl ? (
        <>
          <Button
            size="sm"
            variant="outline"
            className="flex gap-1 items-center text-xs h-8"
            onClick={onEditImage}
          >
            <PencilRuler className="h-3.5 w-3.5" style={{ color: accentColor }} />
            <span>Edit Image</span>
          </Button>
          
          {onRemoveImage && (
            <Button
              size="sm"
              variant="outline"
              className="flex gap-1 items-center text-xs h-8"
              onClick={onRemoveImage}
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          )}
        </>
      ) : (
        renderAddImageButton()
      )}
    </div>
  );
};

export default SlideActions;
