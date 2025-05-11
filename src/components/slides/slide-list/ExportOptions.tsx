
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { Slide } from '@/types/deck';
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  editedSlides: Slide[];
  deckTitle: string;
  handleDownloadSlides: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  editedSlides, 
  deckTitle, 
  handleDownloadSlides 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Improved image processing function that handles all image formats safely
  const processImage = async (url: string): Promise<string> => {
    try {
      // If URL is already a data URL, return directly
      if (url.startsWith('data:image')) {
        return url;
      }
      
      console.log(`Processing image from URL: ${url}`);
      
      // For remote URLs, create a new image and convert to canvas to avoid CORS issues
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';  // Important for CORS
        
        img.onload = () => {
          try {
            // Create canvas and draw image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }
            
            // Draw image to canvas and convert to data URL
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } catch (canvasError) {
            console.error('Canvas error:', canvasError);
            reject(canvasError);
          }
        };
        
        img.onerror = (err) => {
          console.error('Image loading error:', err);
          // Return a placeholder instead of rejecting
          resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        };
        
        // Set the source last to avoid race conditions
        img.src = url;
      });
    } catch (error) {
      console.error("Error processing image:", error);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // Return transparent pixel
    }
  };

  // Completely redesigned PDF export with better theme and image handling
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      toast({
        title: "Preparing PDF export",
        description: "Processing slides and images..."
      });
      
      // Initialize PDF with better defaults for presentation slides
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // PDF dimensions
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      // Process all slides sequentially
      for (let i = 0; i < editedSlides.length; i++) {
        console.log(`Processing slide ${i+1} for PDF export`);
        const slide = editedSlides[i];
        
        // Add new page for all slides except the first
        if (i > 0) {
          pdf.addPage();
        }
        
        // Get theme colors from slide
        const backgroundColor = slide.style?.backgroundColor || '#FFFFFF';
        const textColor = slide.style?.textColor || '#333333';
        const accentColor = slide.style?.accentColor || '#6E59A5';
        
        // Set page background (support for gradient backgrounds by using a filled rectangle)
        pdf.setFillColor(255, 255, 255);  // Default white background first
        pdf.rect(0, 0, width, height, 'F');
        
        // Add header with accent color
        pdf.setFillColor(hexToRgb(accentColor).r, hexToRgb(accentColor).g, hexToRgb(accentColor).b);
        pdf.rect(0, 0, width, 12, 'F');
        
        // Add title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor(hexToRgb(textColor).r, hexToRgb(textColor).g, hexToRgb(textColor).b);
        pdf.text(slide.title, width / 2, 25, { align: 'center' });
        
        // Determine layout for content positioning based on slide style
        const layout = slide.style?.layout || 'right-image';
        let textX, textWidth, imgX, imgY, imgWidth, imgHeight;
        
        // Configure layout dimensions based on type
        if (layout === 'left-image') {
          imgX = 20;
          imgY = 40;
          imgWidth = 80;
          imgHeight = 60;
          textX = imgX + imgWidth + 10;
          textWidth = width - textX - 20;
        } else if (layout === 'right-image') {
          textX = 20;
          textWidth = width / 2 - 10;
          imgX = width / 2 + 10;
          imgY = 40;
          imgWidth = 80;
          imgHeight = 60;
        } else if (layout === 'centered') {
          textX = 20;
          textWidth = width - 40;
          imgX = (width - 100) / 2; // Center the image
          imgY = 80; // Place image below text
          imgWidth = 100;
          imgHeight = 60;
        } else {
          // title-focus layout
          textX = 20;
          textWidth = width - 120;
          imgX = width - 80;
          imgY = 40;
          imgWidth = 60;
          imgHeight = 60;
        }
        
        // Add bullets with improved formatting
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(hexToRgb(textColor).r, hexToRgb(textColor).g, hexToRgb(textColor).b);
        
        let y = layout === 'centered' ? 40 : 45;
        for (const bullet of slide.bullets) {
          const bulletText = '• ' + bullet;
          const lines = pdf.splitTextToSize(bulletText, textWidth);
          pdf.text(lines, textX, y);
          y += 8 * lines.length;
        }
        
        // Add image if available
        if (slide.imageUrl) {
          try {
            console.log(`Processing image for PDF slide ${i+1}`);
            
            // Process image to handle CORS and format issues
            const processedImageData = await processImage(slide.imageUrl);
            
            // Add the processed image to PDF
            pdf.addImage(processedImageData, 'PNG', imgX, imgY, imgWidth, imgHeight);
            console.log(`Image added successfully to slide ${i+1}`);
          } catch (imgError) {
            console.error(`Failed to add image to slide ${i+1}:`, imgError);
            // Add placeholder for failed image
            pdf.setFillColor(230, 230, 230);
            pdf.rect(imgX, imgY, imgWidth, imgHeight, 'F');
            pdf.setFontSize(10);
            pdf.setTextColor(120, 120, 120);
            pdf.text("Image not available", imgX + imgWidth/2, imgY + imgHeight/2, { align: 'center' });
          }
        }
        
        // Add slide number and footer with accent color
        pdf.setFillColor(hexToRgb(accentColor).r, hexToRgb(accentColor).g, hexToRgb(accentColor).b, 0.1);
        pdf.rect(0, height - 12, width, 12, 'F');
        
        pdf.setFontSize(10);
        pdf.setTextColor(hexToRgb(textColor).r, hexToRgb(textColor).g, hexToRgb(textColor).b);
        pdf.text(`${i + 1}/${editedSlides.length}`, width - 20, height - 5, { align: 'right' });
        pdf.text(`${deckTitle || 'Presentation'}`, 20, height - 5);
      }
      
      // Save the generated PDF
      pdf.save(`${deckTitle || 'presentation'}.pdf`);
      
      toast({
        title: "PDF exported successfully",
        description: "Your presentation has been downloaded as a PDF file."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Export failed",
        description: "Failed to generate PDF file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Completely redesigned PowerPoint export with better image processing
  const handleExportPPTX = async () => {
    try {
      setIsExporting(true);
      toast({
        title: "Preparing PowerPoint export",
        description: "Processing slides and images..."
      });
      
      // Create new PptxGenJS instance
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'SlideMaker AI';
      pptx.company = 'Created with SlideMaker AI';
      pptx.title = deckTitle || 'Presentation';
      pptx.layout = 'LAYOUT_16x9';
      
      // Process all slides with improved styling
      for (let i = 0; i < editedSlides.length; i++) {
        console.log(`Processing slide ${i+1} for PPTX export`);
        const slide = editedSlides[i];
        
        // Get theme colors from slide
        const backgroundColor = slide.style?.backgroundColor || '#FFFFFF';
        const textColor = slide.style?.textColor || '#333333';
        const accentColor = slide.style?.accentColor || '#6E59A5';
        const layout = slide.style?.layout || 'right-image';
        
        // Create slide with proper background
        const pptSlide = pptx.addSlide();
        
        // Set slide background
        if (backgroundColor.includes('gradient')) {
          // For gradient backgrounds, use a solid color approximation
          pptSlide.background = { color: accentColor + '20' };
        } else {
          pptSlide.background = { color: backgroundColor };
        }
        
        // Add slide number
        pptSlide.addText(`${i + 1}/${editedSlides.length}`, {
          x: '90%', y: '95%',
          color: textColor,
          fontSize: 10,
          bold: false
        });
        
        // Add footer with deck title
        pptSlide.addText(deckTitle || 'Presentation', {
          x: '5%', y: '95%',
          color: textColor,
          fontSize: 10,
          bold: false
        });
        
        // Add title with the slide's text color
        pptSlide.addText(slide.title, {
          x: '5%',
          y: '5%',
          w: '90%',
          h: '10%',
          fontSize: 24,
          bold: true,
          color: textColor
        });
        
        // Set up layout coordinates - convert string percentages to numbers for PptxGenJS
        // PptxGenJS uses numbers from 0-100 for percentages or specific units
        let contentX = 5; // 5%
        let contentY = 20; // 20%
        let contentW = 50; // 50%
        let contentH = 60; // 60%
        let imageX = 60; // 60%
        let imageY = 20; // 20%
        let imageW = 35; // 35%
        let imageH = 60; // 60%
        
        if (layout === 'left-image') {
          imageX = 5;
          imageY = 20;
          imageW = 35;
          imageH = 60;
          contentX = 45;
          contentY = 20;
          contentW = 50;
          contentH = 60;
        } else if (layout === 'right-image') {
          // Default values above are already for right-image
        } else if (layout === 'centered') {
          contentX = 5;
          contentY = 20;
          contentW = 90;
          contentH = 30;
          imageX = 30;
          imageY = 55;
          imageW = 40;
          imageH = 35;
        } else { // title-focus
          contentX = 5;
          contentY = 20;
          contentW = 65;
          contentH = 70;
          imageX = 75;
          imageY = 20;
          imageW = 20;
          imageH = 30;
        }
        
        // Add bullets as separate text elements for better formatting
        if (slide.bullets && slide.bullets.length > 0) {
          slide.bullets.forEach((bullet, idx) => {
            pptSlide.addText(`• ${bullet}`, {
              x: contentX,
              y: contentY + (idx * 8),
              w: contentW,
              color: textColor,
              fontSize: 14,
              bullet: false // We're adding our own bullets
            });
          });
        }
        
        // Add image if available with robust error handling
        if (slide.imageUrl) {
          try {
            console.log(`Processing image for PPTX slide ${i+1}`);
            
            // Process the image through our helper
            const processedImage = await processImage(slide.imageUrl);
            
            // Add the processed image with proper sizing parameters
            pptSlide.addImage({
              data: processedImage,
              x: imageX,
              y: imageY,
              w: imageW,
              h: imageH,
              sizing: {
                type: "contain",
                w: imageW,
                h: imageH
              }
            });
            
            console.log(`Image added successfully to PPTX slide ${i+1}`);
          } catch (err) {
            console.error('Error adding image to PPTX:', err);
            
            // Add a placeholder shape if image fails
            pptSlide.addShape(pptx.ShapeType.rect, {
              x: imageX,
              y: imageY,
              w: imageW,
              h: imageH,
              fill: { color: 'F0F0F0' }
            });
            
            pptSlide.addText('Image placeholder', {
              x: imageX,
              y: imageY + 15,
              w: imageW,
              align: 'center',
              color: '888888'
            });
          }
        }
        
        // Add speaker notes if available
        if (slide.speakerNotes) {
          pptSlide.addNotes(slide.speakerNotes);
        }
      }
      
      // Write file to download
      pptx.writeFile({ fileName: `${deckTitle || 'presentation'}.pptx` });
      
      toast({
        title: "PowerPoint exported successfully",
        description: "Your presentation has been downloaded as a PPTX file."
      });
    } catch (error) {
      console.error('Error generating PPTX:', error);
      toast({
        title: "Export failed",
        description: "Failed to generate PowerPoint file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    // Default fallback color
    if (!hex || hex.includes('gradient')) return { r: 100, g: 100, b: 255 };
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle shorthand hex
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Parse hex values
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-center mt-8 gap-4">
      <Button 
        onClick={handleDownloadSlides}
        className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 btn-enhanced"
        size="lg"
      >
        <Download className="h-5 w-5" />
        <span>Download as Text</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className="flex items-center gap-2 btn-enhanced bg-gradient-purple"
            size="lg"
            disabled={isExporting}
          >
            {isExporting ? <Loader className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            <span>Export Presentation</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPPTX} className="cursor-pointer">
            Export as PowerPoint (.pptx)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExportOptions;
