import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Sparkles, 
  Download, 
  Heart,
  Users,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import PptxGenJs from 'pptxgenjs';
// @ts-ignore - JSZip types issue

interface TrySuccessProps {
  slideCount: number;
  onSave: () => void;
  user: any;
  slides?: Array<{
    title: string;
    bullets: string[];
    visualSuggestion?: string;
    speakerNotes?: string;
    imageUrl?: string;
  }>;
  deckTitle?: string;
}

const TrySuccess: React.FC<TrySuccessProps> = ({ slideCount, onSave, user, slides = [], deckTitle = "Presentation" }) => {
  const { toast } = useToast();
  
  // PDF Export Function
  const handleExportPDF = async () => {
    try {
      toast({
        title: "Preparing PDF export",
        description: "Capturing slides for export..."
      });
      
      // Find all slide elements
      const slideElements = document.querySelectorAll('[data-slide-id]');
      
      if (slideElements.length === 0) {
        throw new Error("No slides found to export");
      }
      
      // Initialize PDF with 16:9 aspect ratio for presentations
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [1920, 1080]
      });
      
      // Get PDF dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 0; i < slideElements.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        toast({
          title: "Exporting PDF",
          description: `Processing slide ${i + 1} of ${slideElements.length}...`
        });
        
        const slideElement = slideElements[i] as HTMLElement;
        
        // Capture the slide as canvas
        const canvas = await html2canvas(slideElement, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: 1920,
          height: 1080,
          scrollX: 0,
          scrollY: 0
        });
        
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');
        
        // Add the image to PDF
        pdf.addImage(
          imgData,
          'PNG',
          0,
          0,
          pageWidth,
          pageHeight,
          '',
          'FAST'
        );
      }
      
      // Save the PDF
      pdf.save(`${deckTitle}.pdf`);
      
      toast({
        title: "PDF exported successfully",
        description: "Your presentation has been downloaded as a PDF file."
      });
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      toast({
        title: "Export failed",
        description: err.message || "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // PowerPoint Export Function
  const handleExportPPTX = async () => {
    try {
      toast({
        title: "Preparing PowerPoint export",
        description: "Capturing slides for export..."
      });
      
      // Find all slide elements
      const slideElements = document.querySelectorAll('[data-slide-id]');
      
      if (slideElements.length === 0) {
        throw new Error("No slides found to export");
      }
      
      // Create new presentation
      const pptx = new PptxGenJs();
      pptx.layout = 'LAYOUT_16x9';
      
      for (let i = 0; i < slideElements.length; i++) {
        toast({
          title: "Exporting PPTX",
          description: `Processing slide ${i + 1} of ${slideElements.length}...`
        });
        
        const slideElement = slideElements[i] as HTMLElement;
        
        // Capture the slide as canvas
        const canvas = await html2canvas(slideElement, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: 1920,
          height: 1080,
          scrollX: 0,
          scrollY: 0
        });
        
        // Convert canvas to base64
        const imgData = canvas.toDataURL('image/png');
        
        // Add slide to presentation
        const slide = pptx.addSlide();
        
        // Add the captured image to the slide
        slide.addImage({
          data: imgData,
          x: 0,
          y: 0,
          w: '100%',
          h: '100%'
        });
      }
      
      // Save the presentation
      await pptx.writeFile({ fileName: `${deckTitle}.pptx` });
      
      toast({
        title: "PowerPoint exported successfully",
        description: "Your presentation has been downloaded as a PPTX file."
      });
    } catch (err: any) {
      console.error('Error generating PPTX:', err);
      toast({
        title: "Export failed",
        description: err.message || "Failed to generate PowerPoint. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Images Export Function
  const handleExportImages = async () => {
    try {
      toast({
        title: "Preparing images export",
        description: "Capturing slides as images..."
      });
      
      const slideElements = document.querySelectorAll('[data-slide-id]');
      
      if (slideElements.length === 0) {
        throw new Error("No slides found to export");
      }
      
      const images: string[] = [];
      
      for (let i = 0; i < slideElements.length; i++) {
        const slideElement = slideElements[i] as HTMLElement;
        
        const canvas = await html2canvas(slideElement, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: 1920,
          height: 1080,
          scrollX: 0,
          scrollY: 0
        });
        
        const imageData = canvas.toDataURL('image/png', 1.0);
        images.push(imageData);
      }
      
      // Create and download ZIP file with all images
      if (images.length > 0) {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        const folder = zip.folder(deckTitle);
        
        images.forEach((imageData, index) => {
          const base64Data = imageData.split(',')[1];
          folder?.file(`slide-${index + 1}.png`, base64Data, { base64: true });
        });
        
        const content = await zip.generateAsync({ type: 'blob' });
        
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${deckTitle}-slides.zip`;
        document.body.appendChild(link);
        link.click();
        
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        toast({
          title: "Images exported successfully",
          description: "Your slides have been downloaded as PNG images."
        });
      }
    } catch (err: any) {
      console.error('Error generating images:', err);
      toast({
        title: "Export failed",
        description: err.message || "Failed to generate images. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (user) return null; // Don't show if already logged in

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-800">
          🎉 Amazing! Your presentation is ready!
        </CardTitle>
        <p className="text-green-700">
          You just created {slideCount} professional slides in seconds. Want to save them?
        </p>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        {/* Value proposition */}
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-green-700">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Save unlimited presentations</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Access from anywhere</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Share with your team</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={onSave}
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Save My Presentation (Free!)
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link to="/create">
              Create Another
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Export alternative */}
        <div className="pt-4 border-t border-green-200">
          <p className="text-sm text-green-600 mb-3">
            Or download now without signing up:
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPPTX}>
              <Download className="h-4 w-4 mr-2" />
              PowerPoint
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportImages}>
              <Download className="h-4 w-4 mr-2" />
              Images
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-xs text-green-600">
          <Badge variant="secondary" className="mr-2">✓ No credit card</Badge>
          <Badge variant="secondary" className="mr-2">✓ Free plan</Badge>
          <Badge variant="secondary">✓ 30-second signup</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrySuccess;