
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Download, Eye, List, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface SlideHeaderProps {
  deckTitle: string;
  setDeckTitle: (title: string) => void;
  viewMode: 'outline' | 'slide';
  setViewMode: (mode: 'outline' | 'slide') => void;
  handleSave: () => void;
  handleDownloadSlides: () => void;
  isSaving: boolean;
  slideCount: number;
  ExportComponent?: React.ReactNode;
}

const SlideHeader: React.FC<SlideHeaderProps> = ({
  deckTitle,
  setDeckTitle,
  viewMode,
  setViewMode,
  handleSave,
  handleDownloadSlides,
  isSaving,
  slideCount,
  ExportComponent
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 space-y-4 md:space-y-0">
          <div className="flex items-center gap-3">
            <Input
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              className="text-xl font-semibold border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0"
              placeholder="Enter presentation title..."
            />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {slideCount} slide{slideCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'slide' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('slide')}
              className="rounded-md"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              variant={viewMode === 'outline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('outline')}
              className="rounded-md"
            >
              <List className="h-4 w-4 mr-1" />
              Outline
            </Button>
          </div>
          
          {/* Export Options */}
          {ExportComponent}
          
          <Button
            onClick={handleDownloadSlides}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Download MD
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideHeader;
