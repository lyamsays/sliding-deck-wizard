import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slide } from '@/types/deck';

interface SlideNavigationProps {
  slides: Slide[];
  selectedSlideId: string | undefined;
  onSlideSelect: (slideId: string) => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
  slides,
  selectedSlideId,
  onSlideSelect
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Slides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => onSlideSelect(slide.id)}
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
  );
};

export default SlideNavigation;