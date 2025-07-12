import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slide } from '@/types/deck';
import { 
  Save, 
  Download, 
  Eye, 
  Edit, 
  Palette, 
  Share2, 
  MoreHorizontal,
  Play,
  Grid3X3,
  List
} from 'lucide-react';
import StyledSlide from './StyledSlide';
import OutlineSlide from './OutlineSlide';

interface SlideEditorProps {
  slides: Slide[];
  deckTitle: string;
  setDeckTitle: (title: string) => void;
  viewMode: 'outline' | 'slide';
  setViewMode: (mode: 'outline' | 'slide') => void;
  onSave: () => void;
  onSlideEdit: (slide: Slide, index: number) => void;
  isSaving: boolean;
  user: any;
}

const SlideEditor: React.FC<SlideEditorProps> = ({
  slides,
  deckTitle,
  setDeckTitle,
  viewMode,
  setViewMode,
  onSave,
  onSlideEdit,
  isSaving,
  user
}) => {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const exportOptions = [
    { label: 'PowerPoint', format: 'pptx', icon: Download },
    { label: 'PDF', format: 'pdf', icon: Download },
    { label: 'Images', format: 'images', icon: Download }
  ];

  if (slides.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Input
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                className="text-xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                placeholder="Untitled Presentation"
              />
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{slides.length} slides</Badge>
                <span>•</span>
                <span>Last edited now</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'outline' | 'slide')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="outline" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">Outline</span>
                  </TabsTrigger>
                  <TabsTrigger value="slide" className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Slides</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Action Buttons */}
              <Button variant="outline" size="sm">
                <Palette className="h-4 w-4 mr-2" />
                Theme
              </Button>
              
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Present
              </Button>
              
              <Button 
                onClick={onSave}
                disabled={isSaving}
                size="sm"
                className={!user ? "animate-pulse bg-green-600 hover:bg-green-700" : ""}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : !user ? 'Save (Sign up free!)' : 'Save'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Slide Navigation (Desktop) */}
        <div className="hidden lg:block space-y-2">
          <div className="text-sm font-medium text-muted-foreground mb-3">
            Slides ({slides.length})
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlideIndex(index)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedSlideIndex === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-sm font-medium truncate">
                  {index + 1}. {slide.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {slide.bullets && slide.bullets.length > 0 
                    ? slide.bullets[0].substring(0, 60) + '...'
                    : 'No content available'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-3">
          {viewMode === 'outline' ? (
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <OutlineSlide
                  key={index}
                  slide={slide}
                  index={index}
                  onSlideUpdate={(idx, updatedSlide) => onSlideEdit(updatedSlide, idx)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mobile Slide Navigation */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Slide {selectedSlideIndex + 1} of {slides.length}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSlideIndex(Math.max(0, selectedSlideIndex - 1))}
                      disabled={selectedSlideIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSlideIndex(Math.min(slides.length - 1, selectedSlideIndex + 1))}
                      disabled={selectedSlideIndex === slides.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>

              {/* Current Slide */}
              <Card className="p-6">
                <StyledSlide
                  slide={slides[selectedSlideIndex]}
                  index={selectedSlideIndex}
                  onSlideUpdate={(idx, updatedSlide) => onSlideEdit(updatedSlide, idx)}
                />
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Export Panel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-medium">Ready to export?</div>
              <div className="text-sm text-muted-foreground">
                Download your presentation in multiple formats
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {exportOptions.map((option) => (
                <Button key={option.format} variant="outline" size="sm">
                  <option.icon className="h-4 w-4 mr-2" />
                  {option.label}
                </Button>
              ))}
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlideEditor;