import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layout, 
  Palette, 
  Type, 
  Image, 
  Layers,
  Undo,
  Redo,
  Save,
  Download,
  Share2,
  Grid,
  List,
  Eye
} from 'lucide-react';
import { Slide } from '@/types/deck';
import DraggableSlideList from './DraggableSlideList';
import RealTimePreview from './RealTimePreview';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';

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
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'preview'>('list');
  const [undoStack, setUndoStack] = useState<Slide[][]>([]);
  const [redoStack, setRedoStack] = useState<Slide[][]>([]);

  // Undo/Redo functionality
  const pushToUndoStack = (currentSlides: Slide[]) => {
    setUndoStack(prev => [...prev.slice(-9), currentSlides]); // Keep last 10 states
    setRedoStack([]); // Clear redo stack on new action
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [slides, ...prev]);
      setUndoStack(prev => prev.slice(0, -1));
      onSlidesChange(previousState);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack(prev => [...prev, slides]);
      setRedoStack(prev => prev.slice(1));
      onSlidesChange(nextState);
    }
  };

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
          <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Undo/Redo */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  className="h-8 px-2 rounded-r-none border-r"
                >
                  <Undo className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="h-8 px-2 rounded-l-none"
                >
                  <Redo className="h-3 w-3" />
                </Button>
              </div>

              {/* View Mode */}
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">
                    <div className="flex items-center gap-2">
                      <List className="h-3 w-3" />
                      List View
                    </div>
                  </SelectItem>
                  <SelectItem value="grid">
                    <div className="flex items-center gap-2">
                      <Grid className="h-3 w-3" />
                      Grid View
                    </div>
                  </SelectItem>
                  <SelectItem value="preview">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      Preview
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onSave && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSave}
                  className="flex items-center gap-1"
                >
                  <Save className="h-3 w-3" />
                  Save
                </Button>
              )}

              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Export
                </Button>
              )}

              {onShare && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShare}
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-3 w-3" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor Content */}
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
                slides={slides}
                selectedSlideId={selectedSlideId}
                onSlideSelect={setSelectedSlideId}
              />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Slides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setSelectedSlideId(slide.id)}
                  className={`w-full p-2 text-left text-xs rounded border transition-colors ${
                    selectedSlideId === slide.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/30 border-border hover:bg-muted'
                      }`}
                    >
                      <div className="font-medium line-clamp-1">{slide.title}</div>
                      <div className="text-muted-foreground">Slide {index + 1}</div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <DraggableSlideList
            slides={slides}
            onSlidesReorder={handleSlidesReorder}
            onSlideUpdate={handleSlideUpdate}
            onSlideDelete={handleSlideDelete}
            onSlideDuplicate={handleSlideDuplicate}
            onAddSlide={handleAddSlide}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AdvancedSlideEditor;