
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileImage } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Slide } from '@/types/deck';

interface ExportToImageProps {
  slides: Slide[];
  deckTitle: string;
}

const ExportToImage: React.FC<ExportToImageProps> = ({ slides, deckTitle }) => {
  const { toast } = useToast();

  const exportSlidesAsImages = async () => {
    if (slides.length === 0) {
      toast({
        title: "No slides to export",
        description: "Please generate slides first.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      const images: string[] = [];
      
      toast({
        title: "Exporting slides",
        description: "Preparing your presentation for download...",
      });

      // Export each slide
      for (let i = 0; i < slides.length; i++) {
        const slideElement = document.getElementById(`slide-content-${i}`);
        
        if (!slideElement) continue;

        // Temporarily hide UI elements
        const uiElements = slideElement.querySelectorAll('.slide-ui-elements-not-for-export');
        uiElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });

        try {
          const canvas = await html2canvas(slideElement, {
            backgroundColor: null,
            scale: 2, // High resolution
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: true,
            width: 1920, // Standard presentation width
            height: 1080, // Standard presentation height
            scrollX: 0,
            scrollY: 0,
            removeContainer: false,
            imageTimeout: 15000,
            onclone: (clonedDoc) => {
              // Ensure fonts are loaded in the cloned document
              const clonedElement = clonedDoc.getElementById(`slide-content-${i}`);
              if (clonedElement) {
                // Ensure all text is rendered
                const textElements = clonedElement.querySelectorAll('*');
                textElements.forEach(el => {
                  const element = el as HTMLElement;
                  if (element.style.fontFamily) {
                    element.style.fontFamily = element.style.fontFamily + ', -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                  }
                });
              }
            }
          });

          const imageData = canvas.toDataURL('image/png', 1.0);
          images.push(imageData);
        } catch (error) {
          console.error(`Error capturing slide ${i + 1}:`, error);
        } finally {
          // Restore UI elements
          uiElements.forEach(el => {
            (el as HTMLElement).style.display = '';
          });
        }
      }

      // Create and download ZIP file with all images
      if (images.length > 0) {
        await downloadImagesAsZip(images, deckTitle);
        
        toast({
          title: "Export completed",
          description: `Successfully exported ${images.length} slides as images.`,
        });
      } else {
        throw new Error("No slides could be exported");
      }

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your slides. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImagesAsZip = async (images: string[], title: string) => {
    // Import JSZip dynamically
    const JSZip = (await import('jszip')).default;
    
    const zip = new JSZip();
    const folder = zip.folder(title || 'Presentation');

    images.forEach((imageData, index) => {
      // Remove data URL prefix
      const base64Data = imageData.split(',')[1];
      folder?.file(`slide-${index + 1}.png`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    
    // Create download link
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'presentation'}-slides.zip`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={exportSlidesAsImages}
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileImage className="h-4 w-4" />
      Export as Images
    </Button>
  );
};

export default ExportToImage;
