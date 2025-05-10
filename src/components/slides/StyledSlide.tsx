import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Copy, Edit, Download, Image, LayoutGrid, LayoutList, GalleryHorizontal, GalleryVertical, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getIconSuggestion } from '@/types/deck';
import { supabase } from "@/integrations/supabase/client";

interface StyledSlideProps {
  slide: Slide;
  index: number;
  onSlideUpdate: (index: number, updatedSlide: Slide) => void;
}

const StyledSlide: React.FC<StyledSlideProps> = ({ slide, index, onSlideUpdate }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
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
  
  // Define available layouts
  const layouts: Array<'left-image' | 'right-image' | 'centered' | 'title-focus'> = [
    'left-image', 'right-image', 'centered', 'title-focus'
  ];
  
  const handleLayoutChange = (direction: 'next' | 'previous') => {
    const currentIndex = layouts.indexOf(layout as any);
    
    // Calculate the new index based on direction
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % layouts.length;
    } else {
      // For previous, we add layouts.length before modulo to handle negative index
      newIndex = (currentIndex - 1 + layouts.length) % layouts.length;
    }
    
    const newLayout = layouts[newIndex];
    
    onSlideUpdate(index, {
      ...slide,
      style: {
        ...slide.style,
        layout: newLayout
      }
    });
    
    toast({
      title: "Layout updated",
      description: `Slide layout changed to ${newLayout.replace('-', ' ')}.`,
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
    // If we have an image, display it instead of the icon
    const imageElement = slide.imageUrl ? (
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src={slide.imageUrl} 
          alt={slide.title} 
          className="object-cover w-full h-full"
        />
      </div>
    ) : (
      <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
        <IconComponent className="h-10 w-10 text-primary" />
      </div>
    );
    
    const imageSize = slide.imageUrl ? "w-full max-w-xs" : "w-20 h-20";
    
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
              {imageElement}
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
              {imageElement}
            </div>
          </div>
        );
      case 'centered':
        return (
          <div className="flex flex-col items-center">
            <div className={`mb-6 ${slide.imageUrl ? 'w-64 h-64' : 'w-24 h-24'} flex items-center justify-center ${!slide.imageUrl ? 'bg-primary/10 rounded-full' : ''}`}>
              {imageElement}
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

  const handleGenerateImage = async () => {
    if (!slide.visualSuggestion) {
      toast({
        title: "No visual suggestion",
        description: "This slide doesn't have a visual suggestion to generate an image from.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      // Create a refined prompt based on slide content for better image generation
      const imagePrompt = `Create a professional presentation slide visual about "${slide.title}". ${slide.visualSuggestion}. Make it suitable for a business presentation, clean and minimal style, no text in the image.`;
      
      toast({
        title: "Generating image",
        description: "Creating a visual for your slide...",
      });
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: imagePrompt }
      });
      
      if (error) {
        console.error("Error generating image:", error);
        throw new Error(error.message || "Failed to generate image");
      }
      
      if (data.error) {
        console.error("API error generating image:", data.error);
        throw new Error(data.error);
      }
      
      const { imageUrl, revisedPrompt } = data;
      
      // Update the slide with the generated image
      onSlideUpdate(index, {
        ...slide,
        imageUrl,
        revisedPrompt
      });
      
      toast({
        title: "Image generated",
        description: "Visual has been added to your slide.",
      });
      
    } catch (error: any) {
      toast({
        title: "Image generation failed",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive"
      });
      console.error("Image generation error:", error);
    } finally {
      setIsGeneratingImage(false);
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
          <div className={`flex items-center transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleLayoutChange('previous')}
              title="Previous layout"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous layout</span>
            </Button>
            
            <div className="flex items-center px-1">
              {getLayoutIcon()}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleLayoutChange('next')}
              title="Next layout"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next layout</span>
            </Button>
          </div>
          
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
      {(slide.visualSuggestion || slide.revisedPrompt) && (
        <CardFooter className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-start">
          <div className="flex items-start text-sm text-gray-600">
            <Image className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
            <span>
              <strong>Visual:</strong> {slide.revisedPrompt || slide.visualSuggestion}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateImage}
            disabled={isGeneratingImage || !slide.visualSuggestion}
            className="ml-4 flex-shrink-0"
          >
            {isGeneratingImage ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                {slide.imageUrl ? "Regenerate" : "Generate Image"}
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default StyledSlide;
