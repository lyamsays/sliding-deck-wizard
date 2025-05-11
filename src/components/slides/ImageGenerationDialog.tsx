
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  onUploadImage?: (file: File) => Promise<void>;
  isGenerating: boolean;
  slideTitle: string;
}

const ImageGenerationDialog: React.FC<ImageGenerationDialogProps> = ({
  open,
  onOpenChange,
  onGenerateImage,
  onUploadImage,
  isGenerating,
  slideTitle
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('generate');
  const { toast } = useToast();

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
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUploadImage) return;
    
    try {
      await onUploadImage(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Image to Slide</DialogTitle>
          <DialogDescription>
            Add a visual to your slide "{slideTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="generate">AI Generate</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
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
                  "Generate Image"
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
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Click to browse or drag and drop</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
                {selectedFile && (
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
                Upload Image
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationDialog;
