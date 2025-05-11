
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

  // Enhanced function to find slide elements for export
  // This now targets only the actual slide content, not UI elements
  const getSlideContentElements = (): {element: HTMLElement, slide: Slide}[] => {
    console.log("Looking for slide content to export...");
    
    // First, try to find slide elements by ID
    const slideElements = editedSlides.map((slide, index) => {
      const slideElement = document.getElementById(`slide-${index}`);
      if (!slideElement) return null;
      
      // Find the slide content within the slide (exclude UI elements)
      // Either get specific slide-content-for-export or the StyledSlide/OutlineSlide directly
      const slideContentElement = 
        slideElement.querySelector('.slide-content-for-export') || 
        slideElement;
      
      if (!slideContentElement) return null;
      
      return {
        element: slideContentElement as HTMLElement,
        slide: slide
      };
    }).filter(item => item !== null) as {element: HTMLElement, slide: Slide}[];
    
    if (slideElements.length > 0) {
      console.log(`Found ${slideElements.length} slide content elements to export`);
      return slideElements;
    }
    
    console.warn("No slide content elements found in the DOM!");
    return [];
  };
  
  // Improved capture function to create clean slide images
  const captureSlideContent = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    console.log(`Capturing slide content`);
    
    try {
      // Before capturing, hide any UI elements that shouldn't be in the export
      const uiElementsToHide = element.querySelectorAll('.slide-ui-elements-not-for-export, .recommendation-ui, button, .slide-actions');
      const originalDisplayValues: { element: Element; value: string }[] = [];
      
      // Store original display values and hide elements
      uiElementsToHide.forEach(el => {
        originalDisplayValues.push({
          element: el,
          value: (el as HTMLElement).style.display
        });
        (el as HTMLElement).style.display = 'none';
      });
      
      // Use html2canvas with optimized settings for better quality
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true, // Important for cross-origin images
        scale: 2, // Higher quality
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.offsetWidth || 800,
        windowHeight: element.offsetHeight || 600,
        // Don't include UI elements like recommendation buttons
        ignoreElements: (el) => {
          return el.classList.contains('slide-ui-elements-not-for-export') || 
                 el.classList.contains('recommendation-ui') ||
                 el.tagName === 'BUTTON';
        }
      });
      
      // Restore original display values
      originalDisplayValues.forEach(item => {
        (item.element as HTMLElement).style.display = item.value;
      });
      
      return canvas;
    } catch (error) {
      console.error('Error capturing slide content:', error);
      
      // Create a simple canvas with error message as fallback
      const canvas = document.createElement('canvas');
      canvas.width = element.offsetWidth || 800;
      canvas.height = element.offsetHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.textAlign = 'center';
        ctx.fillText('Error capturing slide', canvas.width / 2, canvas.height / 2);
      }
      return canvas;
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      toast({
        title: "Preparing PDF export",
        description: "Capturing slides for export..."
      });
      
      // Find all slide content elements
      const slideContentItems = getSlideContentElements();
      
      if (slideContentItems.length === 0) {
        throw new Error("No slide content found to export");
      }
      
      console.log(`Found ${slideContentItems.length} slides to export as PDF`);
      
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
      
      // Process all slides
      for (let i = 0; i < slideContentItems.length; i++) {
        // Add new page for all slides except the first
        if (i > 0) {
          pdf.addPage();
        }
        
        // Notify progress
        toast({
          title: "Exporting slides",
          description: `Processing slide ${i + 1} of ${slideContentItems.length}...`,
        });
        
        try {
          // Capture the slide content as a canvas (excluding UI elements)
          const canvas = await captureSlideContent(slideContentItems[i].element);
          
          // Convert to image data
          const imgData = canvas.toDataURL('image/png');
          
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
          
          // Add slide title at bottom as reference if needed
          const slideTitle = slideContentItems[i].slide?.title || `Slide ${i + 1}`;
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(slideTitle, pageWidth - 10, pageHeight - 5, { align: 'right' });
          
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
    } catch (error: any) {
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
        description: "Capturing slides for export..."
      });
      
      // Find all slide content elements
      const slideContentItems = getSlideContentElements();
      
      if (slideContentItems.length === 0) {
        throw new Error("No slide content found to export");
      }
      
      console.log(`Found ${slideContentItems.length} slides to export as PPTX`);
      
      // Create new PptxGenJS instance
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'SlideMaker AI';
      pptx.company = 'Created with SlideMaker AI';
      pptx.title = deckTitle || 'Presentation';
      pptx.layout = 'LAYOUT_16x9';
      
      // Process all slides
      for (let i = 0; i < slideContentItems.length; i++) {
        // Notify progress
        toast({
          title: "Exporting slides",
          description: `Processing slide ${i + 1} of ${slideContentItems.length}...`,
        });
        
        try {
          // Capture the slide content as a canvas (excluding UI elements)
          const canvas = await captureSlideContent(slideContentItems[i].element);
          
          // Convert to image data
          const imgData = canvas.toDataURL('image/png');
          
          // Add slide to presentation
          const pptSlide = pptx.addSlide();
          
          // Add the captured slide as a full slide image
          pptSlide.addImage({
            data: imgData,
            x: 0,
            y: 0,
            w: '100%',
            h: '100%',
          });
          
          // Add slide title and number as notes
          const slideTitle = slideContentItems[i].slide?.title || `Slide ${i + 1}`;
          pptSlide.addNotes(`Title: ${slideTitle}`);
          pptSlide.addNotes(`Slide ${i + 1} of ${slideContentItems.length}`);
          
          // Add speaker notes if available
          if (slideContentItems[i].slide?.speakerNotes) {
            pptSlide.addNotes(`Speaker Notes: ${slideContentItems[i].slide.speakerNotes}`);
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
    } catch (error: any) {
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
