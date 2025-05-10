
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Loader, LayoutGrid, LayoutList } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SlideHeaderProps {
  viewMode: 'outline' | 'slide';
  setViewMode: (mode: 'outline' | 'slide') => void;
  deckTitle: string;
  setDeckTitle: (title: string) => void;
  handleSave: () => void;
  isSaving: boolean;
}

const SlideHeader: React.FC<SlideHeaderProps> = ({
  viewMode,
  setViewMode,
  deckTitle,
  setDeckTitle,
  handleSave,
  isSaving
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white rounded-lg p-4 shadow-sm border border-border">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Your Presentation</h2>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'outline' | 'slide')} className="self-start sm:self-auto">
          <ToggleGroupItem value="outline" aria-label="Toggle outline view" className="px-3">
            <LayoutList className="h-4 w-4 mr-2" />
            Outline
          </ToggleGroupItem>
          <ToggleGroupItem value="slide" aria-label="Toggle slide view" className="px-3">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Slides
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="flex items-center gap-2">
          <input 
            type="text"
            placeholder="Deck Title"
            className="px-3 py-2 border rounded-md text-sm min-w-[200px] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
          />
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 btn-enhanced"
          >
            {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Deck"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideHeader;
