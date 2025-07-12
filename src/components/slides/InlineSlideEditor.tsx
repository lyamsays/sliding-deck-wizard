import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit3, 
  Save, 
  X, 
  Type, 
  List, 
  Image, 
  Palette,
  Layout,
  Move,
  Trash2,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Slide } from '@/types/deck';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InlineSlideEditorProps {
  slide: Slide;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedSlide: Slide) => void;
  onCancel: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  className?: string;
}

const InlineSlideEditor: React.FC<InlineSlideEditorProps> = ({
  slide,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDuplicate,
  className
}) => {
  const [editedSlide, setEditedSlide] = useState<Slide>(slide);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  // Update edited slide when slide prop changes
  useEffect(() => {
    setEditedSlide(slide);
  }, [slide]);

  // Focus title input when editing starts
  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editedSlide);
  };

  const handleFieldChange = (field: keyof Slide, value: any) => {
    setEditedSlide(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleChange = (styleField: string, value: any) => {
    setEditedSlide(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [styleField]: value
      }
    }));
  };

  const layoutOptions = [
    { value: 'left-image', label: 'Image Left' },
    { value: 'right-image', label: 'Image Right' },
    { value: 'top-image', label: 'Image Top' },
    { value: 'bottom-image', label: 'Image Bottom' },
    { value: 'center-image', label: 'Image Center' },
    { value: 'no-image', label: 'Text Only' }
  ];

  if (!isEditing) {
    return (
      <Card className={`group relative overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}>
        <CardContent className="p-4">
          {/* Quick Action Toolbar */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-md p-1 shadow-sm border">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onEdit}
                      className="h-7 w-7 p-0"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit slide</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDuplicate}
                      className="h-7 w-7 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate slide</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete slide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Slide Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Slide {slide.slideNumber || 1}
              </Badge>
              {slide.style?.layout && (
                <Badge variant="secondary" className="text-xs">
                  {layoutOptions.find(opt => opt.value === slide.style?.layout)?.label || slide.style.layout}
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-lg line-clamp-2 cursor-pointer" onClick={onEdit}>
              {slide.title}
            </h3>

            <div className="text-sm text-muted-foreground space-y-2">
              {(slide.bulletPoints || slide.bullets) && (slide.bulletPoints || slide.bullets)!.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {(slide.bulletPoints || slide.bullets)!.slice(0, 3).map((point: string, index: number) => (
                    <li key={index} className="line-clamp-1">{point}</li>
                  ))}
                  {(slide.bulletPoints || slide.bullets)!.length > 3 && (
                    <li className="text-muted-foreground">+{(slide.bulletPoints || slide.bullets)!.length - 3} more points...</li>
                  )}
                </ul>
              )}
              
              {slide.visualSuggestion && (
                <p className="text-xs italic">
                  💡 {slide.visualSuggestion}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      className={`${className}`}
    >
      <Card className="border-primary/30 shadow-lg">
        <CardContent className="p-6">
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Editing Slide {slide.slideNumber || 1}</h4>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-1"
              >
                {isPreviewMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
              
              <Button
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-1"
              >
                <Save className="h-3 w-3" />
                Save
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isPreviewMode ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Preview Mode */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">{editedSlide.title}</h3>
                  
                  {(editedSlide.bulletPoints || editedSlide.bullets) && (editedSlide.bulletPoints || editedSlide.bullets)!.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {(editedSlide.bulletPoints || editedSlide.bullets)!.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}
                  
                  {editedSlide.visualSuggestion && (
                    <p className="text-sm text-muted-foreground mt-3 italic">
                      💡 {editedSlide.visualSuggestion}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Edit Mode */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Content Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Type className="h-4 w-4" />
                      Content
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <Input
                          ref={titleRef}
                          value={editedSlide.title}
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          placeholder="Enter slide title..."
                          className="font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Bullet Points</label>
                        <Textarea
                          value={(editedSlide.bulletPoints || editedSlide.bullets)?.join('\n') || ''}
                          onChange={(e) => {
                            const points = e.target.value.split('\n').filter(Boolean);
                            handleFieldChange('bullets', points);
                            setEditedSlide(prev => ({ ...prev, bulletPoints: points }));
                          }}
                          placeholder="Enter bullet points (one per line)..."
                          rows={6}
                          className="text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Visual Suggestion</label>
                        <Input
                          value={editedSlide.visualSuggestion || ''}
                          onChange={(e) => handleFieldChange('visualSuggestion', e.target.value)}
                          placeholder="Describe suggested visuals..."
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Style Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Palette className="h-4 w-4" />
                      Style
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Layout</label>
                        <Select
                          value={editedSlide.style?.layout || 'right-image'}
                          onValueChange={(value) => handleStyleChange('layout', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select layout" />
                          </SelectTrigger>
                          <SelectContent>
                            {layoutOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <Layout className="h-3 w-3" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Background</label>
                          <Input
                            type="color"
                            value={editedSlide.style?.backgroundColor || '#ffffff'}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">Accent Color</label>
                          <Input
                            type="color"
                            value={editedSlide.style?.accentColor || '#6366f1'}
                            onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Icon Type</label>
                        <Input
                          value={editedSlide.style?.iconType || ''}
                          onChange={(e) => handleStyleChange('iconType', e.target.value)}
                          placeholder="e.g., chart, lightbulb, users"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InlineSlideEditor;