
import React from 'react';
import { Slide } from '@/types/deck';
import { Button } from "@/components/ui/button";
import { Wand2, Image, PencilRuler, Trash2 } from 'lucide-react';

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
      )}
    </div>
  );
};

export default SlideActions;
