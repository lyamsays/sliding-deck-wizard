
import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Copy, Edit, Download, Image, LayoutGrid, LayoutList, GalleryHorizontal, GalleryVertical } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getIconSuggestion } from '@/types/deck';

interface StyledSlideProps {
  slide: Slide;
  index: number;
  onSlideUpdate: (index: number, updatedSlide: Slide) => void;
}

const StyledSlide: React.FC<StyledSlideProps> = ({ slide, index, onSlideUpdate }) => {
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();
  const backgroundColor = slide.style?.backgroundColor || '#F1F0FB';
  const iconName = slide.style?.iconType || getIconSuggestion(slide.title, slide.visualSuggestion);
  // Ensure layout is one of the allowed types
  const layout = slide.style?.layout || 'right-image';
  
  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.FileText;
  
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
  
  const handleLayoutChange = () => {
    // Cycle through available layouts
    const layouts: Array<'left-image' | 'right-image' | 'centered' | 'title-focus'> = [
      'left-image', 'right-image', 'centered', 'title-focus'
    ];
    const currentIndex = layouts.indexOf(layout as any);
    const nextLayout = layouts[(currentIndex + 1) % layouts.length];
    
    onSlideUpdate(index, {
      ...slide,
      style: {
        ...slide.style,
        layout: nextLayout
      }
    });
    
    toast({
      title: "Layout updated",
      description: `Slide layout changed to ${nextLayout.replace('-', ' ')}.`,
    });
  };

  // Get the layout icon based on current layout
  const getLayoutIcon = () => {
    switch(layout) {
      case 'left-image':
        return <GalleryVertical className="h-4 w-4" />;
      case 'right-image':
        return <GalleryHorizontal className="h-4 w-4" />;
      case 'centered':
        return <LayoutGrid className="h-4 w-4" />;
      case 'title-focus':
        return <LayoutList className="h-4 w-4" />;
      default:
        return <LayoutGrid className="h-4 w-4" />;
    }
  };

  // Render the slide content based on layout
  const renderSlideContent = () => {
    switch(layout) {
      case 'left-image':
        return (
          <div className="flex flex-row-reverse">
            <div className="flex-grow">
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
            </div>
            <div className="mr-6 flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                <IconComponent className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
        );
      case 'right-image':
        return (
          <div className="flex flex-row">
            <div className="flex-grow">
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
            </div>
            <div className="ml-6 flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                <IconComponent className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
        );
      case 'centered':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-6 w-24 h-24 flex items-center justify-center bg-primary/10 rounded-full">
              <IconComponent className="h-12 w-12 text-primary" />
            </div>
            <div className="w-full">
              <ul className="space-y-3">
                {slide.bullets.map((bullet, bulletIndex) => (
                  <li 
                    key={bulletIndex} 
                    className="flex items-center justify-center text-center"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBulletChange(bulletIndex, e)}
                    role="textbox"
                    aria-label={`Bullet point ${bulletIndex + 1}`}
                  >
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'title-focus':
        return (
          <div className="flex flex-col">
            <div className="mb-8 py-4 bg-primary/30 rounded-lg text-center">
              <h2 className="text-3xl font-bold text-gray-800">{slide.title}</h2>
            </div>
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
              </div>
              <ul className="space-y-3 flex-grow">
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
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-row">
            <div className="flex-grow">
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
            </div>
            <div className="ml-6 flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                <IconComponent className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card 
      className="overflow-hidden border border-gray-200 transition-shadow hover:shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ backgroundColor }}
    >
      <CardHeader className={`pb-3 flex flex-row justify-between items-center border-b border-gray-100 ${layout === 'title-focus' ? 'hidden' : ''}`}>
        <h3 
          className="text-xl font-bold text-gray-800"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
          role="textbox"
          aria-label="Slide title"
        >
          {slide.title}
        </h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLayoutChange}
            className={`transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          >
            {getLayoutIcon()}
            <span className="sr-only">Change layout</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopySlide}
            className={`transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy slide</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {renderSlideContent()}
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

export default StyledSlide;
