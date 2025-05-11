import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Upload, ImageIcon, FileImage, X, Search, ExternalLink, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Slide } from '@/types/deck';

interface ImageGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  onUploadImage?: (file: File) => Promise<void>;
  isGenerating: boolean;
  slideTitle: string;
  slide?: Slide;
}

interface WebImage {
  id: string;
  url: string;
  smallUrl: string;
  thumbUrl: string;
  description: string;
  authorName: string;
  authorUsername: string;
  downloadUrl: string;
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
      const slideContent = '';  // Slide type doesn't have content property
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.includes('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setSelectedFile(file);
    }
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
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
      const { data, error } = await supabase.functions.invoke('search-images', {
        body: { searchQuery: searchQuery }
      });
      
      if (error) throw new Error(error.message);
      
      if (data.error) {
        // Check if the error is due to missing API key
        if (data.error.includes('API key is not configured')) {
          setApiKeyMissing(true);
        }
        throw new Error(data.error);
      }
      
      if (data.images && Array.isArray(data.images)) {
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
  
  // Handle selection of a web image
  const handleSelectWebImage = (image: WebImage) => {
    setSelectedWebImage(image);
  };
  
  // Handle use of selected web image
  const handleUseWebImage = async () => {
    if (!selectedWebImage) return;
    
    // Convert the web image to a blob/file
    try {
      const response = await fetch(selectedWebImage.url);
      const blob = await response.blob();
      
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
      toast({
        title: "Failed to use image",
        description: error.message || "Failed to use the selected image. Please try again.",
        variant: "destructive"
      });
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
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Describe the image you would like to generate for this slide:
                </p>
                <Input 
                  placeholder="E.g., 'A professional bar chart showing growth trends'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>
            
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Generating image...</span>
                  <span className="text-sm font-medium">{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            )}
            
            <DialogFooter>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Upload an image from your computer:
                </p>
                
                {!previewUrl ? (
                  <div 
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50 cursor-pointer"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Click to browse or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-md overflow-hidden">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={handleRemovePreview}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-auto object-cover rounded-md"
                      style={{ maxHeight: '200px' }}
                      crossOrigin="anonymous"
                    />
                  </div>
                )}

                {selectedFile && !previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="web" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Search for professional images from Unsplash:
                </p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="E.g., 'business meeting' or 'team collaboration'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSearchImages();
                    }}
                  />
                  <Button 
                    onClick={handleSearchImages}
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    {isSearching ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {isSearching && (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
                
                {apiKeyMissing && (
                  <div className="p-4 mt-2 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5 text-amber-500" />
                      <div>
                        <p className="font-medium">Unsplash API key is missing</p>
                        <p className="text-sm mt-1">
                          The administrator needs to set up the Unsplash API key in the Supabase Edge Function secrets.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isSearching && webImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {webImages.map((image) => (
                      <div 
                        key={image.id}
                        className={`relative rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedWebImage?.id === image.id 
                            ? 'border-primary ring-2 ring-primary/30' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => handleSelectWebImage(image)}
                      >
                        <img 
                          src={image.thumbUrl} 
                          alt={image.description}
                          className="w-full h-24 object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {!isSearching && webImages.length === 0 && searchQuery.trim() !== '' && !apiKeyMissing && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No images found. Try a different search term.</p>
                  </div>
                )}
                
                {selectedWebImage && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Selected image:</p>
                    <div className="flex items-center gap-2">
                      <img 
                        src={selectedWebImage.thumbUrl} 
                        alt={selectedWebImage.description}
                        className="w-16 h-16 object-cover rounded-md"
                        crossOrigin="anonymous"
                      />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-1">{selectedWebImage.description}</p>
                        <p className="text-xs text-gray-500">
                          Photo by {selectedWebImage.authorName} on Unsplash
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <a 
                        href={`https://unsplash.com/@${selectedWebImage.authorUsername}?utm_source=your_app&utm_medium=referral`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 flex items-center hover:underline"
                      >
                        View on Unsplash 
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleUseWebImage}
                disabled={!selectedWebImage}
                className="w-full"
              >
                <FileImage className="h-4 w-4 mr-2" />
                Use Selected Image
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationDialog;
