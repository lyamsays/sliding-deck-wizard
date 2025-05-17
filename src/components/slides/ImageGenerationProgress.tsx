
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
      <div className="h-2 w-full bg-gray-200 rounded">
        <div 
          className="h-2 bg-blue-600 rounded" 
          style={{ width: `${imageProgress}%` }}
        ></div>
      </div>
      <p className="text-sm text-center text-gray-500 italic">
        Generating images for your slides... {Math.round(imageProgress)}%
      </p>
    </div>
  );
};

export default ImageGenerationProgress;
