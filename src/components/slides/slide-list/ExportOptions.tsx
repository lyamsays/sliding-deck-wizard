
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

  // Enhanced helper function to convert image URLs to base64 format
  const getBase64FromUrl = async (url: string): Promise<string> => {
    try {
      // If URL is already base64, return it as is
      if (url.startsWith('data:image')) {
        return url;
      }
      
      // For external URLs, fetch the image
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      throw error;
    }
  };

  // Improved PDF export with better image handling
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      // Import fonts for better text rendering
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true,
      });
      
      // Add professional looking fonts
      pdf.setFont("helvetica");
      
      // PDF dimensions
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      // Process all slides sequentially
      for (let i = 0; i < editedSlides.length; i++) {
        const slide = editedSlides[i];
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add slide background color
        pdf.setFillColor(245, 248, 252);
        pdf.rect(0, 0, width, height, 'F');
        
        // Add slide title with enhanced formatting
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(26);
        pdf.setTextColor('#1a365d');
        pdf.text(slide.title, width / 2, 20, { align: 'center' });
        
        // Determine layout for content positioning
        const layout = slide.style?.layout || 'right-image';
        let textX, textWidth, imgX, imgWidth = 70, imgHeight = 50;
        
        if (layout === 'left-image') {
          imgX = 20;
          textX = width / 2 + 5;
          textWidth = width / 2 - 25;
        } else if (layout === 'right-image') {
          textX = 20;
          textWidth = width / 2 - 25;
          imgX = width / 2 + 10;
        } else if (layout === 'centered') {
          textX = 20;
          textWidth = width - 40;
          imgX = (width - imgWidth) / 2;
        } else {
          // title-focus layout
          textX = 20;
          textWidth = width - 40;
          imgX = width - imgWidth - 20;
        }
        
        // Add bullets with better formatting and positioning
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor('#333333');
        
        let y = 40; // Start bullets further down
        for (const bullet of slide.bullets) {
          const bulletText = '• ' + bullet;
          const lines = pdf.splitTextToSize(bulletText, textWidth);
          pdf.text(lines, textX, y);
          y += 8 * lines.length;
        }
        
        // Add image with proper error handling and loading
        if (slide.imageUrl) {
          try {
            console.log(`Processing image for slide ${i+1}: ${slide.imageUrl.substring(0, 50)}...`);
            
            // Handle image conversion with proper error handling
            let imgData;
            try {
              imgData = await getBase64FromUrl(slide.imageUrl);
            } catch(imgError) {
              console.error(`Failed to load image for slide ${i+1}:`, imgError);
              continue;
            }
            
            if (imgData) {
              console.log(`Successfully converted image to base64 for slide ${i+1}`);
              // For centered layout, place image below text
              if (layout === 'centered') {
                pdf.addImage(imgData, 'JPEG', imgX, y + 10, imgWidth, imgHeight);
              } else {
                // For other layouts, place image to the side
                pdf.addImage(imgData, 'JPEG', imgX, 40, imgWidth, imgHeight);
              }
            }
          } catch (err) {
            console.error(`Error adding image to PDF for slide ${i+1}:`, err);
          }
        }
        
        // Add slide number
        pdf.setFontSize(10);
        pdf.setTextColor('#666666');
        pdf.text(`${i + 1}/${editedSlides.length}`, width - 20, height - 10, { align: 'right' });
        
        // Add footer with deck title
        pdf.setFontSize(8);
        pdf.text(`${deckTitle || 'Presentation'}`, 20, height - 10);
      }
      
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

  // Improved PowerPoint export with better image handling and formatting
  const handleExportPPTX = async () => {
    try {
      setIsExporting(true);
      const pptx = new PptxGenJS();
      
      // Set presentation properties and improved default styling
      pptx.author = 'SlideMaker AI';
      pptx.company = 'Created with SlideMaker AI';
      pptx.title = deckTitle || 'Presentation';
      
      // Set the master slide with consistent professional styling
      pptx.defineSlideMaster({
        title: 'MASTER_SLIDE',
        background: { color: "F5F8FC" },
        objects: [
          { 'rect': { x: 0, y: 0, w: '100%', h: '100%', fill: { color: "F5F8FC" } } },
          { 'text': { 
            text: deckTitle || 'Presentation', 
            options: { x: 0.5, y: 6.8, w: '100%', align: 'left', fontSize: 10, color: '666666' } 
          }}
        ]
      });
      
      // Process all slides with improved styling
      for (let i = 0; i < editedSlides.length; i++) {
        const slide = editedSlides[i];
        const layout = slide.style?.layout || 'right-image';
        
        // Create slide using master
        const pptSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        
        // Add slide number to bottom right
        pptSlide.addText(`${i + 1}/${editedSlides.length}`, {
          x: 9.5, y: 6.8, w: 0.5, h: 0.3, fontSize: 10, color: '666666', align: 'right'
        });
        
        // Add slide title with improved styling
        pptSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: 9.0,
          h: 0.8,
          fontSize: 28,
          bold: true,
          color: '1a365d',
          fontFace: 'Arial'
        });
        
        // Determine content layout based on image position
        let contentX, contentWidth, imageX, imageY, imageWidth, imageHeight;
        
        if (layout === 'left-image') {
          imageX = 0.5;
          imageY = 1.5;
          imageWidth = 4;
          imageHeight = 3;
          contentX = 5;
          contentWidth = 4.5;
        } else if (layout === 'right-image') {
          contentX = 0.5;
          contentWidth = 4.5;
          imageX = 5.5;
          imageY = 1.5;
          imageWidth = 4;
          imageHeight = 3;
        } else if (layout === 'centered') {
          contentX = 0.5;
          contentWidth = 9;
          imageX = 3;
          imageY = 3.5;
          imageWidth = 4;
          imageHeight = 2.5;
        } else {
          // title-focus layout
          contentX = 0.5;
          contentWidth = 9;
          imageX = 7;
          imageY = 1.5;
          imageWidth = 2.5;
          imageHeight = 2;
        }
        
        // Add bullets with improved formatting
        const bulletPoints = slide.bullets.map(bullet => ({ text: bullet }));
        
        pptSlide.addText(bulletPoints, {
          x: contentX,
          y: 1.5,
          w: contentWidth,
          h: layout === 'centered' ? 1.8 : 4,
          fontSize: 16,
          color: '333333',
          bullet: { type: 'bullet' },
          fontFace: 'Arial',
          lineSpacing: 28
        });
        
        // Add image with improved error handling
        if (slide.imageUrl) {
          try {
            console.log(`Processing image for PPTX slide ${i+1}: ${slide.imageUrl.substring(0, 50)}...`);
            
            // Convert image URL to base64
            let base64Image;
            try {
              base64Image = await getBase64FromUrl(slide.imageUrl);
              console.log(`Successfully converted image to base64 for PPTX slide ${i+1}`);
            } catch(imgError) {
              console.error(`Failed to load image for PPTX slide ${i+1}:`, imgError);
              throw imgError;
            }
            
            if (base64Image) {
              pptSlide.addImage({
                data: base64Image,
                x: imageX,
                y: imageY,
                w: imageWidth,
                h: imageHeight,
                sizing: { type: 'contain', w: imageWidth, h: imageHeight }
              });
            }
          } catch (err) {
            console.error('Error adding image to PPTX:', err);
            
            // If image fails, add a placeholder text
            pptSlide.addShape(pptx.ShapeType.rect, {
              x: imageX,
              y: imageY,
              w: imageWidth,
              h: imageHeight,
              fill: { color: 'F0F0F0' }
            });
            
            pptSlide.addText('Image placeholder', {
              x: imageX,
              y: imageY + imageHeight/2 - 0.5,
              w: imageWidth,
              h: 1,
              fontSize: 14,
              color: '888888',
              align: 'center',
              fontFace: 'Arial'
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
