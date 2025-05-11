
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, ChevronLeft, ChevronRight, GalleryVertical, GalleryHorizontal, LayoutGrid, LayoutList } from "lucide-react";
import * as LucideIcons from 'lucide-react';

interface SlideHeaderProps {
  title: string;
  layout: string;
  isHovering: boolean;
  onTitleChange: (e: React.FormEvent<HTMLHeadingElement>) => void;
  onLayoutChange: (direction: 'next' | 'previous') => void;
  onCopySlide: () => void;
}

const SlideHeader: React.FC<SlideHeaderProps> = ({
  title,
  layout,
  isHovering,
  onTitleChange,
  onLayoutChange,
  onCopySlide
}) => {
  // Get the layout icon based on current layout
  const getLayoutIcon = () => {
    switch(layout) {
      case 'left-image':
        return <GalleryVertical className="h-4 w-4" />;
      case 'right-image':
        return <GalleryHorizontal className="h-4 w-4" />;
      case 'centered':
        return <LayoutGrid className="h-4 w-4" />;
      case 'title-focus':
        return <LayoutList className="h-4 w-4" />;
      default:
        return <LayoutGrid className="h-4 w-4" />;
    }
  };
  
  return (
    <div className={`pb-3 flex flex-row justify-between items-center border-b border-gray-100`}>
      <h3 
        className="text-xl font-bold text-gray-800"
        contentEditable
        suppressContentEditableWarning
        onBlur={onTitleChange}
        role="textbox"
        aria-label="Slide title"
      >
        {title}
      </h3>
      <div className="flex items-center space-x-2">
        <div className={`flex items-center transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLayoutChange('previous')}
            title="Previous layout"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous layout</span>
          </Button>
          
          <div className="flex items-center px-1">
            {getLayoutIcon()}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLayoutChange('next')}
            title="Next layout"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next layout</span>
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCopySlide}
          className={`transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          title="Copy slide content"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy slide</span>
        </Button>
      </div>
    </div>
  );
};

export default SlideHeader;
