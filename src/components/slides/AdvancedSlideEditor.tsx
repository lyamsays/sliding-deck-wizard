import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from 'lucide-react';
import { Slide } from '@/types/deck';
import { motion } from 'framer-motion';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import DraggableSlideList from './DraggableSlideList';
import RealTimePreview from './RealTimePreview';
import EditorToolbar from './editor/EditorToolbar';
import ActionButtons from './editor/ActionButtons';
import SlideNavigation from './editor/SlideNavigation';
import SlideSearchAndFilter from './search/SlideSearchAndFilter';
import { ComponentLoader } from './performance/LazyComponents';

interface AdvancedSlideEditorProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
  onSave?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  className?: string;
}

const AdvancedSlideEditor: React.FC<AdvancedSlideEditorProps> = ({
  slides,
  onSlidesChange,
  onSave,
  onExport,
  onShare,
  className
}) => {
  const [selectedSlideId, setSelectedSlideId] = useState<string | undefined>(undefined);
  const [filteredSlides, setFilteredSlides] = useState<Slide[]>(slides);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'preview'>('list');
  
  const {
    pushToUndoStack,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo
  } = useUndoRedo(slides, onSlidesChange);

  const handleSlidesReorder = (reorderedSlides: Slide[]) => {
    pushToUndoStack(slides);
    onSlidesChange(reorderedSlides);
  };

  const handleSlideUpdate = (slideId: string, updatedSlide: Slide) => {
    pushToUndoStack(slides);
    const newSlides = slides.map(slide => 
      slide.id === slideId ? updatedSlide : slide
    );
    onSlidesChange(newSlides);
  };

  const handleSlideDelete = (slideId: string) => {
    pushToUndoStack(slides);
    const newSlides = slides.filter(slide => slide.id !== slideId)
      .map((slide, index) => ({ ...slide, slideNumber: index + 1 }));
    onSlidesChange(newSlides);
    
    if (selectedSlideId === slideId) {
      setSelectedSlideId(undefined);
    }
  };

  const handleSlideDuplicate = (slideId: string) => {
    pushToUndoStack(slides);
    const slideIndex = slides.findIndex(slide => slide.id === slideId);
    if (slideIndex !== -1) {
      const slideToClone = slides[slideIndex];
      const newSlide: Slide = {
        ...slideToClone,
        id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${slideToClone.title} (Copy)`,
        slideNumber: slideIndex + 2
      };
      
      const newSlides = [
        ...slides.slice(0, slideIndex + 1),
        newSlide,
        ...slides.slice(slideIndex + 1)
      ].map((slide, index) => ({ ...slide, slideNumber: index + 1 }));
      
      onSlidesChange(newSlides);
    }
  };

  const handleAddSlide = () => {
    pushToUndoStack(slides);
    const newSlide: Slide = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Slide',
      bullets: ['Add your content here'],
      bulletPoints: ['Add your content here'],
      slideNumber: slides.length + 1,
      visualSuggestion: 'Consider adding relevant visuals',
      style: {
        backgroundColor: '#ffffff',
        accentColor: '#6366f1',
        textColor: '#1f2937',
        layout: 'right-image'
      }
    };
    
    onSlidesChange([...slides, newSlide]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Editor Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Advanced Slide Editor
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Edit, reorder, and customize your slides with advanced tools
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {slides.length} slide{slides.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <EditorToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />

            <ActionButtons
              onSave={onSave}
              onExport={onExport}
              onShare={onShare}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      {slides.length > 3 && (
        <SlideSearchAndFilter
          slides={slides}
          onFilteredSlidesChange={setFilteredSlides}
        />
      )}

      {/* Editor Content */}
      <Suspense fallback={<ComponentLoader />}>
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'preview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RealTimePreview
                  slides={filteredSlides}
                  selectedSlideId={selectedSlideId}
                  onSlideSelect={setSelectedSlideId}
                />
              </div>
              <div className="space-y-4">
                <SlideNavigation
                  slides={filteredSlides}
                  selectedSlideId={selectedSlideId}
                  onSlideSelect={setSelectedSlideId}
                />
              </div>
            </div>
          ) : (
            <DraggableSlideList
              slides={filteredSlides}
              onSlidesReorder={handleSlidesReorder}
              onSlideUpdate={handleSlideUpdate}
              onSlideDelete={handleSlideDelete}
              onSlideDuplicate={handleSlideDuplicate}
              onAddSlide={handleAddSlide}
            />
          )}
        </motion.div>
      </Suspense>
    </div>
  );
};

export default AdvancedSlideEditor;