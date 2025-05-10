
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Edit, Save, Loader, LayoutGrid, LayoutList } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slide } from '@/types/deck';
import OutlineSlide from '@/components/slides/OutlineSlide';
import StyledSlide from '@/components/slides/StyledSlide';

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
    <div className="mt-16 space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Generated Slides</h2>
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'outline' | 'slide')}>
            <ToggleGroupItem value="outline" aria-label="Toggle outline view">
              <LayoutList className="h-4 w-4 mr-2" />
              Outline
            </ToggleGroupItem>
            <ToggleGroupItem value="slide" aria-label="Toggle slide view">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Slide
            </ToggleGroupItem>
          </ToggleGroup>
          
          <div className="flex items-center gap-2">
            <input 
              type="text"
              placeholder="Deck Title"
              className="px-3 py-2 border rounded-md text-sm"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
            />
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save Deck"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4 flex items-center">
        <Edit className="h-4 w-4 mr-2 text-primary" />
        <p className="text-sm text-gray-600">
          Click on any text to edit your slides directly. Changes will be saved automatically.
        </p>
      </div>
      
      <div className="space-y-8">
        {editedSlides.map((slide, index) => (
          viewMode === 'outline' ? (
            <OutlineSlide 
              key={index} 
              slide={slide} 
              index={index} 
              onSlideUpdate={handleSlideUpdate} 
            />
          ) : (
            <StyledSlide 
              key={index} 
              slide={slide} 
              index={index} 
              onSlideUpdate={handleSlideUpdate}
              onRemoveImage={() => handleRemoveImage(index)}
            />
          )
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleDownloadSlides}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/80"
          size="lg"
        >
          <Download className="h-5 w-5" />
          <span>Download All Slides</span>
        </Button>
      </div>
    </div>
  );
};

export default SlideList;
