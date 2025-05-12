
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slide } from '@/types/deck';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader, MessageSquare, Copy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface NarrativeModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: Slide[];
  deckTitle: string;
  onSpeakerNotesAdded: (slideIndex: number, notes: string) => void;
}

const NarrativeMode: React.FC<NarrativeModeProps> = ({
  open,
  onOpenChange,
  slides,
  deckTitle,
  onSpeakerNotesAdded
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pitchSummary, setPitchSummary] = useState<string>('');
  const [speakerNotes, setSpeakerNotes] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<string>('summary');
  const { toast } = useToast();
  
  const formatSlidesForAI = () => {
    return slides.map((slide, index) => {
      return `Slide ${index + 1}: ${slide.title}\n${slide.bullets.map(bullet => `- ${bullet}`).join('\n')}`;
    }).join('\n\n');
  };
  
  const generateNarrative = async () => {
    if (!slides.length) {
      toast({
        title: "No slides available",
        description: "Please create some slides first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Format slides for the AI
      const formattedSlides = formatSlidesForAI();
      
      // Create instruction to the AI
      const prompt = `You are a professional AI-powered presentation coach. Please analyze this slide deck and provide:

1. 🎙 Pitch Summary (2–3 paragraphs)
This is an opening monologue the presenter can use to introduce the entire presentation.
It should summarize the topic and purpose of the deck, flow naturally, and be professional.

2. 📝 Slide-by-Slide Speaker Notes
For each slide, write a short paragraph (1–3 sentences) of speaker notes that would sound natural when spoken.
Include transitions between slides when appropriate.
Write in first person perspective, as if you are the presenter speaking to the audience.

The deck title is: "${deckTitle}"

Here are the slides:
${formattedSlides}`;
      
      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: { 
          content: prompt,
          mode: "narrative"
        }
      });
      
      if (error) throw error;
      
      if (!data || !data.narrative) {
        throw new Error('Invalid response from AI');
      }
      
      const { pitchSummary, slideNotes } = data.narrative;
      
      // Update states
      setPitchSummary(pitchSummary);
      
      // Create speaker notes object
      const notesObj: Record<number, string> = {};
      slideNotes.forEach((note: string, index: number) => {
        notesObj[index] = note;
      });
      setSpeakerNotes(notesObj);
      
      toast({
        title: "Narrative generated",
        description: "Your pitch summary and speaker notes are ready!",
      });
      
    } catch (error: any) {
      console.error("Error generating narrative:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate narrative. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const applySpeakerNotes = () => {
    // Apply the generated speaker notes to all slides
    Object.entries(speakerNotes).forEach(([slideIndex, notes]) => {
      onSpeakerNotesAdded(parseInt(slideIndex), notes);
    });
    
    toast({
      title: "Speaker notes applied",
      description: "Speaker notes have been added to your slides.",
    });
    
    onOpenChange(false);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Narrative Mode
          </DialogTitle>
        </DialogHeader>
        
        {!pitchSummary && !isGenerating && (
          <div className="py-6 text-center space-y-4">
            <p className="text-gray-600">
              Generate a pitch summary and slide-by-slide speaker notes to help you deliver a compelling presentation.
            </p>
            <Button 
              onClick={generateNarrative} 
              className="mx-auto"
              disabled={isGenerating}
            >
              Generate Speaker Notes
            </Button>
          </div>
        )}
        
        {isGenerating && (
          <div className="py-10 text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Crafting your narrative...</p>
          </div>
        )}
        
        {pitchSummary && !isGenerating && (
          <>
            <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Pitch Summary</TabsTrigger>
                <TabsTrigger value="notes">Speaker Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4 mt-4">
                <div className="relative bg-muted/30 p-4 rounded-md border">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2" 
                    onClick={() => copyToClipboard(pitchSummary)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <h3 className="text-lg font-medium mb-2">🎙 Pitch Summary:</h3>
                  <div className="whitespace-pre-wrap">
                    {pitchSummary}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-6 mt-4">
                {slides.map((slide, index) => (
                  <div key={index} className="relative bg-muted/30 p-4 rounded-md border">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2" 
                      onClick={() => copyToClipboard(speakerNotes[index] || '')}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                    <h3 className="text-lg font-medium mb-2">Slide {index + 1} - {slide.title}</h3>
                    <div className="whitespace-pre-wrap">
                      {speakerNotes[index] || 'No speaker notes generated for this slide.'}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="flex justify-between items-center mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={applySpeakerNotes}
              >
                Add Notes to Slides
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NarrativeMode;
