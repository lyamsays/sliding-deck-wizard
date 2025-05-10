
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";

interface Slide {
  title: string;
  bullets: string[];
}

interface SlidesResponse {
  slides: Slide[];
}

const SlideInput = () => {
  const [slideContent, setSlideContent] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slideContent.trim()) {
      toast({
        title: "Content is empty",
        description: "Please enter some content to generate slides.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedSlides([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: { content: slideContent }
      });
      
      if (error) throw error;
      
      const slidesData = data as SlidesResponse;
      
      if (!slidesData.slides || !Array.isArray(slidesData.slides)) {
        throw new Error('Invalid response format');
      }
      
      setGeneratedSlides(slidesData.slides);
      
      toast({
        title: "Slides generated!",
        description: `Successfully created ${slidesData.slides.length} slides.`,
      });
    } catch (error: any) {
      console.error('Error generating slides:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate slides. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Turn Your Ideas Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Slides</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Paste your notes or bullet points below. We'll handle the rest.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <Textarea 
                className="min-h-[300px] w-full bg-white border-0 resize-none focus-visible:ring-1 focus-visible:ring-primary text-base md:text-lg"
                placeholder="Paste your content here... (bullet points, notes, or paragraphs)"
                value={slideContent}
                onChange={(e) => setSlideContent(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col items-center">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-primary hover:bg-primary/90 transition-all px-8 py-6 text-lg"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Slides"}
              </Button>
              
              <p className="mt-4 text-sm text-gray-500 italic">
                {isGenerating 
                  ? "Processing your content with AI..." 
                  : "Slide previews will appear after generation."}
              </p>
            </div>
          </form>
          
          {generatedSlides.length > 0 && (
            <div className="mt-16 space-y-12 animate-fade-up">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Your Generated Slides</h2>
              
              <div className="space-y-8">
                {generatedSlides.map((slide, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-primary/5 p-4 border-b border-gray-200">
                      <h3 className="font-bold text-xl text-gray-800">
                        {slide.title}
                      </h3>
                    </div>
                    
                    <div className="p-6">
                      <ul className="space-y-3">
                        {slide.bullets.map((bullet, i) => (
                          <li key={i} className="flex">
                            <span className="text-primary mr-2">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SlideInput;
