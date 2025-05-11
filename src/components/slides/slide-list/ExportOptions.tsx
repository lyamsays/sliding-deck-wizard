
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

  // Improved helper function to convert image URLs to base64 format
  const getBase64FromUrl = async (url: string): Promise<string> => {
    try {
      // If URL is already base64, return it as is
      if (url.startsWith('data:image')) {
        return url;
      }
      
      // For external URLs, use a proxy or direct fetch when possible
      const response = await fetch(url, { 
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return ''; // Return empty string on error rather than throwing
    }
  };

  // Improved PDF export with better image handling
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
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
        if (slide.style?.backgroundColor) {
          // For gradient backgrounds, use a light color
          pdf.setFillColor(240, 240, 245);
          pdf.rect(0, 0, width, height, 'F');
        } else {
          pdf.setFillColor('#ffffff');
          pdf.rect(0, 0, width, height, 'F');
        }
        
        // Add slide title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.setTextColor('#000000');
        pdf.text(slide.title, width / 2, 20, { align: 'center' });
        
        // Add slide content
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(14);
        
        // Determine layout for content positioning
        const layout = slide.style?.layout || 'right-image';
        let textX, textWidth;
        
        if (layout === 'left-image') {
          textX = width / 2;
          textWidth = width / 2 - 10;
        } else if (layout === 'right-image') {
          textX = 20;
          textWidth = width / 2 - 10;
        } else {
          // Centered or title-focus layout
          textX = 20;
          textWidth = width - 40;
        }
        
        // Add bullets with better positioning based on layout
        let y = 35;
        for (const bullet of slide.bullets) {
          pdf.text('• ' + bullet, textX, y, { maxWidth: textWidth });
          y += 10;
        }
        
        // Add image if available
        if (slide.imageUrl) {
          try {
            // Convert image URL to base64
            const imgData = await getBase64FromUrl(slide.imageUrl);
            
            if (imgData) {
              const imgWidth = 60;
              const imgHeight = 60;
              let imgX;
              
              if (layout === 'left-image') {
                imgX = 20;
              } else if (layout === 'right-image') {
                imgX = width - imgWidth - 20;
              } else if (layout === 'centered') {
                imgX = (width - imgWidth) / 2;
              } else {
                imgX = width - imgWidth - 20;
              }
              
              pdf.addImage(imgData, 'JPEG', imgX, height - imgHeight - 20, imgWidth, imgHeight);
            }
          } catch (err) {
            console.error('Error adding image to PDF:', err);
          }
        }
        
        // Add slide number
        pdf.setFontSize(10);
        pdf.text(`Slide ${i + 1}/${editedSlides.length}`, width - 20, height - 10, { align: 'right' });
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

  // Improved PowerPoint export with better image handling
  const handleExportPPTX = async () => {
    try {
      setIsExporting(true);
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'SlideMaker AI';
      pptx.title = deckTitle || 'Presentation';
      
      // Process all slides
      for (let i = 0; i < editedSlides.length; i++) {
        const slide = editedSlides[i];
        const layout = slide.style?.layout || 'right-image';
        
        // Create slide
        const pptSlide = pptx.addSlide();
        
        // Set slide background - using a consistent professional background
        pptSlide.background = { color: "F1F5F9" };
        
        // Add slide title
        pptSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: 0.8,
          fontSize: 24,
          bold: true,
          align: 'left',
          color: '000000'
        });
        
        // Determine content layout based on image position
        let contentX, contentWidth, imageX, imageY, imageWidth;
        
        if (layout === 'left-image') {
          imageX = 0.5;
          imageY = 1.5;
          imageWidth = 4;
          contentX = 5;
          contentWidth = 4.5;
        } else if (layout === 'right-image') {
          contentX = 0.5;
          contentWidth = 4.5;
          imageX = 5.5;
          imageY = 1.5;
          imageWidth = 4;
        } else if (layout === 'centered') {
          contentX = 0.5;
          contentWidth = 9;
          imageX = 3;
          imageY = 4.5;
          imageWidth = 4;
        } else {
          // title-focus layout
          contentX = 0.5;
          contentWidth = 9;
          imageX = 7;
          imageY = 1.5;
          imageWidth = 2.5;
        }
        
        // Add bullets with improved formatting
        const bulletPoints = slide.bullets.map(bullet => ({ text: bullet }));
        
        pptSlide.addText(bulletPoints, {
          x: contentX,
          y: 1.5,
          w: contentWidth,
          h: 4,
          fontSize: 16,
          color: '000000',
          bullet: { type: 'bullet' }
        });
        
        // Add image if available with improved error handling
        if (slide.imageUrl) {
          try {
            // Convert image URL to base64
            const base64Image = await getBase64FromUrl(slide.imageUrl);
            
            if (base64Image) {
              pptSlide.addImage({
                data: base64Image,
                x: imageX,
                y: imageY,
                w: imageWidth,
                h: 3
              });
            } else {
              throw new Error('Image data is empty');
            }
          } catch (err) {
            console.error('Error adding image to PPTX:', err);
            
            // If image fails, add a placeholder with icon
            pptSlide.addShape(pptx.ShapeType.rect, {
              x: imageX,
              y: imageY,
              w: imageWidth,
              h: 3,
              fill: { color: 'F2F2F2' }
            });
            
            // Add icon suggestion as text
            if (slide.style?.iconType) {
              pptSlide.addText(slide.style.iconType, {
                x: imageX,
                y: imageY + 1,
                w: imageWidth,
                h: 1,
                fontSize: 12,
                color: '666666',
                align: 'center',
                valign: 'middle'
              });
            }
          }
        } else if (slide.style?.iconType) {
          // Add a placeholder with icon type text
          pptSlide.addShape(pptx.ShapeType.rect, {
            x: imageX,
            y: imageY,
            w: imageWidth,
            h: 3,
            fill: { color: 'F2F2F2' }
          });
          
          pptSlide.addText(slide.style.iconType, {
            x: imageX,
            y: imageY + 1,
            w: imageWidth,
            h: 1,
            fontSize: 12,
            color: '666666',
            align: 'center',
            valign: 'middle'
          });
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
