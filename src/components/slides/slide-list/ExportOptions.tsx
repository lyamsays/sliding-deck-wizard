
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
      
      // For external URLs, fetch the image
      const response = await fetch(url, { 
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
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
      throw error;
    }
  };

  // Improved PDF export with better image handling and font embedding
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      // Initialize PDF with better defaults for presentation slides
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true,
        hotfixes: ['px_scaling'], // Fix for better image handling
      });
      
      // PDF dimensions
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      // Add custom font styling
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor("#333333");
      
      // Process all slides sequentially with improved error handling
      for (let i = 0; i < editedSlides.length; i++) {
        console.log(`Processing slide ${i+1} for PDF export`);
        const slide = editedSlides[i];
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add slide background
        pdf.setFillColor(248, 250, 252); // Light blue-gray background
        pdf.rect(0, 0, width, height, 'F');
        
        // Add header bar
        pdf.setFillColor(40, 80, 160); // Professional blue
        pdf.rect(0, 0, width, 12, 'F');
        
        // Add slide title with enhanced formatting
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor('#1a365d'); // Dark blue
        pdf.text(slide.title, width / 2, 25, { align: 'center' });
        
        // Determine layout for content positioning
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
        
        // Add bullets with better formatting and positioning
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor('#333333');
        
        let y = layout === 'centered' ? 40 : 45;
        for (const bullet of slide.bullets) {
          const bulletText = '• ' + bullet;
          const lines = pdf.splitTextToSize(bulletText, textWidth);
          pdf.text(lines, textX, y);
          y += 8 * lines.length;
        }
        
        // Add image with proper error handling and loading
        if (slide.imageUrl) {
          try {
            console.log(`Processing image for PDF slide ${i+1}: ${slide.imageUrl.substring(0, 50)}...`);
            
            // Handle image conversion with proper error handling
            let imgData;
            try {
              console.log(`Fetching image for slide ${i+1}...`);
              imgData = await getBase64FromUrl(slide.imageUrl);
              console.log(`Successfully converted image to base64 for slide ${i+1}`);
            } catch(imgError) {
              console.error(`Failed to load image for slide ${i+1}:`, imgError);
              // Add error placeholder instead of failing
              pdf.setFillColor(230, 230, 230); // Light gray
              pdf.rect(imgX, imgY, imgWidth, imgHeight, 'F');
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(10);
              pdf.setTextColor('#666666');
              pdf.text("Image not available", imgX + imgWidth/2, imgY + imgHeight/2, { align: 'center' });
              continue;
            }
            
            if (imgData) {
              // For centered layout, place image below text
              if (layout === 'centered') {
                pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');
              } else {
                // For other layouts, place image to the side
                pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');
              }
            }
          } catch (err) {
            console.error(`Error adding image to PDF for slide ${i+1}:`, err);
            // Don't throw - continue with next slide
          }
        }
        
        // Add slide number and footer
        pdf.setFillColor(240, 240, 245); // Light gray footer
        pdf.rect(0, height - 12, width, 12, 'F');
        
        pdf.setFontSize(10);
        pdf.setTextColor('#666666');
        pdf.text(`${i + 1}/${editedSlides.length}`, width - 20, height - 5, { align: 'right' });
        pdf.text(`${deckTitle || 'Presentation'}`, 20, height - 5);
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
      
      // Create new PptxGenJS instance with better defaults
      const pptx = new PptxGenJS();
      
      // Set presentation properties and improved default styling
      pptx.author = 'SlideMaker AI';
      pptx.company = 'Created with SlideMaker AI';
      pptx.title = deckTitle || 'Presentation';
      
      // Set a professional design theme
      pptx.theme = {
        headFontFace: 'Arial',
        bodyFontFace: 'Arial',
        colorScheme: {
          background1: { color: "FFFFFF" },
          background2: { color: "F5F8FC" },
          text1: { color: "1A365D" },
          text2: { color: "333333" },
          accent1: { color: "4472C4" },
          accent2: { color: "ED7D31" },
        },
      };
      
      // Set the master slide with consistent professional styling
      pptx.defineSlideMaster({
        title: 'MASTER_SLIDE',
        background: { color: "FFFFFF" },
        objects: [
          // Top header bar
          { 'rect': { x: 0, y: 0, w: '100%', h: 0.3, fill: { color: "4472C4" } } },
          
          // Footer bar
          { 'rect': { x: 0, y: 6.8, w: '100%', h: 0.3, fill: { color: "F0F0F5" } } },
          
          // Footer text - deck title
          { 'text': { 
            text: deckTitle || 'Presentation', 
            options: { x: 0.5, y: 6.85, w: 4, h: 0.3, align: 'left', fontSize: 10, color: '666666', fontFace: 'Arial' } 
          }},
          
          // Background subtle effect
          { 'rect': { 
            x: 0, y: 0.3, w: '100%', h: 6.5, 
            fill: { color: "FCFCFF" },
            line: { color: "F5F5F5", width: 1 }
          }}
        ]
      });
      
      // Process all slides with improved styling and error handling
      for (let i = 0; i < editedSlides.length; i++) {
        console.log(`Processing slide ${i+1} for PPTX export`);
        const slide = editedSlides[i];
        const layout = slide.style?.layout || 'right-image';
        
        // Create slide using master
        const pptSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        
        // Add slide number to bottom right
        pptSlide.addText(`${i + 1}/${editedSlides.length}`, {
          x: 9, y: 6.85, w: 0.5, h: 0.3, 
          fontSize: 10, color: '666666', align: 'right',
          fontFace: 'Arial'
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
          imageHeight = 3.5;
          contentX = 5;
          contentWidth = 4.5;
        } else if (layout === 'right-image') {
          contentX = 0.5;
          contentWidth = 4.5;
          imageX = 5.5;
          imageY = 1.5;
          imageWidth = 4;
          imageHeight = 3.5;
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
          contentWidth = 7;
          imageX = 8;
          imageY = 1.5;
          imageWidth = 1.5;
          imageHeight = 1.5;
        }
        
        // Add bullets with improved formatting
        const bulletPoints = slide.bullets.map(bullet => ({ text: bullet }));
        
        pptSlide.addText(bulletPoints, {
          x: contentX,
          y: 1.5,
          w: contentWidth,
          h: layout === 'centered' ? 1.8 : 4.5,
          fontSize: 18,
          color: '333333',
          bullet: { type: 'bullet' },
          fontFace: 'Arial',
          lineSpacing: 32
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
              
              // Add placeholder rectangle instead
              pptSlide.addShape(pptx.ShapeType.rect, {
                x: imageX,
                y: imageY,
                w: imageWidth,
                h: imageHeight,
                fill: { color: 'F0F0F0' }
              });
              
              pptSlide.addText('Image not available', {
                x: imageX,
                y: imageY + imageHeight/2 - 0.25,
                w: imageWidth,
                h: 0.5,
                fontSize: 14,
                color: '888888',
                align: 'center',
                fontFace: 'Arial'
              });
              
              continue;
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
            
            // Add placeholder if image fails
            pptSlide.addShape(pptx.ShapeType.rect, {
              x: imageX,
              y: imageY,
              w: imageWidth,
              h: imageHeight,
              fill: { color: 'F0F0F0' }
            });
            
            pptSlide.addText('Image placeholder', {
              x: imageX,
              y: imageY + imageHeight/2 - 0.25,
              w: imageWidth,
              h: 0.5,
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
