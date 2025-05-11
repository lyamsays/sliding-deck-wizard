
import React from 'react';
import { ChevronLeftCircle, ChevronRightCircle, Copy } from 'lucide-react';

interface SlideHeaderProps {
  title: string;
  layout: string;
  isHovering: boolean;
  onTitleChange: (e: React.FormEvent<HTMLHeadingElement>) => void;
  onLayoutChange: (direction: 'next' | 'previous') => void;
  onCopySlide: () => void;
  titleStyle?: React.CSSProperties;
}

const SlideHeader: React.FC<SlideHeaderProps> = ({
  title,
  layout,
  isHovering,
  onTitleChange,
  onLayoutChange,
  onCopySlide,
  titleStyle = {}
}) => {
  return (
    <div className="relative">
      <div className="relative px-6 py-6">
        <h3
          className="text-xl font-bold focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={onTitleChange}
          role="textbox"
          aria-label="Slide title"
          style={titleStyle}
        >
          {title}
        </h3>

        {/* Layout controls - visible when hovering */}
        {isHovering && (
          <div className="absolute top-6 right-6 flex gap-1.5">
            <button
              onClick={() => onLayoutChange('previous')}
              className="bg-white/90 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Previous layout"
            >
              <ChevronLeftCircle className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => onCopySlide()}
              className="bg-white/90 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Copy slide content"
            >
              <Copy className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => onLayoutChange('next')}
              className="bg-white/90 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Next layout"
            >
              <ChevronRightCircle className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 z-10" 
        style={{ background: 'linear-gradient(to right, #6e59a5, #9b87f5)' }} 
      />
    </div>
  );
};

export default SlideHeader;
