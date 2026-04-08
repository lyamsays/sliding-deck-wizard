import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Image, MessageSquare, Wand2, PencilRuler, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getIconSuggestion } from '@/types/deck';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
  
  const backgroundColor = slide.style?.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const textColor = slide.style?.textColor || '#FFFFFF';
  const accentColor = slide.style?.accentColor || '#FFD700';
  const titleFont = slide.style?.titleFont || '"Inter", sans-serif';
  const bodyFont = slide.style?.bodyFont || '"Inter", sans-serif';
  
  const handleTitleChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent || "";
    onSlideUpdate(index, {
      ...slide,
      title: newTitle
    });
  };
  
  const handleBulletChange = (bulletIndex: number, e: React.FormEvent<HTMLLIElement>) => {
    const newBulletText = e.currentTarget.textContent || "";
    const updatedBullets = [...(slide.bullets || [])];
    updatedBullets[bulletIndex] = newBulletText;
    
    onSlideUpdate(index, {
      ...slide,
      bullets: updatedBullets
    });
  };

  const handleGenerateImageWithPrompt = async (prompt: string) => {
    setIsGeneratingImage(true);
    
    try {
      toast({
        title: "Generating high-quality image",
        description: "Creating a professional visual with GPT-Image-1...",
      });
      
      const { ImageGenerationService } = await import('@/services/imageGeneration');
      
      const result = await ImageGenerationService.generateImage({
        prompt,
        slideTitle: slide.title,
        slideContext: slide.bullets?.join(', '),
        timeout: 60000 // Increased timeout for better quality
      });
      
      onSlideUpdate(index, {
        ...slide,
        imageUrl: result.imageUrl,
        revisedPrompt: result.revisedPrompt
      });
      
      setIsImageDialogOpen(false);
      
      // Quality assessment
      const isHighQuality = await ImageGenerationService.assessImageQuality(result.imageUrl);
      
      toast({
        title: "Premium image generated",
        description: `Professional quality visual ${isHighQuality ? 'with excellent resolution' : ''} added to your slide.`,
      });
      
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Image generation failed",
        description: err.message || "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      
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
      
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };

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

  const handleSlideEdit = (updatedSlide: Slide) => {
    onSlideUpdate(index, updatedSlide);
  };

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

  const handleSaveEditedImage = (editedImageData: string, cropData: CropData) => {
    onSlideUpdate(index, {
      ...slide,
      imageUrl: editedImageData,
      cropData: cropData
    });
    
    toast({
      title: "Image updated",
      description: "Your image has been successfully edited.",
    });
  };

  // Modern side-by-side layout design
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ 
        background: backgroundColor,
        minHeight: '400px',
        aspectRatio: '16/9'
      }}
      id={`slide-content-${index}`}
    >
      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col p-8">
        {/* Title Section */}
        <div className="mb-6">
          <h2
            className="text-3xl font-bold leading-tight"
            style={{ 
              color: textColor,
              fontFamily: titleFont
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {slide.title}
          </h2>
        </div>

        {/* Main Content Area - Side by Side Layout */}
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-12 gap-8 w-full items-center">
            {/* Text Content - Takes up 7 columns when image exists, 12 when no image */}
            <div className={slide.imageUrl ? "col-span-7" : "col-span-12"}>
              <ul className="space-y-4">
                {(slide.bullets || []).map((bullet, bulletIndex) => (
                  <li 
                    key={bulletIndex} 
                    className="flex items-start text-lg"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBulletChange(bulletIndex, e)}
                    style={{ color: textColor }}
                  >
                    <span style={{ color: accentColor }} className="mr-3 mt-1 text-xl font-bold">•</span>
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Image Content - Takes up 5 columns when image exists */}
            {slide.imageUrl && (
              <div className="col-span-5 flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 w-full max-w-sm transition-all duration-300 hover:shadow-3xl hover:scale-105">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title}
                    className="w-full h-72 object-cover transition-all duration-300"
                    crossOrigin="anonymous"
                    loading="lazy"
                    style={{
                      filter: 'brightness(1.05) contrast(1.1) saturate(1.1)',
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', slide.imageUrl);
                      // Replace with placeholder on error
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', slide.imageUrl);
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Placeholder when no image */}
            {!slide.imageUrl && (slide.visualSuggestion || isGeneratingImage) && (
              <div className="col-span-5 flex justify-center">
                <div 
                  className="w-full h-72 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/20 max-w-sm cursor-pointer transition-all duration-300 hover:border-white/40 hover:bg-white/15"
                  onClick={() => setIsImageDialogOpen(true)}
                >
                  <div className="text-center">
                    {isGeneratingImage ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50 mb-3"></div>
                        <p className="text-white/70 text-sm">Generating image...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Image className="h-12 w-12 mx-auto mb-3 text-white/40" />
                        <p className="text-white/60 text-sm font-medium">Click to add image</p>
                        {slide.visualSuggestion && (
                          <p className="text-white/40 text-xs mt-2 px-4 text-center">
                            💡 {slide.visualSuggestion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons - Hidden in Export */}
      <div 
        className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-200 slide-ui-elements-not-for-export ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Wand2 className="h-4 w-4" />
        </Button>
        
        {slide.imageUrl ? (
          <>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              onClick={handleEditImage}
            >
              <PencilRuler className="h-4 w-4" />
            </Button>
            
            {onRemoveImage && (
              <Button
                size="sm"
                variant="destructive"
                className="bg-red-500/80 backdrop-blur-sm border-red-300/30 text-white hover:bg-red-600/80"
                onClick={onRemoveImage}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            onClick={() => setIsImageDialogOpen(true)}
            disabled={isGeneratingImage}
          >
            <Image className="h-4 w-4" />
          </Button>
        )}
      </div>
      
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
    </div>
  );
};

export default StyledSlide;
