
import React from 'react';
import { Slide } from '@/types/deck';

interface SlideListProps {
  slides: Slide[];
  onSlideUpdate: (index: number, updatedSlide: Slide) => void;
  onRemoveImage: (index: number) => void;
  viewMode: 'outline' | 'slide';
}

const SlideList: React.FC<SlideListProps> = ({ 
  slides, 
  onSlideUpdate, 
  onRemoveImage,
  viewMode
}) => {
  if (slides.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No slides generated yet. Add content and generate slides.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {slides.map((slide, index) => (
        <div key={index} className="card">
          <h3 className="text-xl font-semibold mb-4">{slide.title}</h3>
          <ul className="space-y-2 list-disc pl-5">
            {slide.bullets.map((bullet, bulletIndex) => (
              <li key={bulletIndex}>{bullet}</li>
            ))}
          </ul>
          {slide.visualSuggestion && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <strong>Visual suggestion:</strong> {slide.visualSuggestion}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SlideList;
