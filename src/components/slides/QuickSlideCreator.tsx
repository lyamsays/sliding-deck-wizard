import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus,
  Image,
  Type,
  Palette,
  Layout,
  Save,
  X,
  Lightbulb
} from 'lucide-react';
import { Slide } from '@/types/deck';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuickSlideCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSlideCreate: (slide: Slide) => void;
  slideNumber: number;
}

const QuickSlideCreator: React.FC<QuickSlideCreatorProps> = ({
  isOpen,
  onClose,
  onSlideCreate,
  slideNumber
}) => {
  const [newSlide, setNewSlide] = useState<Partial<Slide>>({
    title: '',
    bullets: [''],
    bulletPoints: [''],
    visualSuggestion: '',
    style: {
      backgroundColor: '#ffffff',
      accentColor: '#6366f1',
      textColor: '#1f2937',
      layout: 'right-image'
    }
  });

  const handleCreate = () => {
    const slide: Slide = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newSlide.title || 'New Slide',
      bullets: newSlide.bulletPoints?.filter(Boolean) || [],
      bulletPoints: newSlide.bulletPoints?.filter(Boolean) || [],
      slideNumber,
      visualSuggestion: newSlide.visualSuggestion,
      style: newSlide.style
    };

    onSlideCreate(slide);
    onClose();
    
    // Reset form
    setNewSlide({
      title: '',
      bullets: [''],
      bulletPoints: [''],
      visualSuggestion: '',
      style: {
        backgroundColor: '#ffffff',
        accentColor: '#6366f1',
        textColor: '#1f2937',
        layout: 'right-image'
      }
    });
  };

  const handleBulletPointChange = (index: number, value: string) => {
    const newBulletPoints = [...(newSlide.bulletPoints || [''])];
    newBulletPoints[index] = value;
    
    // Add new empty bullet point if this is the last one and it's not empty
    if (index === newBulletPoints.length - 1 && value.trim()) {
      newBulletPoints.push('');
    }
    
    // Remove empty bullet points except the last one
    const filteredPoints = newBulletPoints.filter((point, idx) => 
      point.trim() !== '' || idx === newBulletPoints.length - 1
    );
    
    setNewSlide(prev => ({ 
      ...prev, 
      bulletPoints: filteredPoints,
      bullets: filteredPoints 
    }));
  };

  const templates = [
    {
      id: 'title-slide',
      name: 'Title Slide',
      title: 'Presentation Title',
      bulletPoints: ['Your name', 'Date', 'Occasion']
    },
    {
      id: 'agenda',
      name: 'Agenda',
      title: 'Agenda',
      bulletPoints: ['Introduction', 'Main Topics', 'Discussion', 'Next Steps']
    },
    {
      id: 'conclusion',
      name: 'Conclusion',
      title: 'Key Takeaways',
      bulletPoints: ['Summary of main points', 'Action items', 'Thank you']
    }
  ];

  const applyTemplate = (template: typeof templates[0]) => {
    setNewSlide(prev => ({
      ...prev,
      title: template.title,
      bulletPoints: [...template.bulletPoints, '']
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Slide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Templates */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Quick Templates
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template)}
                  className="text-left h-auto p-3"
                >
                  <div>
                    <div className="font-medium text-xs">{template.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {template.title}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Type className="h-4 w-4" />
                Content
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input
                    value={newSlide.title}
                    onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter slide title..."
                    className="font-medium"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Bullet Points</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                      {(newSlide.bulletPoints || ['']).map((point: string, index: number) => (
                        <Input
                          key={index}
                          value={point}
                        onChange={(e) => handleBulletPointChange(index, e.target.value)}
                        placeholder={index === 0 ? "Enter bullet point..." : "Add another point..."}
                        className="text-sm"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Visual Suggestion</label>
                  <Input
                    value={newSlide.visualSuggestion}
                    onChange={(e) => setNewSlide(prev => ({ ...prev, visualSuggestion: e.target.value }))}
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
                    value={newSlide.style?.layout || 'right-image'}
                    onValueChange={(value) => setNewSlide(prev => ({ 
                      ...prev, 
                      style: { ...prev.style, layout: value as any }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left-image">Image Left</SelectItem>
                      <SelectItem value="right-image">Image Right</SelectItem>
                      <SelectItem value="top-image">Image Top</SelectItem>
                      <SelectItem value="bottom-image">Image Bottom</SelectItem>
                      <SelectItem value="center-image">Image Center</SelectItem>
                      <SelectItem value="no-image">Text Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Background</label>
                    <Input
                      type="color"
                      value={newSlide.style?.backgroundColor || '#ffffff'}
                      onChange={(e) => setNewSlide(prev => ({ 
                        ...prev, 
                        style: { ...prev.style, backgroundColor: e.target.value }
                      }))}
                      className="h-10 w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Accent</label>
                    <Input
                      type="color"
                      value={newSlide.style?.accentColor || '#6366f1'}
                      onChange={(e) => setNewSlide(prev => ({ 
                        ...prev, 
                        style: { ...prev.style, accentColor: e.target.value }
                      }))}
                      className="h-10 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 className="text-sm font-medium mb-3">Preview</h4>
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Badge variant="outline" className="text-xs">
                    Slide {slideNumber}
                  </Badge>
                  <h3 className="font-semibold text-lg">
                    {newSlide.title || 'Slide Title'}
                  </h3>
                  {(newSlide.bulletPoints || newSlide.bullets) && (newSlide.bulletPoints || newSlide.bullets)!.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {(newSlide.bulletPoints || newSlide.bullets)!.filter(Boolean).map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}
                  {newSlide.visualSuggestion && (
                    <p className="text-xs text-muted-foreground italic">
                      💡 {newSlide.visualSuggestion}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Create Slide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSlideCreator;