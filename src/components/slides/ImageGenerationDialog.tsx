
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Slide } from '@/types/deck';

// Import refactored components
import AIGenerateTab from './image-generation/AIGenerateTab';
import UploadTab from './image-generation/UploadTab';
import WebSearchTab from './image-generation/WebSearchTab';
import { WebImage } from './image-generation/types';

interface ImageGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  onUploadImage?: (file: File) => Promise<void>;
  isGenerating: boolean;
  slideTitle: string;
  slide?: Slide;
}

const ImageGenerationDialog: React.FC<ImageGenerationDialogProps> = ({
  open,
  onOpenChange,
  onGenerateImage,
  onUploadImage,
  isGenerating,
  slideTitle,
  slide
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState<number>(0);
  const { toast } = useToast();
  
  // State for web image search
  const [searchQuery, setSearchQuery] = useState('');
  const [webImages, setWebImages] = useState<WebImage[]>([]);
  const [selectedWebImage, setSelectedWebImage] = useState<WebImage | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recommendedTab, setRecommendedTab] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Logic to determine recommended tab based on slide content
  useEffect(() => {
    if (!slide) return;

    const analyzeSlideContent = () => {
      const title = slide.title?.toLowerCase() || '';
      const bullets = Array.isArray(slide.bullets) ? slide.bullets.join(' ').toLowerCase() : '';
      const combinedContent = title + ' ' + bullets;
      
      // Keywords that suggest real photos might be better
      const realPhotoKeywords = [
        'team', 'person', 'people', 'customer', 'client', 'stakeholder', 
        'collaboration', 'meeting', 'leader', 'leadership', 'office',
        'interview', 'testimonial', 'showcase', 'employee', 'staff',
        'workspace', 'environment', 'location', 'venue', 'event'
      ];
      
      // Check if any real photo keywords are present
      const hasRealPhotoKeyword = realPhotoKeywords.some(keyword => 
        combinedContent.includes(keyword)
      );
      
      if (hasRealPhotoKeyword) {
        return 'web';
      }
      
      return null;
    };
    
    const recommendation = analyzeSlideContent();
    setRecommendedTab(recommendation);
    
    // Auto-select the recommended tab if available and dialog opens
    if (recommendation && open) {
      setActiveTab(recommendation);
      
      // If web search is recommended, pre-fill search with title keywords
      if (recommendation === 'web' && slide.title) {
        // Extract meaningful keywords from title
        const titleWords = slide.title.split(' ')
          .filter(word => word.length > 3) // Filter out short words
          .slice(0, 2) // Take first two meaningful words
          .join(' ');
        
        if (titleWords) {
          setSearchQuery(titleWords);
          // Trigger search after a short delay
          setTimeout(() => {
            handleSearchImages();
          }, 300);
        }
      }
    }
  }, [slide, open]);

  // Effect to simulate loading progress during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating) {
      setProgressValue(10);
      interval = setInterval(() => {
        setProgressValue(prev => {
          // Cap progress at 90% until complete
          if (prev >= 90) return 90;
          return prev + Math.floor(Math.random() * 15);
        });
      }, 800);
    } else {
      setProgressValue(100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt for image generation.",
        variant: "destructive"
      });
      return;
    }
    
    onGenerateImage(prompt);
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUploadImage) return;
    
    try {
      await onUploadImage(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Close dialog upon successful upload
      onOpenChange(false);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Search for images from the web
  const handleSearchImages = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty search query",
        description: "Please enter a search term for web images.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    setWebImages([]);
    setSelectedWebImage(null);
    setApiKeyMissing(false);
    
    try {
      console.log("Searching images with query:", searchQuery);
      
      const { data, error } = await supabase.functions.invoke('search-images', {
        body: { searchQuery: searchQuery }
      });
      
      console.log("Search results:", data, "Error:", error);
      
      if (error) {
        console.error("Function error:", error);
        throw new Error(error.message || "An error occurred while searching for images");
      }
      
      if (data.error) {
        // Check if the error is due to missing API key
        if (data.apiKeyMissing) {
          setApiKeyMissing(true);
          console.error("API key missing:", data.error);
        }
        throw new Error(data.error);
      }
      
      if (data.images && Array.isArray(data.images)) {
        console.log("Found images:", data.images.length);
        setWebImages(data.images);
        
        if (data.images.length === 0) {
          toast({
            title: "No images found",
            description: "Try a different search term.",
          });
        }
      }
    } catch (error: any) {
      console.error("Error searching for images:", error);
      toast({
        title: "Search failed",
        description: error.message || "Failed to search for images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle use of selected web image
  const handleUseWebImage = async () => {
    if (!selectedWebImage) return;
    
    // Convert the web image to a blob/file
    try {
      console.log("Selected image URL:", selectedWebImage.url);
      
      try {
        // Check if image is accessible with CORS
        const testResponse = await fetch(selectedWebImage.url, { method: 'HEAD' });
        console.log("Image HEAD response:", testResponse.status, testResponse.ok);
      } catch (testError) {
        console.warn("HEAD request failed, might have CORS issues:", testError);
      }
      
      const response = await fetch(selectedWebImage.url);
      console.log("Image fetch response:", response.status, response.ok);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log("Image blob created:", blob.type, blob.size);
      
      // Create a file from the blob
      const filename = `unsplash-${selectedWebImage.id}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
      if (onUploadImage) {
        await onUploadImage(file);
        setSelectedWebImage(null);
        onOpenChange(false);
        
        toast({
          title: "Image added",
          description: `Photo by ${selectedWebImage.authorName} on Unsplash`,
        });
      }
    } catch (error: any) {
      console.error("Error using web image:", error);
      
      // Fallback to direct URL if blob method fails
      try {
        console.log("Trying fallback method with direct URL");
        
        if (onUploadImage && selectedWebImage.url) {
          // Create a temporary File object with the URL reference
          const response = await fetch('/api/proxy-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: selectedWebImage.url })
          });
          
          if (!response.ok) {
            throw new Error("Proxy fetch failed");
          }
          
          const data = await response.blob();
          const file = new File([data], `unsplash-${selectedWebImage.id}.jpg`, { type: 'image/jpeg' });
          
          await onUploadImage(file);
          setSelectedWebImage(null);
          onOpenChange(false);
          
          toast({
            title: "Image added",
            description: `Photo by ${selectedWebImage.authorName} on Unsplash`,
          });
        }
      } catch (fallbackError) {
        console.error("Fallback method also failed:", fallbackError);
        toast({
          title: "Failed to use image",
          description: "We couldn't download this image. Please try another image or upload your own.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Reset the state when the dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setPrompt('');
      setSearchQuery('');
      setWebImages([]);
      setSelectedWebImage(null);
      setApiKeyMissing(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Image to Slide</DialogTitle>
          <DialogDescription>
            Add a visual to your slide "{slideTitle}"
            {recommendedTab === 'web' && (
              <span className="flex items-center gap-1 mt-1 text-blue-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Real photos recommended for this content</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="generate">AI Generate</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="web" className="relative">
              Web Search
              {recommendedTab === 'web' && (
                <span className="absolute -right-1 -top-1">
                  <AlertCircle className="h-3 w-3 text-blue-500" />
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <AIGenerateTab
              prompt={prompt}
              setPrompt={setPrompt}
              isGenerating={isGenerating}
              progressValue={progressValue}
              handleGenerate={handleGenerate}
            />
          </TabsContent>
          
          <TabsContent value="upload">
            <UploadTab
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              handleUpload={handleUpload}
            />
          </TabsContent>
          
          <TabsContent value="web">
            <WebSearchTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              webImages={webImages}
              selectedWebImage={selectedWebImage}
              setSelectedWebImage={setSelectedWebImage}
              handleSearchImages={handleSearchImages}
              handleUseWebImage={handleUseWebImage}
              apiKeyMissing={apiKeyMissing}
              recommendedTab={recommendedTab}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationDialog;
