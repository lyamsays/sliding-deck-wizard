
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ImageGenerationProgressProps {
  isGeneratingImages: boolean;
  imageProgress: number;
}

const ImageGenerationProgress: React.FC<ImageGenerationProgressProps> = ({ 
  isGeneratingImages, 
  imageProgress 
}) => {
  if (!isGeneratingImages) {
    return null;
  }
  
  return (
    <div className="w-full mt-2 space-y-2">
      <Progress value={imageProgress} className="h-2 w-full bg-secondary/30" />
      <p className="text-sm text-center text-gray-500 italic">
        Generating images for your slides... {Math.round(imageProgress)}%
      </p>
    </div>
  );
};

export default ImageGenerationProgress;
