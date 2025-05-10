
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
        {deck.slides.map((slide, index) => (
          <Card key={index} className="overflow-hidden shadow-sm">
            <CardHeader className="bg-primary/5 py-4">
              <CardTitle className="text-lg">
                {slide.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {slide.bullets.map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default DeckViewer;
