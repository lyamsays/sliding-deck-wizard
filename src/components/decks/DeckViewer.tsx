
import React from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { SlideDeck } from "@/types/deck";
import * as LucideIcons from 'lucide-react';

interface DeckViewerProps {
  deck: SlideDeck;
  onClose: () => void;
}

const DeckViewer = ({ deck, onClose }: DeckViewerProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{deck.title}</CardTitle>
            <CardDescription>
              Created on {format(new Date(deck.created_at), 'MMMM d, yyyy')}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 max-h-[700px] overflow-y-auto">
        {deck.slides.map((slide, index) => {
          // Get the icon component dynamically
          const iconName = slide.style?.iconType || 'FileText';
          const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.FileText;
          const backgroundColor = slide.style?.backgroundColor || '#F1F0FB';
          const layout = slide.style?.layout || 'right-image';
          
          return (
            <Card 
              key={index} 
              className="overflow-hidden shadow-sm"
              style={{ backgroundColor }}
            >
              <CardHeader className={`bg-primary/5 py-4 ${layout === 'title-focus' ? 'hidden' : ''}`}>
                <CardTitle className="text-lg">
                  {slide.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {layout === 'title-focus' && (
                  <div className="mb-6 py-4 bg-primary/30 rounded-lg text-center">
                    <h2 className="text-xl font-bold text-gray-800">{slide.title}</h2>
                  </div>
                )}
                
                <div className={`flex ${layout === 'centered' ? 'flex-col items-center' : 
                  layout === 'left-image' ? 'flex-row-reverse' : 
                  layout === 'right-image' ? 'flex-row' : ''}`}>
                  
                  {/* Content area with bullets */}
                  <div className={`${(layout === 'left-image' || layout === 'right-image') ? 'flex-grow' : 'w-full'}`}>
                    <ul className={`space-y-2 ${layout === 'centered' ? 'text-center' : ''}`}>
                      {slide.bullets.map((bullet: string, i: number) => (
                        <li key={i} className={`flex items-start ${layout === 'centered' ? 'justify-center' : ''}`}>
                          {layout !== 'centered' && <span className="text-primary mr-2 mt-1">•</span>}
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Image or icon area */}
                  {(layout === 'left-image' || layout === 'right-image' || layout === 'centered') && (
                    <div className={`${layout === 'left-image' ? 'mr-6' : 
                      layout === 'right-image' ? 'ml-6' : 
                      layout === 'centered' ? 'mb-6' : ''} flex items-center justify-center`}>
                      
                      {slide.imageUrl ? (
                        <div className="overflow-hidden rounded-lg">
                          <img 
                            src={slide.imageUrl} 
                            alt={slide.title} 
                            className={`object-cover ${layout === 'centered' ? 'w-64 h-64' : 'max-w-xs'}`}
                          />
                        </div>
                      ) : (
                        <div className={`${layout === 'centered' ? 'w-24 h-24' : 'w-20 h-20'} flex items-center justify-center bg-primary/10 rounded-full`}>
                          <IconComponent className={`${layout === 'centered' ? 'h-12 w-12' : 'h-10 w-10'} text-primary`} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Speaker notes if available */}
                {slide.speakerNotes && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Speaker Notes:</p>
                    <p className="text-sm text-gray-600 italic">{slide.speakerNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DeckViewer;
