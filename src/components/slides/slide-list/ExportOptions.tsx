
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
import html2canvas from 'html2canvas';
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

  // Get DOM element for a slide by its ID
  const getSlideElement = (index: number): HTMLElement | null => {
    const slideElement = document.getElementById(`slide-${index}`);
    if (!slideElement) {
      console.error(`Could not find slide element with ID slide-${index}`);
    }
    return slideElement;
  };
  
  // Capture a DOM element as canvas
  const captureElement = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      scale: 2, // Higher quality
      logging: false,
      backgroundColor: null,
      onclone: (clonedDoc) => {
        // Find and fix any elements that might cause issues
        const clonedElement = clonedDoc.getElementById(element.id);
        if (clonedElement) {
          // Make sure all images use crossOrigin to avoid tainted canvas
          const images = clonedElement.querySelectorAll('img');
          images.forEach(img => {
            img.crossOrigin = 'anonymous';
          });
        }
      }
    });
    return canvas;
  };

  // Convert canvas to base64 image data
  const canvasToImageData = (canvas: HTMLCanvasElement): string => {
    return canvas.toDataURL('image/png');
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      toast({
        title: "Preparing PDF export",
        description: "Capturing slides from preview..."
      });
      
      // Initialize PDF with presentation formatting
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // Get PDF dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Process all slides by capturing actual DOM elements
      for (let i = 0; i < editedSlides.length; i++) {
        // Add new page for all slides except the first
        if (i > 0) {
          pdf.addPage();
        }
        
        // Notify progress
        toast({
          title: "Exporting slides",
          description: `Processing slide ${i + 1} of ${editedSlides.length}...`,
        });
        
        // Find the slide element in the DOM
        const slideElement = getSlideElement(i);
        if (!slideElement) {
          console.error(`Could not find slide ${i} in the DOM`);
          continue;
        }
        
        try {
          // Capture the slide as a canvas
          const canvas = await captureElement(slideElement);
          
          // Convert to image data
          const imgData = canvasToImageData(canvas);
          
          // Calculate positioning to fit the slide properly on the page
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
          const centerX = (pageWidth - imgWidth * ratio) / 2;
          const centerY = (pageHeight - imgHeight * ratio) / 2;
          
          // Add the image to PDF
          pdf.addImage(
            imgData,
            'PNG',
            centerX,
            centerY,
            imgWidth * ratio,
            imgHeight * ratio
          );
          
          console.log(`Added slide ${i + 1} to PDF`);
          
        } catch (error) {
          console.error(`Error capturing slide ${i}:`, error);
          // Add error message to PDF
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.setTextColor(255, 0, 0);
          pdf.text(`Error rendering slide ${i + 1}`, pageWidth / 2, pageHeight / 2, { align: 'center' });
        }
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
        description: `Failed to generate PDF: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPTX = async () => {
    try {
      setIsExporting(true);
      toast({
        title: "Preparing PowerPoint export",
        description: "Capturing slides from preview..."
      });
      
      // Create new PptxGenJS instance
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'SlideMaker AI';
      pptx.company = 'Created with SlideMaker AI';
      pptx.title = deckTitle || 'Presentation';
      pptx.layout = 'LAYOUT_16x9';
      
      // Process all slides by capturing actual DOM elements
      for (let i = 0; i < editedSlides.length; i++) {
        // Notify progress
        toast({
          title: "Exporting slides",
          description: `Processing slide ${i + 1} of ${editedSlides.length}...`,
        });
        
        // Find the slide element in the DOM
        const slideElement = getSlideElement(i);
        if (!slideElement) {
          console.error(`Could not find slide ${i} in the DOM`);
          continue;
        }
        
        try {
          // Capture the slide as a canvas
          const canvas = await captureElement(slideElement);
          
          // Convert to image data
          const imgData = canvasToImageData(canvas);
          
          // Calculate slide dimensions and aspect ratio
          const slide = pptx.addSlide();
          
          // Add the captured slide as a full slide background image
          slide.addImage({
            data: imgData,
            x: 0,
            y: 0,
            w: '100%',
            h: '100%',
            sizing: {
              type: 'contain',
              w: '100%',
              h: '100%'
            }
          });
          
          // Add slide title as alt text for accessibility
          const slideTitle = editedSlides[i]?.title || `Slide ${i + 1}`;
          slide.addNotes(`Title: ${slideTitle}`);
          
          // Add speaker notes if available
          if (editedSlides[i]?.speakerNotes) {
            slide.addNotes(editedSlides[i].speakerNotes);
          }
          
          console.log(`Added slide ${i + 1} to PPTX`);
          
        } catch (error) {
          console.error(`Error capturing slide ${i}:`, error);
          
          // Create an error slide
          const errorSlide = pptx.addSlide();
          errorSlide.addText(`Error rendering slide ${i + 1}`, {
            x: 1,
            y: 1,
            w: '98%',
            h: 1,
            fontSize: 24,
            color: 'FF0000',
            align: 'center',
            valign: 'middle'
          });
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
        description: `Failed to generate PowerPoint: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Helper function to convert hex color to RGB (reused from original)
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
