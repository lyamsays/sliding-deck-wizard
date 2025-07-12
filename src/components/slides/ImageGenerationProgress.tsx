
import React from 'react';

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
      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${imageProgress}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          🎨 Generating professional images...
        </p>
        <span className="text-sm font-medium text-primary">
          {Math.round(imageProgress)}%
        </span>
      </div>
    </div>
  );
};

export default ImageGenerationProgress;
