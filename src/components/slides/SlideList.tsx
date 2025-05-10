import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Edit, Save, Loader, LayoutGrid, LayoutList } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slide } from '@/types/deck';
import OutlineSlide from '@/components/slides/OutlineSlide';
import StyledSlide from '@/components/slides/StyledSlide';
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SlideListProps {
  editedSlides: Slide[];
  viewMode: 'outline' | 'slide';
  setViewMode: (mode: 'outline' | 'slide') => void;
  deckTitle: string;
  setDeckTitle: (title: string) => void;
  handleSave: () => void;
  handleSlideUpdate: (index: number, updatedSlide: Slide) => void;
  handleRemoveImage: (index: number) => void;
  handleDownloadSlides: () => void;
  isSaving: boolean;
}

const SlideList: React.FC<SlideListProps> = ({
  editedSlides,
  viewMode,
  setViewMode,
  deckTitle,
  setDeckTitle,
  handleSave,
  handleSlideUpdate,
  handleRemoveImage,
  handleDownloadSlides,
  isSaving
}) => {
  const [isExporting, setIsExporting] = useState(false);

  if (editedSlides.length === 0) {
    return null;
  }
  
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
    } catch (error) {
      console.error('Error generating PDF:', error);
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
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="mt-16 space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Generated Slides</h2>
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'outline' | 'slide')}>
            <ToggleGroupItem value="outline" aria-label="Toggle outline view">
              <LayoutList className="h-4 w-4 mr-2" />
              Outline
            </ToggleGroupItem>
            <ToggleGroupItem value="slide" aria-label="Toggle slide view">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Slide
            </ToggleGroupItem>
          </ToggleGroup>
          
          <div className="flex items-center gap-2">
            <input 
              type="text"
              placeholder="Deck Title"
              className="px-3 py-2 border rounded-md text-sm"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
            />
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save Deck"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4 flex items-center">
        <Edit className="h-4 w-4 mr-2 text-primary" />
        <p className="text-sm text-gray-600">
          Click on any text to edit your slides directly. Changes will be saved automatically.
        </p>
      </div>
      
      <div className="space-y-8">
        {editedSlides.map((slide, index) => (
          viewMode === 'outline' ? (
            <OutlineSlide 
              key={index} 
              slide={slide} 
              index={index} 
              onSlideUpdate={handleSlideUpdate} 
            />
          ) : (
            <StyledSlide 
              key={index} 
              slide={slide} 
              index={index} 
              onSlideUpdate={handleSlideUpdate}
              onRemoveImage={() => handleRemoveImage(index)}
            />
          )
        ))}
      </div>
      
      <div className="flex justify-center mt-8 gap-4">
        <Button 
          onClick={handleDownloadSlides}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/80"
          size="lg"
        >
          <Download className="h-5 w-5" />
          <span>Download as Text</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="flex items-center gap-2"
              size="lg"
              disabled={isExporting}
            >
              {isExporting ? <Loader className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
              <span>Export Presentation</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPDF}>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPPTX}>
              Export as PowerPoint (.pptx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SlideList;
