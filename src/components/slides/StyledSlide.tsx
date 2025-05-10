import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Copy, Edit, Download, Image, LayoutGrid, LayoutList, GalleryHorizontal, GalleryVertical, ChevronLeft, ChevronRight, RefreshCw, Trash2, MessageSquare, Wand, Crop } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getIconSuggestion } from '@/types/deck';
import { supabase } from "@/integrations/supabase/client";
import ImageGenerationDialog from './ImageGenerationDialog';
import ImageEditor from './ImageEditor';
import SlideEditDialog from './SlideEditDialog';

interface StyledSlideProps {
  slide: Slide;
  index: number;
  onSlideUpdate: (index: number, updatedSlide: Slide) => void;
  onRemoveImage?: () => void;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

const StyledSlide: React.FC<StyledSlideProps> = ({ slide, index, onSlideUpdate, onRemoveImage }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
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

  // Handle AI-assisted image generation
  const handleGenerateImageWithPrompt = async (prompt: string) => {
    setIsGeneratingImage(true);
    
    try {
      // Create a refined prompt based on the provided input
      const imagePrompt = `Create a professional presentation slide visual about "${slide.title}". ${prompt}. Make it suitable for a business presentation, clean and minimal style, no text in the image.`;
      
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
      
      setIsImageDialogOpen(false);
      
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

  // Handle AI slide edits
  const handleSlideEdit = (updatedSlide: Slide) => {
    onSlideUpdate(index, updatedSlide);
  };

  // New function to handle editing an image
  const handleEditImage = () => {
    if (!slide.imageUrl) {
      toast({
        title: "No image to edit",
        description: "Please add an image first.",
      });
      return;
    }
    setIsImageEditorOpen(true);
  };

  // Handle saving edited image
  const handleSaveEditedImage = (editedImageData: string, cropData: CropData) => {
    onSlideUpdate(index, {
      ...slide,
      imageUrl: editedImageData,
      // Optionally store the crop data if you need it later
      cropData: cropData
    });
    
    toast({
      title: "Image updated",
      description: "Your image has been successfully edited.",
    });
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
    
    // Add speaker notes display if available
    const speakerNotesElement = slide.speakerNotes ? (
      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
        <p className="text-sm font-medium text-gray-700">Speaker Notes:</p>
        <p className="text-sm text-gray-600 italic">{slide.speakerNotes}</p>
      </div>
    ) : null;
    
    switch(layout) {
      case 'left-image':
        return (
          <>
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
            {speakerNotesElement}
          </>
        );
      case 'right-image':
        return (
          <>
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
            {speakerNotesElement}
          </>
        );
      case 'centered':
        return (
          <>
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
            {speakerNotesElement}
          </>
        );
      case 'title-focus':
        return (
          <>
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
            {speakerNotesElement}
          </>
        );
      default:
        return (
          <>
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
            {speakerNotesElement}
          </>
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
            title="Copy slide content"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy slide</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {renderSlideContent()}
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-start text-sm text-gray-600 max-w-[55%]">
          <Image className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
          <span className="line-clamp-2">
            <strong>Visual:</strong> {slide.revisedPrompt || slide.visualSuggestion || "Add an image to this slide"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex-shrink-0"
          >
            <Wand className="h-4 w-4 mr-2" />
            Edit with AI
          </Button>
          
          {slide.imageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditImage}
              className="flex-shrink-0"
            >
              <Crop className="h-4 w-4 mr-2" />
              Edit Image
            </Button>
          )}
          
          {slide.imageUrl && onRemoveImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRemoveImage}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Image
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImageDialogOpen(true)}
            disabled={isGeneratingImage}
            className="flex-shrink-0"
          >
            {isGeneratingImage ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                {slide.imageUrl ? "Change Image" : "Add Image"}
              </>
            )}
          </Button>
        </div>
      </CardFooter>
      
      <ImageGenerationDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onGenerateImage={handleGenerateImageWithPrompt}
        isGenerating={isGeneratingImage}
        slideTitle={slide.title}
      />
      
      <SlideEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        slide={slide}
        onSlideUpdate={handleSlideEdit}
      />
      
      {slide.imageUrl && (
        <ImageEditor
          open={isImageEditorOpen}
          onOpenChange={setIsImageEditorOpen}
          imageUrl={slide.imageUrl}
          onSave={handleSaveEditedImage}
        />
      )}
    </Card>
  );
};

export default StyledSlide;
