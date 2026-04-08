import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slide } from '@/types/deck';
import {
  Save, Download, Play, List, Grid3X3, FileText,
  Image as ImageIcon, Plus, Trash2, GripVertical, Palette
} from 'lucide-react';
import StyledSlide from './StyledSlide';
import OutlineSlide from './OutlineSlide';
import PresentMode from './PresentMode';
import ThemeSwitcher from './ThemeSwitcher';
import { exportToPowerPoint, exportToPDF, exportToImages } from '@/utils/slideExporter';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { themes } from '@/components/themes/theme-data';

interface SlideEditorProps {
  slides: Slide[];
  deckTitle: string;
  setDeckTitle: (title: string) => void;
  viewMode: 'outline' | 'slide';
  setViewMode: (mode: 'outline' | 'slide') => void;
  onSave: () => void;
  onSlideEdit: (slide: Slide, index: number) => void;
  onSlidesReorder?: (slides: Slide[]) => void;
  isSaving: boolean;
  user: any;
}

// ── Sortable slide thumbnail ──────────────────────────────────────────────────
const SortableSlide = ({
  slide, index, isSelected, onSelect, onDelete, totalSlides
}: {
  slide: Slide; index: number; isSelected: boolean;
  onSelect: () => void; onDelete: () => void; totalSlides: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const bg = slide.style?.backgroundColor || '#1e1b4b';
  const bs = bg.includes('gradient') ? { background: bg } : { backgroundColor: bg };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <button
        onClick={onSelect}
        className={`w-full rounded-lg overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : 'ring-1 ring-border hover:ring-primary/40'}`}
      >
        {/* Mini slide */}
        <div className="relative" style={{ ...bs, aspectRatio: '16/9' }}>
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: slide.style?.accentColor || '#7c3aed' }} />
          <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '8% 8% 8% 10%' }}>
            <div style={{ color: slide.style?.textColor || '#fff', fontSize: '6px', fontWeight: 700, lineHeight: 1.2, fontFamily: slide.style?.titleFont, marginBottom: '3px' }} className="line-clamp-2">
              {slide.title}
            </div>
            {(slide.bullets || []).slice(0, 2).map((b, i) => (
              <div key={i} style={{ color: slide.style?.textColor || '#fff', fontSize: '4.5px', opacity: 0.65, lineHeight: 1.3, display: 'flex', gap: '2px' }}>
                <span style={{ color: slide.style?.accentColor || '#7c3aed', flexShrink: 0 }}>▸</span>
                <span className="truncate">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-2 py-1 bg-background border-t border-border">
          <div className="text-xs text-foreground/70 truncate">{index + 1}. {slide.title}</div>
        </div>
      </button>

      {/* Drag handle */}
      <div
        {...attributes} {...listeners}
        className="absolute top-1 left-1 opacity-0 group-hover:opacity-70 cursor-grab active:cursor-grabbing p-0.5 rounded"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <GripVertical className="h-3 w-3 text-white" />
      </div>

      {/* Delete */}
      {totalSlides > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-90 rounded p-0.5 transition-opacity"
          style={{ backgroundColor: 'rgba(220,38,38,0.85)' }}
          title="Delete slide"
        >
          <Trash2 className="h-3 w-3 text-white" />
        </button>
      )}
    </div>
  );
};

