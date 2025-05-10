
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

      for (let i = 0; i < editedSlides.length; i++) {
        const slide = editedSlides[i];
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add slide background color
        if (slide.style?.backgroundColor) {
          pdf.setFillColor(slide.style.backgroundColor);
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
        let y = 35;
        
        for (const bullet of slide.bullets) {
          pdf.text('• ' + bullet, 20, y, { maxWidth: width - 40 });
          y += 10;
        }
        
        // Add image if available
        if (slide.imageUrl) {
          try {
            const layout = slide.style?.layout || 'right-image';
            const imgData = slide.imageUrl;
            const imgWidth = 60;
            const imgHeight = 60;
            const imgX = layout === 'left-image' ? 20 : width - imgWidth - 20;
            
            pdf.addImage(imgData, 'JPEG', imgX, height - imgHeight - 20, imgWidth, imgHeight);
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

  const handleExportPPTX = async () => {
    try {
      setIsExporting(true);
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'SlideMaker AI';
      pptx.title = deckTitle || 'Presentation';
      
      for (const slide of editedSlides) {
        const layout = slide.style?.layout || 'right-image';
        const bgColor = slide.style?.backgroundColor || '#ffffff';
        
        // Create slide
        const pptSlide = pptx.addSlide();
        
        // Set slide background
        pptSlide.background = { fill: bgColor };
        
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
        } else {
          // right-image or default
          contentX = 0.5;
          contentWidth = 4.5;
          imageX = 5.5;
          imageY = 1.5;
          imageWidth = 4;
        }
        
        // Add bullets
        const bulletPoints = slide.bullets.map(bullet => ({ text: bullet }));
        
        pptSlide.addText(bulletPoints, {
          x: contentX,
          y: 1.5,
          w: contentWidth,
          h: 4,
          fontSize: 14,
          color: '000000',
          bullet: { type: 'bullet' }
        });
        
        // Add image if available
        if (slide.imageUrl) {
          try {
            pptSlide.addImage({
              data: slide.imageUrl,
              x: imageX,
              y: imageY,
              w: imageWidth,
              h: 3
            });
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
      
      pptx.writeFile({ fileName: `${deckTitle || 'presentation'}.pptx` });
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
