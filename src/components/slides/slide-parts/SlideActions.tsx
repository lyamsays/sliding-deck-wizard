
import React from 'react';
import { Button } from "@/components/ui/button";
import { Image, Trash2, Crop, RefreshCw, Wand } from "lucide-react";
import { Slide } from '@/types/deck';

interface SlideActionsProps {
  slide: Slide;
  isGeneratingImage: boolean;
  onOpenImageDialog: () => void;
  onOpenEditDialog: () => void;
  onEditImage: () => void;
  onRemoveImage?: () => void;
}

const SlideActions: React.FC<SlideActionsProps> = ({
  slide,
  isGeneratingImage,
  onOpenImageDialog,
  onOpenEditDialog,
  onEditImage,
  onRemoveImage
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenEditDialog}
        className="flex-shrink-0"
      >
        <Wand className="h-4 w-4 mr-2" />
        Edit with AI
      </Button>
      
      {slide.imageUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEditImage}
          className="flex-shrink-0"
        >
          <Crop className="h-4 w-4 mr-2" />
          Edit Image
        </Button>
      )}
      
      {slide.imageUrl && onRemoveImage && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRemoveImage}
          className="flex-shrink-0"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove Image
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenImageDialog}
        disabled={isGeneratingImage}
        className="flex-shrink-0"
      >
        {isGeneratingImage ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Image className="h-4 w-4 mr-2" />
            {slide.imageUrl ? "Change Image" : "Add Image"}
          </>
        )}
      </Button>
    </div>
  );
};

export default SlideActions;