// ── Main SlideEditor ──────────────────────────────────────────────────────────
const SlideEditor: React.FC<SlideEditorProps> = ({
  slides, deckTitle, setDeckTitle, viewMode, setViewMode,
  onSave, onSlideEdit, onSlidesReorder, isSaving, user
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (slides.length === 0) return null;

  const safeIndex = Math.min(selectedIndex, slides.length - 1);
  const currentSlide = slides[safeIndex];
  const currentThemeId = currentSlide?.style?.colorScheme || 'pristine';

  // ── DnD reorder ────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = slides.findIndex(s => s.id === active.id);
    const newIdx = slides.findIndex(s => s.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const reordered = arrayMove(slides, oldIdx, newIdx);
    onSlidesReorder?.(reordered);
    setSelectedIndex(newIdx);
  }, [slides, onSlidesReorder]);

  // ── Add blank slide ────────────────────────────────────────────────────────
  const addSlideAfter = useCallback((index: number) => {
    const refSlide = slides[index];
    const theme = themes.find(t => t.id === refSlide?.style?.colorScheme) || themes.find(t => t.id === 'pristine')!;
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      slideType: 'content',
      bullets: ['Add your first point here', 'Evidence or key insight', 'Supporting detail or example'],
      speakerNotes: 'Add speaker notes for this slide.',
      visualSuggestion: '',
      imageUrl: '',
      style: {
        backgroundColor: theme.background,
        textColor: theme.textColor,
        accentColor: theme.accentColor,
        titleFont: theme.titleFont,
        bodyFont: theme.bodyFont,
        cardDesign: theme.cardDesign,
        colorScheme: theme.id,
      }
    };
    const newSlides = [...slides.slice(0, index + 1), newSlide, ...slides.slice(index + 1)];
    onSlidesReorder?.(newSlides);
    setSelectedIndex(index + 1);
    toast({ title: 'Slide added', description: 'Click the title or bullets to edit.' });
  }, [slides, onSlidesReorder, toast]);

  // ── Delete slide ───────────────────────────────────────────────────────────
  const deleteSlide = useCallback((index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    onSlidesReorder?.(newSlides);
    setSelectedIndex(Math.min(index, newSlides.length - 1));
    toast({ title: 'Slide removed' });
  }, [slides, onSlidesReorder, toast]);

  // ── Theme switch ───────────────────────────────────────────────────────────
  const handleThemeChange = useCallback((newSlides: Slide[], themeId: string) => {
    onSlidesReorder?.(newSlides);
    toast({ title: 'Theme applied', description: themes.find(t => t.id === themeId)?.name });
  }, [onSlidesReorder, toast]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = async (format: 'pptx' | 'pdf' | 'images') => {
    setIsExporting(format);
    try {
      const opts = {
        deckTitle, slides,
        onProgress: (c: number, total: number) => toast({ title: `Exporting ${c}/${total}...` }),
        onSuccess: (msg: string) => { toast({ title: msg }); setIsExporting(null); },
        onError: (err: string) => { toast({ title: 'Export failed', description: err, variant: 'destructive' as any }); setIsExporting(null); },
      };
      if (format === 'pptx') await exportToPowerPoint(opts);
      else if (format === 'pdf') await exportToPDF(opts);
      else await exportToImages(opts);
    } catch { setIsExporting(null); }
  };

  return (
    <>
      {isPresentMode && (
        <PresentMode slides={slides} startIndex={safeIndex} onClose={() => setIsPresentMode(false)} />
      )}

      <div className="w-full max-w-7xl mx-auto space-y-4">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Input
                  value={deckTitle}
                  onChange={e => setDeckTitle(e.target.value)}
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
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button onClick={() => setViewMode('outline')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${viewMode === 'outline' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    <List className="h-3.5 w-3.5" /> Outline
                  </button>
                  <button onClick={() => setViewMode('slide')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${viewMode === 'slide' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    <Grid3X3 className="h-3.5 w-3.5" /> Slides
                  </button>
                </div>

                {/* Theme switcher */}
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => setShowThemeSwitcher(s => !s)}>
                    <Palette className="h-3.5 w-3.5 mr-1.5" /> Theme
                  </Button>
                  {showThemeSwitcher && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowThemeSwitcher(false)} />
                      <ThemeSwitcher
                        slides={slides}
                        currentThemeId={currentThemeId}
                        onThemeChange={handleThemeChange}
                        onClose={() => setShowThemeSwitcher(false)}
                      />
                    </>
                  )}
                </div>

                <Button variant="default" size="sm" onClick={() => setIsPresentMode(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Play className="h-3.5 w-3.5 mr-1.5" /> Present
                </Button>

                <Button onClick={onSave} disabled={isSaving} size="sm" className={!user ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse' : ''}>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {isSaving ? 'Saving...' : !user ? 'Save (Sign up free!)' : 'Save'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Main layout ─────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-4 gap-4">

          {/* Sidebar with DnD */}
          <div className="hidden lg:block">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Slides ({slides.length})
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 max-h-[72vh] overflow-y-auto pr-1">
                  {slides.map((slide, index) => (
                    <div key={slide.id}>
                      <SortableSlide
                        slide={slide}
                        index={index}
                        isSelected={index === safeIndex}
                        onSelect={() => setSelectedIndex(index)}
                        onDelete={() => deleteSlide(index)}
                        totalSlides={slides.length}
                      />
                      {/* Add slide button between slides */}
                      <button
                        onClick={() => addSlideAfter(index)}
                        className="w-full flex items-center justify-center gap-1 py-0.5 opacity-0 hover:opacity-100 transition-opacity group"
                        title="Add slide here"
                      >
                        <div className="flex-1 h-px bg-primary/20 group-hover:bg-primary/60 transition-colors" />
                        <div className="flex items-center gap-0.5 text-primary/60 group-hover:text-primary transition-colors">
                          <Plus className="h-3 w-3" />
                          <span className="text-xs">Add slide</span>
                        </div>
                        <div className="flex-1 h-px bg-primary/20 group-hover:bg-primary/60 transition-colors" />
                      </button>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Main editor */}
          <div className="lg:col-span-3">
            {viewMode === 'outline' ? (
              <div className="space-y-3">
                {slides.map((slide, index) => (
                  <OutlineSlide key={slide.id} slide={slide} index={index} onSlideUpdate={(idx, updated) => onSlideEdit(updated, idx)} />
                ))}
              </div>
            ) : (
              <div>
                {/* Mobile navigation */}
                <div className="lg:hidden flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{safeIndex + 1} / {slides.length}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedIndex(Math.max(0, safeIndex - 1))} disabled={safeIndex === 0}>← Prev</Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedIndex(Math.min(slides.length - 1, safeIndex + 1))} disabled={safeIndex === slides.length - 1}>Next →</Button>
                  </div>
                </div>

                {/* Slide — no card wrapper */}
                <StyledSlide
                  slide={currentSlide}
                  index={safeIndex}
                  onSlideUpdate={(idx, updated) => onSlideEdit(updated, idx)}
                />

                {/* Speaker notes */}
                {currentSlide?.speakerNotes && (
                  <div className="mt-3 p-3 bg-muted/40 rounded-lg border border-border">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Speaker Notes</div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{currentSlide.speakerNotes}</p>
                  </div>
                )}

                {/* Pagination dots */}
                <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => setSelectedIndex(i)}
                      className={`rounded-full transition-all ${i === safeIndex ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Export panel ───────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-medium text-sm">Export your presentation</div>
                <div className="text-xs text-muted-foreground mt-0.5">Download as editable PowerPoint, PDF, or image slides</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('pptx')} disabled={isExporting === 'pptx'}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />{isExporting === 'pptx' ? 'Exporting...' : 'PowerPoint'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} disabled={isExporting === 'pdf'}>
                  <FileText className="h-3.5 w-3.5 mr-1.5" />{isExporting === 'pdf' ? 'Exporting...' : 'PDF'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('images')} disabled={isExporting === 'images'}>
                  <ImageIcon className="h-3.5 w-3.5 mr-1.5" />{isExporting === 'images' ? 'Exporting...' : 'Images (ZIP)'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SlideEditor;
