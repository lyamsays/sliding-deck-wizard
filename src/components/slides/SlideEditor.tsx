import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slide } from '@/types/deck';
import { Save, Download, Play, List, Grid3X3, FileText, Image as ImageIcon, Share2 } from 'lucide-react';
import StyledSlide from './StyledSlide';
import OutlineSlide from './OutlineSlide';
import { exportToPowerPoint, exportToPDF, exportToImages } from '@/utils/slideExporter';
import { useToast } from '@/hooks/use-toast';

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
  slides, deckTitle, setDeckTitle, viewMode, setViewMode,
  onSave, onSlideEdit, isSaving, user
}) => {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

  if (slides.length === 0) return null;

  const handleExport = async (format: 'pptx' | 'pdf' | 'images') => {
    setIsExporting(format);
    try {
      const opts = {
        deckTitle,
        slides,
        onProgress: (current: number, total: number) => {
          toast({ title: `Exporting... ${current}/${total}` });
        },
        onSuccess: (msg: string) => {
          toast({ title: msg });
          setIsExporting(null);
        },
        onError: (err: string) => {
          toast({ title: 'Export failed', description: err, variant: 'destructive' });
          setIsExporting(null);
        },
      };
      if (format === 'pptx') await exportToPowerPoint(opts);
      else if (format === 'pdf') await exportToPDF(opts);
      else await exportToImages(opts);
    } catch {
      setIsExporting(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">

      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Input
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                className="text-xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                placeholder="Untitled Presentation"
              />
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Badge variant="secondary">{slides.length} slides</Badge>
                <span>•</span>
                <span>Last edited now</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode('outline')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${viewMode === 'outline' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <List className="h-3.5 w-3.5" /> Outline
                </button>
                <button
                  onClick={() => setViewMode('slide')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${viewMode === 'slide' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <Grid3X3 className="h-3.5 w-3.5" /> Slides
                </button>
              </div>

              <Button variant="outline" size="sm">
                <Play className="h-3.5 w-3.5 mr-1.5" /> Present
              </Button>

              <Button
                onClick={onSave}
                disabled={isSaving}
                size="sm"
                className={!user ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse' : ''}
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {isSaving ? 'Saving...' : !user ? 'Save (Sign up free!)' : 'Save'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main layout */}
      <div className="grid lg:grid-cols-4 gap-4">

        {/* Slide list sidebar */}
        <div className="hidden lg:block space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Slides ({slides.length})
          </div>
          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlideIndex(index)}
                className={`w-full text-left rounded-lg border transition-all overflow-hidden ${
                  selectedSlideIndex === index
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                {/* Mini slide preview */}
                <div
                  className="w-full relative overflow-hidden"
                  style={{
                    aspectRatio: '16/9',
                    background: slide.style?.backgroundColor || '#1e1b4b',
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: slide.style?.accentColor || '#7c3aed' }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-3 py-2" style={{ paddingLeft: '10px' }}>
                    <div
                      className="font-bold leading-tight truncate"
                      style={{
                        color: slide.style?.textColor || '#fff',
                        fontSize: '7px',
                        fontFamily: slide.style?.titleFont || 'Inter, sans-serif',
                      }}
                    >
                      {slide.title}
                    </div>
                    {(slide.bullets || []).slice(0, 2).map((b, bi) => (
                      <div
                        key={bi}
                        className="truncate opacity-70"
                        style={{ color: slide.style?.textColor || '#fff', fontSize: '5px', marginTop: '2px' }}
                      >
                        ▸ {b}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-2 py-1 bg-background">
                  <div className="text-xs font-medium truncate text-foreground">{index + 1}. {slide.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main editor */}
        <div className="lg:col-span-3">
          {viewMode === 'outline' ? (
            <div className="space-y-3">
              {slides.map((slide, index) => (
                <OutlineSlide
                  key={index}
                  slide={slide}
                  index={index}
                  onSlideUpdate={(idx, updated) => onSlideEdit(updated, idx)}
                />
              ))}
            </div>
          ) : (
            <div>
              {/* Mobile nav */}
              <div className="lg:hidden flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  {selectedSlideIndex + 1} / {slides.length}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"
                    onClick={() => setSelectedSlideIndex(Math.max(0, selectedSlideIndex - 1))}
                    disabled={selectedSlideIndex === 0}>← Prev</Button>
                  <Button variant="outline" size="sm"
                    onClick={() => setSelectedSlideIndex(Math.min(slides.length - 1, selectedSlideIndex + 1))}
                    disabled={selectedSlideIndex === slides.length - 1}>Next →</Button>
                </div>
              </div>

              {/* Slide — NO card wrapper, full theme shows */}
              <StyledSlide
                slide={slides[selectedSlideIndex]}
                index={selectedSlideIndex}
                onSlideUpdate={(idx, updated) => onSlideEdit(updated, idx)}
              />

              {/* Speaker notes */}
              {slides[selectedSlideIndex]?.speakerNotes && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Speaker notes
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {slides[selectedSlideIndex].speakerNotes}
                  </p>
                </div>
              )}

              {/* Slide pagination dots */}
              <div className="flex justify-center gap-1.5 mt-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSlideIndex(i)}
                    className={`rounded-full transition-all ${
                      i === selectedSlideIndex
                        ? 'w-5 h-2 bg-primary'
                        : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export panel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-medium text-sm">Export your presentation</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Download as editable PowerPoint, PDF, or image slides
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline" size="sm"
                onClick={() => handleExport('pptx')}
                disabled={isExporting === 'pptx'}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                {isExporting === 'pptx' ? 'Exporting...' : 'PowerPoint'}
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={() => handleExport('pdf')}
                disabled={isExporting === 'pdf'}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                {isExporting === 'pdf' ? 'Exporting...' : 'PDF'}
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={() => handleExport('images')}
                disabled={isExporting === 'images'}
              >
                <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
                {isExporting === 'images' ? 'Exporting...' : 'Images (ZIP)'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlideEditor;
