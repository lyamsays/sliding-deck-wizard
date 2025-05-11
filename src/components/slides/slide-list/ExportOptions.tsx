
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
  const getSlideElements = (): HTMLElement[] => {
    console.log("Looking for slide content to export...");
    
    // Method 1: Find by slide IDs directly
    const slideElements: HTMLElement[] = [];
    for (let i = 0; i < editedSlides.length; i++) {
      const slideWrapper = document.getElementById(`slide-${i}`);
      if (slideWrapper) {
        // Get the content part that should be exported (without UI elements)
        const slideContent = slideWrapper.querySelector('.slide-content-for-export') as HTMLElement;
        if (slideContent) {
          slideElements.push(slideContent);
          continue;
        }
      }
    }
    
    if (slideElements.length > 0) {
      console.log(`Found ${slideElements.length} slide content elements to export`);
      return slideElements;
    }
    
    // Fallback method: Get all slides from container
    const slideContainer = document.getElementById('slides-for-export-container');
    if (slideContainer) {
      const contentElements = Array.from(slideContainer.querySelectorAll('.slide-content-for-export')) as HTMLElement[];
      if (contentElements.length > 0) {
        console.log(`Found ${contentElements.length} slide content elements via container`);
        return contentElements;
      }
    }
    
    console.warn("No slide content elements found in the DOM!");
    return [];
  };
  
  // Improved capture function to create clean slide images
  const captureSlideContent = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    console.log(`Capturing slide content`);
    
    try {
      // Before capturing, hide UI elements that shouldn't be in the export
      const uiElements = element.querySelectorAll('.slide-ui-elements-not-for-export, .recommendation-ui, .slide-actions');
      const visualLabels = element.querySelectorAll('[class*="visual-label"]');
      
      // Store original states to restore later
      const originalDisplayStates: { element: HTMLElement, display: string }[] = [];
      
      // Hide UI elements
      uiElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        originalDisplayStates.push({ element: htmlEl, display: htmlEl.style.display });
        htmlEl.style.display = 'none';
      });
      
      // Hide visual labels
      visualLabels.forEach(el => {
        const htmlEl = el as HTMLElement;
        originalDisplayStates.push({ element: htmlEl, display: htmlEl.style.display });
        htmlEl.style.display = 'none';
      });
      
      // Create a temporary clone for capture to prevent DOM manipulation issues
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);
      
      // Remove any unwanted elements from the clone
      clone.querySelectorAll('.slide-ui-elements-not-for-export, .recommendation-ui, .slide-actions').forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      
      // Remove visual labels from clone
      clone.querySelectorAll('[class*="visual-label"]').forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      
      // Use html2canvas with optimized settings for better quality
      const canvas = await html2canvas(clone, {
        allowTaint: true,
        useCORS: true, 
        scale: 3, // Higher quality
        backgroundColor: null,
        logging: false,
        imageTimeout: 15000, // Longer timeout for images
        removeContainer: true // Clean up the container it creates
      });
      
      // Clean up
      document.body.removeChild(clone);
      
      // Restore original display states
      originalDisplayStates.forEach(state => {
        state.element.style.display = state.display;
      });
      
      return canvas;
    } catch (error) {
      console.error('Error capturing slide content:', error);
      toast({
        title: "Error capturing slide",
        description: "There was a problem capturing the slide content. Try again.",
        variant: "destructive",
      });
      
      // Create a simple canvas with error message as fallback
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 450;
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
      
      // Find all slide elements
      const slideElements = getSlideElements();
      
      if (slideElements.length === 0) {
        throw new Error("No slides found to export");
      }
      
      console.log(`Found ${slideElements.length} slides to export as PDF`);
      
      // Initialize PDF with presentation formatting (16:9 aspect ratio)
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
        
        // Notify progress
        toast({
          title: "Exporting PDF",
          description: `Processing slide ${i + 1} of ${slideElements.length}...`,
        });
        
        try {
          // Capture the slide content as a canvas
          const canvas = await captureSlideContent(slideElements[i]);
          
          // Convert to image data
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate positioning to fit the slide proportionally
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) * 0.95; // 95% of page size
          
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
        description: error.message || "Failed to generate PDF. Please try again.",
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
      
      console.log(`Found ${slideElements.length} slides to export as PPTX`);
      
      // Create new PptxGenJS instance with correct 16:9 aspect ratio
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'SlideMaker AI';
      pptx.company = 'Created with SlideMaker AI';
      pptx.title = deckTitle || 'Presentation';
      pptx.layout = 'LAYOUT_16x9';
      
      // Process all slides
      for (let i = 0; i < slideElements.length; i++) {
        // Notify progress
        toast({
          title: "Exporting PPTX",
          description: `Processing slide ${i + 1} of ${slideElements.length}...`,
        });
        
        try {
          // Capture the slide content as a canvas
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
          
          // Add error slide
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
      
      // Write PPTX file
      pptx.writeFile({ fileName: `${deckTitle || 'presentation'}.pptx` });
      
      toast({
        title: "PowerPoint exported successfully",
        description: "Your presentation has been downloaded as a PPTX file."
      });
    } catch (error: any) {
      console.error('Error generating PPTX:', error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to generate PowerPoint. Please try again.",
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
