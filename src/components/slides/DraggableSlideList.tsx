import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus } from 'lucide-react';
import { Slide } from '@/types/deck';
import InlineSlideEditor from './InlineSlideEditor';
import QuickSlideCreator from './QuickSlideCreator';
import { motion, AnimatePresence } from 'framer-motion';

interface SortableSlideItemProps {
  slide: Slide;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedSlide: Slide) => void;
  onCancel: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const SortableSlideItem: React.FC<SortableSlideItemProps> = ({
  slide,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDuplicate,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle - Touch-friendly */}
      {!isEditing && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing touch-manipulation"
        >
          <div className="bg-background/90 backdrop-blur-sm rounded p-2 md:p-1 shadow-sm border min-h-[44px] md:min-h-auto min-w-[44px] md:min-w-auto flex items-center justify-center">
            <GripVertical className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      <div className={`${!isEditing ? 'group pl-12 md:pl-8' : ''}`}>
        <InlineSlideEditor
          slide={slide}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      </div>
    </div>
  );
};

interface DraggableSlideListProps {
  slides: Slide[];
  onSlidesReorder: (slides: Slide[]) => void;
  onSlideUpdate: (slideId: string, updatedSlide: Slide) => void;
  onSlideDelete: (slideId: string) => void;
  onSlideDuplicate: (slideId: string) => void;
  onAddSlide: () => void;
  className?: string;
}

const DraggableSlideList: React.FC<DraggableSlideListProps> = ({
  slides,
  onSlidesReorder,
  onSlideUpdate,
  onSlideDelete,
  onSlideDuplicate,
  onAddSlide,
  className
}) => {
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showQuickCreator, setShowQuickCreator] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5, // Mobile-friendly tolerance
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = slides.findIndex(slide => slide.id === active.id);
      const newIndex = slides.findIndex(slide => slide.id === over?.id);
      
      const newSlides = arrayMove(slides, oldIndex, newIndex);
      
      // Update slide numbers
      const updatedSlides = newSlides.map((slide, index) => ({
        ...slide,
        slideNumber: index + 1
      }) as Slide);
      
      onSlidesReorder(updatedSlides);
    }

    setActiveId(null);
  };

  const handleEdit = (slideId: string) => {
    setEditingSlideId(slideId);
  };

  const handleSave = (slideId: string, updatedSlide: Slide) => {
    onSlideUpdate(slideId, updatedSlide);
    setEditingSlideId(null);
  };

  const handleCancel = () => {
    setEditingSlideId(null);
  };

  const handleDelete = (slideId: string) => {
    onSlideDelete(slideId);
    if (editingSlideId === slideId) {
      setEditingSlideId(null);
    }
  };

  const handleDuplicate = (slideId: string) => {
    onSlideDuplicate(slideId);
  };

  const handleQuickAdd = () => {
    setShowQuickCreator(true);
  };

  const handleQuickSlideCreate = (slide: Slide) => {
    // Update slide number to be correct  
    const updatedSlide = { ...slide, slideNumber: slides.length + 1 } as Slide;
    onAddSlide(); // This will trigger the parent to add a new slide
    // Then update it with our custom slide data
    setTimeout(() => {
      const newSlides = [...slides, updatedSlide];
      onSlidesReorder(newSlides);
    }, 0);
  };

  const activeSlide = slides.find(slide => slide.id === activeId);

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Your Slides</h3>
          <p className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">Drag to reorder • Click to edit • </span>
            {slides.length} slide{slides.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={onAddSlide}
            variant="outline"
            className="flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Quick Add</span>
          </Button>
          <Button
            onClick={handleQuickAdd}
            className="flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Advanced Add</span>
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            <AnimatePresence>
              {slides.map((slide) => (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortableSlideItem
                    slide={slide}
                    isEditing={editingSlideId === slide.id}
                    onEdit={() => handleEdit(slide.id)}
                    onSave={(updatedSlide) => handleSave(slide.id, updatedSlide)}
                    onCancel={handleCancel}
                    onDelete={() => handleDelete(slide.id)}
                    onDuplicate={() => handleDuplicate(slide.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSlide && (
            <Card className="shadow-2xl border-primary/30 rotate-3 scale-105">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                   <Badge variant="outline" className="text-xs">
                     Slide {activeSlide.slideNumber || 1}
                   </Badge>
                 </div>
                 <h3 className="font-semibold text-lg line-clamp-1">
                   {activeSlide.title}
                 </h3>
                 <div className="text-sm text-muted-foreground mt-2">
                   {(activeSlide.bulletPoints || activeSlide.bullets) && (activeSlide.bulletPoints || activeSlide.bullets)!.length > 0 && (
                     <p>{(activeSlide.bulletPoints || activeSlide.bullets)![0]}...</p>
                   )}
                </div>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      {slides.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="bg-muted/30 rounded-lg p-8">
            <h4 className="font-medium mb-2">No slides yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first slide to get started with your presentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={onAddSlide} className="flex items-center justify-center gap-2 min-h-[44px] touch-manipulation">
                <Plus className="h-4 w-4" />
                Quick Add
              </Button>
              <Button onClick={handleQuickAdd} variant="outline" className="flex items-center justify-center gap-2 min-h-[44px] touch-manipulation">
                <Plus className="h-4 w-4" />
                Advanced Add
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DraggableSlideList;