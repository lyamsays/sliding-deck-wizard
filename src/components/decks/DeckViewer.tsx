
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
      
      console.log(`Fetching image from URL: ${url}`);
      
      // For external URLs, fetch the image with proper CORS handling
      const response = await fetch(url, { 
        mode: 'no-cors', // Try with no-cors to prevent CORS issues
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }).catch(async (error) => {
        console.error("Error in first fetch attempt:", error);
        // Fall back to regular fetch if no-cors fails
        return fetch(url);
      });
      
      if (!response.ok && response.type !== 'opaque') {
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

  const handleDownloadPDF = async () => {
    try {
      setIsPdfExporting(true);
      
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
      for (let i = 0; i < currentDeck.slides.length; i++) {
        console.log(`Processing slide ${i+1} for PDF export`);
        const slide = currentDeck.slides[i];
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add slide background
        pdf.setFillColor(248, 250, 252); // Light blue-gray background
        pdf.rect(0, 0, width, height, 'F');
        
        // Add header bar for visual appeal
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
              // Handle both URLs and Data URLs properly
              if (slide.imageUrl.startsWith('data:image')) {
                imgData = slide.imageUrl;
                console.log('Using data URL directly for slide', i+1);
              } else {
                console.log(`Fetching image for slide ${i+1}...`);
                imgData = await getBase64FromUrl(slide.imageUrl);
                console.log(`Successfully converted image to base64 for slide ${i+1}`);
              }
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
              console.log(`Adding image to PDF for slide ${i+1}`);
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
        pdf.text(`${i + 1}/${currentDeck.slides.length}`, width - 20, height - 5, { align: 'right' });
        pdf.text(`${currentDeck.title || 'Presentation'}`, 20, height - 5);
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
                            crossOrigin="anonymous"
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
