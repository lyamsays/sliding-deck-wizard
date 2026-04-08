
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { ArrowLeft, Download, Edit, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Image, MessageSquare } from 'lucide-react';
import { SlideDeck, Slide } from '@/types/deck';

// Import jsPDF for PDF generation
import { jsPDF } from 'jspdf';

type SlideDeckRow = Database['public']['Tables']['slide_decks']['Row'];

interface DeckViewerProps {
  deck?: SlideDeck;
  onClose?: () => void;
}

const DeckViewer: React.FC<DeckViewerProps> = ({ deck: propDeck, onClose }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deck, setDeck] = useState<SlideDeckRow | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (propDeck) {
      // Use deck passed as prop
      setSlides(propDeck.slides);
      setIsLoading(false);
    } else if (id) {
      fetchDeck();
    }
  }, [id, propDeck]);

  const fetchDeck = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('slide_decks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setDeck(data);
      // Parse the slides JSON data safely
      if (data.slides && Array.isArray(data.slides)) {
        const typedSlides = (data.slides as unknown[]).map((slide: any, index: number) => ({
          id: slide.id || `slide-${index}`,
          title: slide.title || `Slide ${index + 1}`,
          bullets: slide.bullets || [],
          visualSuggestion: slide.visualSuggestion || '',
          speakerNotes: slide.speakerNotes || '',
          imageUrl: slide.imageUrl || '',
          revisedPrompt: slide.revisedPrompt || '',
          style: slide.style && Object.keys(slide.style).length > 0 ? slide.style : {
            backgroundColor: '#1e1b4b',
            textColor: '#ffffff',
            accentColor: '#7c3aed',
            titleFont: '"Inter", sans-serif',
            bodyFont: '"Inter", sans-serif',
          },
          cropData: slide.cropData || null,
        })) as Slide[];
        setSlides(typedSlides);
      }
    } catch (error) {
      console.error('Error fetching deck:', error);
      toast({
        title: "Error loading deck",
        description: "Could not load the deck. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const deckToDelete = deck || propDeck;
    if (!deckToDelete || !confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('slide_decks')
        .delete()
        .eq('id', deckToDelete.id);

      if (error) throw error;

      toast({
        title: "Deck deleted",
        description: "The deck has been successfully deleted.",
      });
      
      if (onClose) {
        onClose();
      } else {
        navigate('/my-decks');
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete the deck. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadAsPDF = () => {
    const deckData = deck || propDeck;
    if (!deckData || slides.length === 0) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Title page
    pdf.setFontSize(24);
    pdf.text(deckData.title, pageWidth / 2, 50, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 70, { align: 'center' });

    slides.forEach((slide: Slide, index: number) => {
      if (index > 0 || slides.length === 1) {
        pdf.addPage();
      } else if (index === 0 && slides.length > 1) {
        pdf.addPage();
      }

      // Slide title
      pdf.setFontSize(18);
      pdf.text(slide.title, 20, 30);
      
      // Slide bullets
      pdf.setFontSize(12);
      let yPosition = 50;
      
      (slide.bullets || []).forEach((bullet) => {
        const lines = pdf.splitTextToSize(`• ${bullet}`, pageWidth - 40);
        pdf.text(lines, 30, yPosition);
        yPosition += lines.length * 7;
      });
      
      // Visual suggestion
      if (slide.visualSuggestion) {
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.text(`Visual: ${slide.visualSuggestion}`, 20, yPosition);
      }
      
      // Speaker notes
      if (slide.speakerNotes) {
        yPosition += 15;
        pdf.setFontSize(10);
        pdf.text('Speaker Notes:', 20, yPosition);
        yPosition += 7;
        const noteLines = pdf.splitTextToSize(slide.speakerNotes, pageWidth - 40);
        pdf.text(noteLines, 20, yPosition);
      }
    });

    pdf.save(`${deckData.title}.pdf`);
    
    toast({
      title: "PDF downloaded",
      description: "Your presentation has been downloaded as a PDF.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading deck...</p>
        </div>
      </div>
    );
  }

  const deckData = deck || propDeck;
  if (!deckData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Deck not found</h2>
          <p className="text-gray-600 mb-6">The deck you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/my-decks')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Decks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/my-decks')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to My Decks
                </Button>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Close
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold">{deckData.title}</h1>
                <p className="text-sm text-gray-500">
                  Created {formatDistanceToNow(new Date(deckData.created_at))} ago
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={downloadAsPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {slides.map((slide: Slide, index: number) => (
            <Card key={slide.id || index} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </span>
                  {slide.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Content</h4>
                    <ul className="space-y-2">
                      {(slide.bullets || []).map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    {slide.visualSuggestion && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Image className="mr-2 h-4 w-4" />
                          Visual Suggestion
                        </h4>
                        <p className="text-sm text-gray-600">{slide.visualSuggestion}</p>
                      </div>
                    )}
                    
                    {slide.imageUrl && (
                      <div>
                        <h4 className="font-semibold mb-2">Image</h4>
                        <img 
                          src={slide.imageUrl} 
                          alt={slide.title}
                          className="w-full max-w-sm rounded-lg border"
                        />
                      </div>
                    )}
                    
                    {slide.speakerNotes && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Speaker Notes
                        </h4>
                        <p className="text-sm text-gray-600">{slide.speakerNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {slides.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No slides found</h3>
            <p className="text-gray-600">This deck appears to be empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckViewer;
