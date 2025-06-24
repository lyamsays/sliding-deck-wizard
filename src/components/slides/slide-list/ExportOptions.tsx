
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

  // Enhanced slide element selection for true WYSIWYG exports
  const getSlideElements = (): HTMLElement[] => {
    console.log("Finding slide content for WYSIWYG export...");
    
    // Try multiple selector strategies to find all slide elements
    let slideElements: HTMLElement[] = [];
    
    // Strategy 1: Direct ID lookup for each slide
    for (let i = 0; i < editedSlides.length; i++) {
      const slideContent = document.getElementById(`slide-content-${i}`);
      if (slideContent) {
        slideElements.push(slideContent);
      }
    }
    
    if (slideElements.length === editedSlides.length) {
      console.log(`Found all ${slideElements.length} slides using direct ID lookup`);
      return slideElements;
    }
    
    // Strategy 2: Find content via class name in slide wrappers
    slideElements = [];
    for (let i = 0; i < editedSlides.length; i++) {
      const slideWrapper = document.getElementById(`slide-${i}`);
      if (slideWrapper) {
        const contentElement = slideWrapper.querySelector('.slide-content');
        if (contentElement instanceof HTMLElement) {
          slideElements.push(contentElement);
          continue;
        }
      }
    }
    
    if (slideElements.length === editedSlides.length) {
      console.log(`Found all ${slideElements.length} slides using wrapper class lookup`);
      return slideElements;
    }
    
    // Strategy 3: General container scan
    const slideContainer = document.querySelector('.slides-container, #slides-for-export-container, #slide-grid');
    if (slideContainer) {
      const allSlideContents = Array.from(slideContainer.querySelectorAll('.slide-content, [class*="slide-content"]'));
      if (allSlideContents.length > 0) {
        slideElements = allSlideContents.filter(el => el instanceof HTMLElement) as HTMLElement[];
        console.log(`Found ${slideElements.length} slides via container scan`);
        if (slideElements.length > 0) {
          return slideElements;
        }
      }
    }
    
    // If we still don't have slides, try a broader approach
    const possibleSlides = document.querySelectorAll('.slide, [id^="slide-"], .slide-wrapper');
    if (possibleSlides.length > 0) {
      slideElements = Array.from(possibleSlides)
                          .map(slide => {
                            const content = slide.querySelector('.slide-content') || slide;
                            return content instanceof HTMLElement ? content : null;
                          })
                          .filter(el => el !== null) as HTMLElement[];
      console.log(`Last resort found ${slideElements.length} possible slide elements`);
      return slideElements;
    }
    
    console.warn("No slide elements found for export!");
    return [];
  };
  
  // Improved slide content capture for better WYSIWYG results
  const captureSlideContent = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    console.log("Capturing slide content for WYSIWYG export");
    
    try {
      // Prepare for export - add exporting class to container
      document.body.classList.add('exporting-slides');
      
      // Create a clone for capturing to avoid DOM manipulation issues
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Set specific styles for accurate capture
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '-9999px';
      clone.style.width = '1200px'; // Fixed width for consistent rendering
      clone.style.height = 'auto';
      clone.style.transform = 'none';  // Remove any transforms
      clone.style.transition = 'none'; // Remove transitions
      
      // Clean up UI elements from the clone
      clone.querySelectorAll('.slide-actions, .visual-label, .recommendation-ui, .ui-element, [class*="-control"], button, .edit-button, .slide-ui').forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      
      document.body.appendChild(clone);
      
      // Use html2canvas with optimized settings
      const canvas = await html2canvas(clone, {
        allowTaint: true,
        useCORS: true,
        scale: 3, // Higher quality
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 30000, // Longer timeout for images
        onclone: (clonedDoc) => {
          // Additional UI cleanup in the cloned document
          clonedDoc.querySelectorAll('.slide-actions, .visual-label, .recommendation-ui, .ui-element, [class*="-control"], button, .edit-button, .slide-ui').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
          });
        }
      });
      
      // Clean up
      document.body.removeChild(clone);
      document.body.classList.remove('exporting-slides');
      
      return canvas;
    } catch (error) {
      console.error('Error capturing slide:', error);
      toast({
        title: "Error capturing slide",
        description: "There was a problem capturing the slide content. Try again.",
        variant: "destructive",
      });
      
      // Create a fallback canvas with error message
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 675; // 16:9 ratio
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff0000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Error capturing slide', canvas.width / 2, canvas.height / 2);
      }
      
      document.body.classList.remove('exporting-slides');
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
      
      // Find all slide elements
      const slideElements = getSlideElements();
      
      if (slideElements.length === 0) {
        throw new Error("No slides found to export");
      }
      
      console.log(`Found ${slideElements.length} slides for PDF export`);
      
      // Initialize PDF with 16:9 aspect ratio for presentations
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
      for (let i = 0; i < slideElements.length; i++) {
        // Add new page for all slides except the first
        if (i > 0) {
          pdf.addPage();
        }
        
        // Update progress notification
        toast({
          title: "Exporting PDF",
          description: `Processing slide ${i + 1} of ${slideElements.length}...`,
        });
        
        try {
          // Capture the slide as a canvas
          const canvas = await captureSlideContent(slideElements[i]);
          
          // Convert to image data
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate positioning to fit proportionally
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) * 0.95;
          
          // Center the image on the page
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
          console.error(`Error processing slide ${i + 1}:`, error);
        }
      }
      
      // Save the PDF
      pdf.save(`${deckTitle || 'presentation'}.pdf`);
      
      toast({
        title: "PDF exported successfully",
        description: "Your presentation has been downloaded as a PDF file."
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating PDF:', err);
      toast({
        title: "Export failed",
        description: err.message || "Failed to generate PDF. Please try again.",
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
      
      // Find all slide elements
      const slideElements = getSlideElements();
      
      if (slideElements.length === 0) {
        throw new Error("No slides found to export");
      }
      
      console.log(`Found ${slideElements.length} slides for PPTX export`);
      
      // Create new PptxGenJS instance
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'Sliding.io';
      pptx.company = 'Created with Sliding.io';
      pptx.title = deckTitle || 'Presentation';
      pptx.layout = 'LAYOUT_16x9'; // Standard presentation format
      
      // Process all slides
      for (let i = 0; i < slideElements.length; i++) {
        // Update progress notification
        toast({
          title: "Exporting PPTX",
          description: `Processing slide ${i + 1} of ${slideElements.length}...`,
        });
        
        try {
          // Capture the slide as a canvas
          const canvas = await captureSlideContent(slideElements[i]);
          
          // Convert to image data
          const imgData = canvas.toDataURL('image/png');
          
          // Add slide to presentation
          const slide = pptx.addSlide();
          
          // Add the captured slide as a full slide image
          slide.addImage({
            data: imgData,
            x: 0,
            y: 0,
            w: '100%',
            h: '100%',
            sizing: { type: 'contain', w: '100%', h: '100%' }
          });
          
          console.log(`Added slide ${i + 1} to PPTX`);
        } catch (error) {
          console.error(`Error processing slide ${i + 1}:`, error);
          
          // Add error slide as fallback
          const errorSlide = pptx.addSlide();
          errorSlide.addText(`Error capturing slide ${i + 1}`, {
            x: 1, y: 1, w: '98%', h: 1,
            fontSize: 24, color: 'FF0000',
            align: 'center', valign: 'middle'
          });
        }
      }
      
      // Generate and download the PPTX file
      pptx.writeFile({ fileName: `${deckTitle || 'presentation'}.pptx` });
      
      toast({
        title: "PowerPoint exported successfully",
        description: "Your presentation has been downloaded as a PPTX file."
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating PPTX:', err);
      toast({
        title: "Export failed",
        description: err.message || "Failed to generate PowerPoint. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
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
