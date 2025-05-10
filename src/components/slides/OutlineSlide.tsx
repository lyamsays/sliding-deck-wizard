
import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Copy, Image } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface OutlineSlideProps {
  slide: Slide;
  index: number;
  onSlideUpdate: (index: number, updatedSlide: Slide) => void;
}

const OutlineSlide: React.FC<OutlineSlideProps> = ({ slide, index, onSlideUpdate }) => {
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();
  
  const handleTitleChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent || "";
    onSlideUpdate(index, {
      ...slide,
      title: newTitle
    });
  };
  
  const handleBulletChange = (bulletIndex: number, e: React.FormEvent<HTMLLIElement>) => {
    const newBulletText = e.currentTarget.textContent || "";
    const updatedBullets = [...slide.bullets];
    updatedBullets[bulletIndex] = newBulletText;
    
    onSlideUpdate(index, {
      ...slide,
      bullets: updatedBullets
    });
  };
  
  const handleCopySlide = () => {
    let content = `${slide.title}\n\n`;
    slide.bullets.forEach(bullet => {
      content += `• ${bullet}\n`;
    });
    
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Slide content has been copied.",
      });
    });
  };
  
  return (
    <Card 
      className="overflow-hidden border border-gray-200 transition-shadow hover:shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="bg-primary/5 pb-3 flex flex-row justify-between items-center">
        <CardTitle 
          className="text-xl text-gray-800"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          role="textbox"
          aria-label="Slide title"
        >
          {slide.title}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopySlide}
          className={`transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        >
          <Copy className="h-4 w-4 mr-1" />
          <span className="sr-only">Copy slide</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {slide.bullets.map((bullet, bulletIndex) => (
            <li 
              key={bulletIndex} 
              className="flex items-start"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBulletChange(bulletIndex, e)}
              role="textbox"
              aria-label={`Bullet point ${bulletIndex + 1}`}
            >
              <span className="text-primary mr-2 mt-1">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      {slide.visualSuggestion && (
        <CardFooter className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-start text-sm text-gray-600">
            <Image className="h-4 w-4 mr-2 mt-1" />
            <span><strong>Visual suggestion:</strong> {slide.visualSuggestion}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default OutlineSlide;
