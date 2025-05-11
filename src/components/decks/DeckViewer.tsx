
import React, { useState } from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { SlideDeck, Slide, prepareDbSlides } from "@/types/deck";
import * as LucideIcons from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Download, Printer, Loader } from 'lucide-react';
import SlideEditDialog from '../slides/SlideEditDialog';
import { jsPDF } from 'jspdf';

interface DeckViewerProps {
  deck: SlideDeck;
  onClose: () => void;
}

const DeckViewer = ({ deck, onClose }: DeckViewerProps) => {
  const [currentDeck, setCurrentDeck] = useState<SlideDeck>(deck);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(-1);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const { toast } = useToast();

  const handleEditSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setIsEditDialogOpen(true);
  };

  const handleSlideUpdate = async (updatedSlide: Slide) => {
    // Create a new slides array with the updated slide
    const updatedSlides = [...currentDeck.slides];
    updatedSlides[currentSlideIndex] = updatedSlide;
    
    // Update the local state
    const updatedDeck = {
      ...currentDeck,
      slides: updatedSlides
    };
    setCurrentDeck(updatedDeck);
    
    // Update the database - Convert slides to proper JSON format for database
    try {
      const { error } = await supabase
        .from('slide_decks')
        .update({ slides: prepareDbSlides(updatedSlides) })
        .eq('id', deck.id);
      
      if (error) throw error;
      
      toast({
        title: "Slide updated",
        description: "Changes saved successfully.",
      });
    } catch (error: any) {
      console.error("Error updating slide:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrintDeck = () => {
    window.print();
  };

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

  const handleDownloadPDF = async () => {
    try {
      setIsPdfExporting(true);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // PDF dimensions
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      // Process all slides sequentially
      for (let i = 0; i < currentDeck.slides.length; i++) {
        const slide = currentDeck.slides[i];
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add slide background color - use a simple solid color instead of trying to render gradients
        pdf.setFillColor(240, 240, 245); // Light blue-gray that looks professional
        pdf.rect(0, 0, width, height, 'F');
        
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
        
        // Add image if available with improved error handling
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
            // Continue with export even if image fails
          }
        }
        
        // Add slide number
        pdf.setFontSize(10);
        pdf.text(`Slide ${i + 1}/${currentDeck.slides.length}`, width - 20, height - 10, { align: 'right' });
      }
      
      pdf.save(`${currentDeck.title || 'presentation'}.pdf`);
      
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
      setIsPdfExporting(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{currentDeck.title}</CardTitle>
            <CardDescription>
              Created on {format(new Date(currentDeck.created_at), 'MMMM d, yyyy')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrintDeck}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadPDF}
              disabled={isPdfExporting}
            >
              {isPdfExporting ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              PDF
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 max-h-[700px] overflow-y-auto print:max-h-none print:overflow-visible">
        {currentDeck.slides.map((slide, index) => {
          // Get the icon component dynamically
          const iconName = slide.style?.iconType || 'FileText';
          const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.FileText;
          const backgroundColor = slide.style?.backgroundColor || '#F1F0FB';
          const layout = slide.style?.layout || 'right-image';
          
          return (
            <Card 
              key={index} 
              className="overflow-hidden shadow-sm print:break-inside-avoid print:page-break-after-auto"
              style={{ backgroundColor }}
            >
              <CardHeader className={`bg-primary/5 py-4 ${layout === 'title-focus' ? 'hidden' : ''}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {slide.title}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditSlide(index)}
                    className="print:hidden"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit slide</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {layout === 'title-focus' && (
                  <div className="mb-6 py-4 bg-primary/30 rounded-lg text-center">
                    <h2 className="text-xl font-bold text-gray-800">{slide.title}</h2>
                  </div>
                )}
                
                <div className={`flex ${layout === 'centered' ? 'flex-col items-center' : 
                  layout === 'left-image' ? 'flex-row-reverse' : 
                  layout === 'right-image' ? 'flex-row' : ''}`}>
                  
                  {/* Content area with bullets */}
                  <div className={`${(layout === 'left-image' || layout === 'right-image') ? 'flex-grow' : 'w-full'}`}>
                    <ul className={`space-y-2 ${layout === 'centered' ? 'text-center' : ''}`}>
                      {slide.bullets.map((bullet: string, i: number) => (
                        <li key={i} className={`flex items-start ${layout === 'centered' ? 'justify-center' : ''}`}>
                          {layout !== 'centered' && <span className="text-primary mr-2 mt-1">•</span>}
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Image or icon area */}
                  {(layout === 'left-image' || layout === 'right-image' || layout === 'centered') && (
                    <div className={`${layout === 'left-image' ? 'mr-6' : 
                      layout === 'right-image' ? 'ml-6' : 
                      layout === 'centered' ? 'mb-6' : ''} flex items-center justify-center`}>
                      
                      {slide.imageUrl ? (
                        <div className="overflow-hidden rounded-lg">
                          <img 
                            src={slide.imageUrl} 
                            alt={slide.title} 
                            className={`object-cover ${layout === 'centered' ? 'w-64 h-64' : 'max-w-xs'}`}
                          />
                        </div>
                      ) : (
                        <div className={`${layout === 'centered' ? 'w-24 h-24' : 'w-20 h-20'} flex items-center justify-center bg-primary/10 rounded-full`}>
                          <IconComponent className={`${layout === 'centered' ? 'h-12 w-12' : 'h-10 w-10'} text-primary`} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Speaker notes if available */}
                {slide.speakerNotes && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Speaker Notes:</p>
                    <p className="text-sm text-gray-600 italic">{slide.speakerNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between print:hidden">
        <div className="text-sm text-gray-500">
          {currentDeck.slides.length} slide{currentDeck.slides.length !== 1 ? 's' : ''}
        </div>
      </CardFooter>

      {currentSlideIndex >= 0 && (
        <SlideEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          slide={currentDeck.slides[currentSlideIndex]}
          onSlideUpdate={handleSlideUpdate}
        />
      )}
    </Card>
  );
};

export default DeckViewer;
