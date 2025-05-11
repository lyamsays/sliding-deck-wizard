import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Image, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getIconSuggestion } from '@/types/deck';
import { supabase } from "@/integrations/supabase/client";
import ImageGenerationDialog from './ImageGenerationDialog';
import ImageEditor from './ImageEditor';
import SlideEditDialog from './SlideEditDialog';

// Import refactored components
import SlideHeader from './slide-parts/SlideHeader';
import SlideContent from './slide-parts/SlideContent';
import SlideActions from './slide-parts/SlideActions';

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
  const textColor = slide.style?.textColor || '#333333';
  const accentColor = slide.style?.accentColor || '#6E59A5';
  const titleFont = slide.style?.titleFont || '"Inter", sans-serif';
  const bodyFont = slide.style?.bodyFont || '"Inter", sans-serif';
  
  // Ensure layout is one of the allowed types
  const layout = slide.style?.layout || 'right-image';
  
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

  // New function to handle image uploads
  const handleImageUpload = async (file: File) => {
    try {
      // Convert the uploaded file to a data URL
      const dataUrl = await readFileAsDataURL(file);
      
      // Update the slide with the uploaded image
      onSlideUpdate(index, {
        ...slide,
        imageUrl: dataUrl,
        revisedPrompt: `User uploaded image: ${file.name}`
      });
      
      setIsImageDialogOpen(false);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been added to the slide.",
      });
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      console.error("Image upload error:", error);
    }
  };

  // Helper function to read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
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

  // Create a style object for the slide container
  const slideStyle = {
    backgroundColor,
    color: textColor,
    fontFamily: bodyFont
  };
  
  // Create a style object for the slide title
  const titleStyle = {
    color: textColor,
    fontFamily: titleFont
  };

  return (
    <Card 
      className="overflow-hidden border border-gray-200 transition-shadow hover:shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={slideStyle}
    >
      <CardHeader className="p-0">
        <SlideHeader
          title={slide.title}
          layout={layout}
          isHovering={isHovering}
          onTitleChange={handleTitleChange}
          onLayoutChange={handleLayoutChange}
          onCopySlide={handleCopySlide}
          titleStyle={titleStyle}
        />
      </CardHeader>
      <CardContent className="pt-6">
        <SlideContent 
          slide={slide}
          layout={layout as any}
          handleBulletChange={handleBulletChange}
          textColor={textColor}
          accentColor={accentColor}
        />
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-start text-sm max-w-[55%]" style={{ color: textColor }}>
          <Image className="h-4 w-4 mr-2 mt-1 flex-shrink-0" style={{ color: accentColor }} />
          <span className="line-clamp-2">
            <strong>Visual:</strong> {slide.revisedPrompt || slide.visualSuggestion || "Add an image to this slide"}
          </span>
        </div>
        
        <SlideActions
          slide={slide}
          isGeneratingImage={isGeneratingImage}
          onOpenImageDialog={() => setIsImageDialogOpen(true)}
          onOpenEditDialog={() => setIsEditDialogOpen(true)}
          onEditImage={handleEditImage}
          onRemoveImage={onRemoveImage}
          accentColor={accentColor}
        />
      </CardFooter>
      
      <ImageGenerationDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onGenerateImage={handleGenerateImageWithPrompt}
        onUploadImage={handleImageUpload}
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
