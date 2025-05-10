
import React from 'react';
import { Slide } from '@/types/deck';
import HelpMessage from './HelpMessage';
import SlideHeader from './SlideHeader';
import SlideGrid from './SlideGrid';
import ExportOptions from './ExportOptions';

interface SlideListProps {
  editedSlides: Slide[];
  viewMode: 'outline' | 'slide';
  setViewMode: (mode: 'outline' | 'slide') => void;
  deckTitle: string;
  setDeckTitle: (title: string) => void;
  handleSave: () => void;
  handleSlideUpdate: (index: number, updatedSlide: Slide) => void;
  handleRemoveImage: (index: number) => void;
  handleDownloadSlides: () => void;
  isSaving: boolean;
}

const SlideList: React.FC<SlideListProps> = ({
  editedSlides,
  viewMode,
  setViewMode,
  deckTitle,
  setDeckTitle,
  handleSave,
  handleSlideUpdate,
  handleRemoveImage,
  handleDownloadSlides,
  isSaving
}) => {
  if (editedSlides.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12 md:mt-16 space-y-6 animate-fade-up">
      <SlideHeader 
        viewMode={viewMode}
        setViewMode={setViewMode}
        deckTitle={deckTitle}
        setDeckTitle={setDeckTitle}
        handleSave={handleSave}
        isSaving={isSaving}
      />
      
      <HelpMessage />
      
      <SlideGrid 
        editedSlides={editedSlides}
        viewMode={viewMode}
        handleSlideUpdate={handleSlideUpdate}
        handleRemoveImage={handleRemoveImage}
      />
      
      <ExportOptions 
        editedSlides={editedSlides}
        deckTitle={deckTitle}
        handleDownloadSlides={handleDownloadSlides}
      />
    </div>
  );
};

export default SlideList;
