
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Crop, Move, Resize, Save } from 'lucide-react';
import { Label } from "@/components/ui/label";

interface ImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onSave: (editedImageData: string, cropData: CropData) => void;
}

interface Position {
  x: number;
  y: number;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ open, onOpenChange, imageUrl, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<'move' | 'crop' | 'resize'>('move');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [cropRect, setCropRect] = useState<CropData>({ x: 0, y: 0, width: 0, height: 0, scale: 1 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load the image when the component mounts or imageUrl changes
  useEffect(() => {
    if (!open || !imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });
      imageRef.current = img;
      resetEditor();
      setIsLoaded(true);
      drawCanvas();
    };
    img.src = imageUrl;
  }, [open, imageUrl]);

  const resetEditor = () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    // Reset the canvas size to match container
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      canvas.width = containerWidth;
      canvas.height = containerWidth * (img.height / img.width);
    }
    
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCropRect({ 
      x: 0, 
      y: 0, 
      width: canvas.width, 
      height: canvas.height,
      scale: 1
    });
  };

  // Draw the image on the canvas
  const drawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image with position and scale
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(
      imageRef.current, 
      0, 
      0, 
      imageRef.current.width, 
      imageRef.current.height
    );
    ctx.restore();
    
    // Draw crop overlay if in crop mode
    if (tool === 'crop') {
      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Clear the crop area
      ctx.clearRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
      
      // Draw crop border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
      
      // Draw resize handles
      const handleSize = 8;
      ctx.fillStyle = '#ffffff';
      
      // Corner handles
      ctx.fillRect(cropRect.x - handleSize/2, cropRect.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropRect.x + cropRect.width - handleSize/2, cropRect.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropRect.x - handleSize/2, cropRect.y + cropRect.height - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropRect.x + cropRect.width - handleSize/2, cropRect.y + cropRect.height - handleSize/2, handleSize, handleSize);
    }
  };

  // Handle mouse events for dragging the image or crop rectangle
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    if (tool === 'move') {
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    } else if (tool === 'crop') {
      // Move crop rectangle
      setCropRect(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    } else if (tool === 'resize') {
      // Calculate new scale based on drag
      const scaleFactor = 1 + (deltaY > 0 ? -0.01 : 0.01);
      setScale(prev => Math.max(0.1, Math.min(3, prev * scaleFactor)));
    }
    
    setDragStart({ x, y });
    drawCanvas();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create a temporary canvas for the cropped area
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // If in crop mode, use the crop rectangle, otherwise use the full canvas
    if (tool === 'crop') {
      tempCanvas.width = cropRect.width;
      tempCanvas.height = cropRect.height;
      
      // Draw only the cropped section to the temp canvas
      tempCtx.drawImage(
        canvas,
        cropRect.x, cropRect.y, cropRect.width, cropRect.height,
        0, 0, cropRect.width, cropRect.height
      );
    } else {
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);
    }
    
    // Convert to data URL
    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.9);
    
    // Save the edited image
    onSave(dataUrl, {
      ...cropRect,
      scale: scale
    });
    onOpenChange(false);
  };

  // Set the crop rectangle to create a square crop
  const handleSetSquareCrop = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const size = Math.min(canvas.width, canvas.height) * 0.8;
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / 2;
    
    setCropRect({
      x, y, width: size, height: size, scale: scale
    });
    
    drawCanvas();
  };

  // Set the crop rectangle to match original image's aspect ratio
  const handleSetOriginalRatioCrop = () => {
    if (!canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    const ratio = img.width / img.height;
    let width = canvas.width * 0.8;
    let height = width / ratio;
    
    if (height > canvas.height * 0.8) {
      height = canvas.height * 0.8;
      width = height * ratio;
    }
    
    setCropRect({
      x: (canvas.width - width) / 2,
      y: (canvas.height - height) / 2,
      width,
      height,
      scale: scale
    });
    
    drawCanvas();
  };

  // Handle slider changes for scale
  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
    drawCanvas();
  };

  // Effect to update canvas when tool or scale changes
  useEffect(() => {
    drawCanvas();
  }, [tool, scale]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-center space-x-2 mb-4">
            <Button 
              variant={tool === 'move' ? 'default' : 'outline'} 
              onClick={() => setTool('move')}
              size="sm"
              className="flex items-center gap-1"
            >
              <Move className="h-4 w-4" />
              <span>Move</span>
            </Button>
            <Button 
              variant={tool === 'crop' ? 'default' : 'outline'} 
              onClick={() => setTool('crop')}
              size="sm"
              className="flex items-center gap-1"
            >
              <Crop className="h-4 w-4" />
              <span>Crop</span>
            </Button>
            <Button 
              variant={tool === 'resize' ? 'default' : 'outline'} 
              onClick={() => setTool('resize')}
              size="sm"
              className="flex items-center gap-1"
            >
              <Resize className="h-4 w-4" />
              <span>Resize</span>
            </Button>
          </div>
          
          {tool === 'crop' && (
            <div className="flex justify-center gap-2 mb-3">
              <Button variant="outline" size="sm" onClick={handleSetSquareCrop}>
                Square Crop
              </Button>
              <Button variant="outline" size="sm" onClick={handleSetOriginalRatioCrop}>
                Original Ratio
              </Button>
            </div>
          )}
          
          {tool === 'resize' && (
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="scale-slider">Resize (Scale: {scale.toFixed(2)}x)</Label>
              <Slider 
                id="scale-slider"
                defaultValue={[1]}
                min={0.1} 
                max={3} 
                step={0.01} 
                value={[scale]} 
                onValueChange={handleScaleChange}
              />
            </div>
          )}
          
          <div 
            className="border rounded-lg overflow-hidden relative" 
            ref={containerRef}
            style={{ height: '400px', display: 'flex', justifyContent: 'center' }}
          >
            {!isLoaded && <div className="absolute inset-0 flex items-center justify-center">Loading image...</div>}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-move max-w-full max-h-full"
              style={{ display: isLoaded ? 'block' : 'none' }}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
