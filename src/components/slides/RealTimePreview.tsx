import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Download,
  Share2,
  Presentation,
  ZoomIn,
  ZoomOut,
  Move,
  Palette
} from 'lucide-react';
import { Slide } from '@/types/deck';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RealTimePreviewProps {
  slides: Slide[];
  selectedSlideId?: string;
  theme?: string;
  className?: string;
  onSlideSelect?: (slideId: string) => void;
}

const RealTimePreview: React.FC<RealTimePreviewProps> = ({
  slides,
  selectedSlideId,
  theme = 'creme',
  className,
  onSlideSelect
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Update current slide when selectedSlideId changes
  useEffect(() => {
    if (selectedSlideId) {
      const index = slides.findIndex(slide => slide.id === selectedSlideId);
      if (index !== -1) {
        setCurrentSlideIndex(index);
      }
    }
  }, [selectedSlideId, slides]);

  const currentSlide = slides[currentSlideIndex];

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25));
  };

  const resetZoom = () => {
    setZoom(100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePresentationMode = () => {
    setIsPresentationMode(!isPresentationMode);
    if (!isPresentationMode) {
      setZoom(100);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPresentationMode || isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            handlePrevSlide();
            break;
          case 'ArrowRight':
          case 'ArrowDown':
          case ' ':
            handleNextSlide();
            break;
          case 'Escape':
            setIsPresentationMode(false);
            if (document.fullscreenElement) {
              document.exitFullscreen();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPresentationMode, isFullscreen, handlePrevSlide, handleNextSlide]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getSlideStyle = (slide: Slide) => {
    const style = slide.style || {};
    return {
      backgroundColor: style.backgroundColor || '#ffffff',
      color: style.textColor || '#1f2937',
      fontFamily: style.bodyFont || 'system-ui, sans-serif',
    };
  };

  const renderSlideContent = (slide: Slide) => (
    <div 
      className="w-full h-full p-8 flex flex-col justify-center relative overflow-hidden"
      style={getSlideStyle(slide)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-current transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-current transform -translate-x-12 translate-y-12" />
      </div>

      <div className="relative z-10">
        {/* Slide Number */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="text-xs">
            {slide.slideNumber || 1} / {slides.length}
          </Badge>
        </div>

        {/* Title */}
        <h1 
          className="text-4xl font-bold mb-8 leading-tight"
          style={{ 
            fontFamily: slide.style?.titleFont || 'system-ui, sans-serif',
            color: slide.style?.accentColor || '#6366f1'
          }}
        >
          {slide.title}
        </h1>

        {/* Content */}
        <div className="space-y-6">
          {(slide.bulletPoints || slide.bullets) && (slide.bulletPoints || slide.bullets)!.length > 0 && (
            <ul className="space-y-4 text-lg">
              {(slide.bulletPoints || slide.bullets)!.map((point: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div 
                    className="w-2 h-2 rounded-full mt-3 flex-shrink-0"
                    style={{ backgroundColor: slide.style?.accentColor || '#6366f1' }}
                  />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          )}

          {slide.visualSuggestion && (
            <div className="mt-8 p-4 bg-black/5 rounded-lg border-l-4" 
                 style={{ borderLeftColor: slide.style?.accentColor || '#6366f1' }}>
              <p className="text-sm italic">
                💡 {slide.visualSuggestion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (slides.length === 0) {
    return (
      <Card className={`h-96 ${className}`}>
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>No slides to preview</p>
            <p className="text-sm">Generate slides to see them here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPresentationMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-2xl"
          >
            {renderSlideContent(currentSlide)}
          </motion.div>
        </AnimatePresence>

        {/* Presentation Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className="text-white hover:bg-white/20"
          >
            Previous
          </Button>
          
          <span className="text-sm">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="text-white hover:bg-white/20"
          >
            Next
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePresentationMode}
            className="text-white hover:bg-white/20"
          >
            Exit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`${className}`} ref={previewRef}>
      <CardContent className="p-0">
        {/* Preview Toolbar */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Preview
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    className="h-7 w-7 p-0"
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom out</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Select value={zoom.toString()} onValueChange={(value) => setZoom(parseInt(value))}>
              <SelectTrigger className="w-16 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="125">125%</SelectItem>
                <SelectItem value="150">150%</SelectItem>
                <SelectItem value="200">200%</SelectItem>
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    className="h-7 w-7 p-0"
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom in</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="w-px h-4 bg-border mx-1" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePresentationMode}
                    className="h-7 w-7 p-0"
                  >
                    <Presentation className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Present (F11)</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="h-7 w-7 p-0"
                  >
                    {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Slide Preview */}
        <div className="relative overflow-hidden bg-gray-100">
          <div 
            className="transition-transform duration-200 origin-center"
            style={{ 
              transform: `scale(${zoom / 100})`,
              width: '100%',
              height: '400px'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full cursor-pointer"
                onClick={() => onSlideSelect?.(currentSlide.id)}
              >
                {renderSlideContent(currentSlide)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-3 border-t bg-muted/30">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
          >
            Previous
          </Button>

          {/* Slide thumbnails */}
          <div className="flex items-center gap-1 max-w-xs overflow-x-auto">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-8 h-6 rounded border-2 transition-colors flex-shrink-0 ${
                  index === currentSlideIndex 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border bg-muted hover:bg-muted/80'
                }`}
              >
                <div className="w-full h-full bg-white rounded-sm border text-xs flex items-center justify-center">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePreview;