
import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import HelpMessage from './HelpMessage';
import SlideHeader from './SlideHeader';
import SlideGrid from './SlideGrid';
import ExportOptions from './ExportOptions';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';
import NarrativeMode from '../NarrativeMode';

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
  const [isNarrativeModeOpen, setIsNarrativeModeOpen] = useState(false);
  
  if (editedSlides.length === 0) {
    return null;
  }
  
  const handleSpeakerNotesAdded = (slideIndex: number, notes: string) => {
    if (slideIndex >= 0 && slideIndex < editedSlides.length) {
      const updatedSlide = {
        ...editedSlides[slideIndex],
        speakerNotes: notes
      };
      handleSlideUpdate(slideIndex, updatedSlide);
    }
  };
  
  return (
    <div className="mt-12 md:mt-16 space-y-6 animate-fade-up" id="slide-list-container">
      <SlideHeader 
        viewMode={viewMode}
        setViewMode={setViewMode}
        deckTitle={deckTitle}
        setDeckTitle={setDeckTitle}
        handleSave={handleSave}
        isSaving={isSaving}
      />
      
      <div className="flex justify-between items-center">
        <HelpMessage />
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={() => setIsNarrativeModeOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
          Generate Speaker Notes
        </Button>
      </div>
      
      {/* Wrapper with explicit ID for finding export elements */}
      <div id="slides-for-export-container" className="slides-for-export-wrapper">
        <style id="export-styles" type="text/css">{`
          /* Hide UI elements during export */
          .exporting .visual-label-wrapper,
          .exporting .slide-ui-elements-not-for-export,
          .exporting .recommendation-ui,
          .exporting [class*="visual-label"],
          .exporting .slide-actions {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
        `}</style>
        <SlideGrid 
          editedSlides={editedSlides}
          viewMode={viewMode}
          handleSlideUpdate={handleSlideUpdate}
          handleRemoveImage={handleRemoveImage}
        />
      </div>
      
      <ExportOptions 
        editedSlides={editedSlides}
        deckTitle={deckTitle}
        handleDownloadSlides={handleDownloadSlides}
      />
      
      <NarrativeMode 
        open={isNarrativeModeOpen}
        onOpenChange={setIsNarrativeModeOpen}
        slides={editedSlides}
        deckTitle={deckTitle}
        onSpeakerNotesAdded={handleSpeakerNotesAdded}
      />
    </div>
  );
};

export default SlideList;
