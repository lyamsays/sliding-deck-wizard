
import React from 'react';
import { Slide } from '@/types/deck';
<<<<<<< HEAD
=======
import SlideGrid from './SlideGrid';
import SlideHeader from './SlideHeader';
import ExportToImage from '../ExportToImage';
import { motion } from 'framer-motion';
>>>>>>> 0586fc0ddfcb662ea18ceb0a567de8e4d6b73122

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
<<<<<<< HEAD
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
=======
  if (editedSlides.length === 0) return null;

  return (
    <motion.div 
      className="mt-12 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SlideHeader 
        deckTitle={deckTitle}
        setDeckTitle={setDeckTitle}
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleSave={handleSave}
        handleDownloadSlides={handleDownloadSlides}
        isSaving={isSaving}
        slideCount={editedSlides.length}
        ExportComponent={<ExportToImage slides={editedSlides} deckTitle={deckTitle} />}
      />
      
      <SlideGrid
        editedSlides={editedSlides}
        viewMode={viewMode}
        handleSlideUpdate={handleSlideUpdate}
        handleRemoveImage={handleRemoveImage}
      />
    </motion.div>
>>>>>>> 0586fc0ddfcb662ea18ceb0a567de8e4d6b73122
  );
};

export default SlideList;
