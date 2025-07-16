import React from 'react';

interface ImageQualityEnhancerProps {
  imageUrl: string;
  onEnhanced?: (enhancedUrl: string) => void;
  className?: string;
}

export const ImageQualityEnhancer: React.FC<ImageQualityEnhancerProps> = ({ 
  imageUrl, 
  onEnhanced, 
  className = '' 
}) => {
  const [enhancedUrl, setEnhancedUrl] = React.useState<string>('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    if (imageUrl) {
      enhanceImageQuality(imageUrl);
    }
  }, [imageUrl]);

  const enhanceImageQuality = async (url: string) => {
    setIsProcessing(true);
    try {
      // Create a canvas to enhance the image quality
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setEnhancedUrl(url);
        return;
      }

      // Set optimal dimensions for presentation quality
      const targetWidth = Math.max(img.width, 1536);
      const targetHeight = Math.max(img.height, 1024);
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Apply quality enhancements
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw with enhanced filtering
      ctx.filter = 'contrast(1.1) saturate(1.1) brightness(1.05)';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Apply sharpening filter
      const sharpened = await applySharpeningFilter(canvas, ctx);
      
      const enhancedDataUrl = sharpened.toDataURL('image/webp', 0.95);
      setEnhancedUrl(enhancedDataUrl);
      onEnhanced?.(enhancedDataUrl);
      
    } catch (error) {
      console.error('Error enhancing image quality:', error);
      setEnhancedUrl(url); // Fallback to original
      onEnhanced?.(url);
    } finally {
      setIsProcessing(false);
    }
  };

  const applySharpeningFilter = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<HTMLCanvasElement> => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Simple sharpening kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];
    
    const result = new ImageData(width, height);
    const resultData = result.data;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels only
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              sum += data[idx] * kernel[kernelIdx];
            }
          }
          const resultIdx = (y * width + x) * 4 + c;
          resultData[resultIdx] = Math.max(0, Math.min(255, sum));
        }
        // Copy alpha channel
        const alphaIdx = (y * width + x) * 4 + 3;
        resultData[alphaIdx] = data[alphaIdx];
      }
    }
    
    ctx.putImageData(result, 0, 0);
    return canvas;
  };

  if (isProcessing) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Enhancing quality...</p>
        </div>
      </div>
    );
  }

  return enhancedUrl ? (
    <img 
      src={enhancedUrl} 
      alt="Enhanced quality" 
      className={`object-cover transition-all duration-300 ${className}`}
      style={{
        imageRendering: 'auto',
        filter: 'none' // Let our enhancement speak for itself
      }}
      loading="lazy"
    />
  ) : (
    <img 
      src={imageUrl} 
      alt="Original" 
      className={className}
      loading="lazy"
    />
  );
};

export default ImageQualityEnhancer;