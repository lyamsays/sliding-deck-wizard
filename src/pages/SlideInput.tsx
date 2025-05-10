
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const [isSaving, setIsSaving] = useState(false);
  const [deckTitle, setDeckTitle] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    
    // Set up a progress indicator that simulates the generation process
    setGenerationProgress(10);
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        // Don't go past 90% until we actually get the response
        return prev < 90 ? prev + 10 : prev;
      });
    }, 500);
    
    try {
      setGenerationProgress(30);
      
      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: { content: slideContent }
      });
      
      if (error) throw error;
      
      const slidesData = data as SlidesResponse;
      
      if (!slidesData.slides || !Array.isArray(slidesData.slides)) {
        throw new Error('Invalid response format');
      }
      
      setGenerationProgress(100);
      setGeneratedSlides(slidesData.slides);
      
      // Generate a title for the deck based on the first slide
      if (slidesData.slides.length > 0) {
        setDeckTitle(slidesData.slides[0].title);
      } else {
        setDeckTitle('Untitled Deck');
      }
      
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
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your slides.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    
    if (generatedSlides.length === 0) {
      toast({
        title: "No slides to save",
        description: "Generate some slides first before saving.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('slide_decks')
        .insert({
          user_id: user.id,
          title: deckTitle,
          slides: generatedSlides
        });
      
      if (error) throw error;
      
      toast({
        title: "Saved successfully!",
        description: "Your slides have been saved to your account.",
      });
      
      // Redirect to My Decks page after saving
      navigate('/my-decks');
    } catch (error: any) {
      console.error('Error saving slides:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save slides. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Generating slides...</span>
                  </div>
                ) : (
                  "Generate Slides"
                )}
              </Button>
              
              {isGenerating && (
                <div className="w-full mt-6 space-y-2">
                  <Progress value={generationProgress} className="h-2 w-full" />
                  <p className="text-sm text-center text-gray-500 italic">
                    Creating your slides with AI...
                  </p>
                </div>
              )}
              
              {!isGenerating && !generatedSlides.length && (
                <p className="mt-4 text-sm text-gray-500 italic">
                  Slide previews will appear after generation.
                </p>
              )}
            </div>
          </form>
          
          {isGenerating && (
            <div className="mt-16 space-y-12 animate-fade-up">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Preparing Your Slides</h2>
              
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="overflow-hidden border-gray-200">
                    <CardHeader className="bg-primary/5 pb-3">
                      <Skeleton className="h-7 w-3/4" />
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {!isGenerating && generatedSlides.length > 0 && (
            <div className="mt-16 space-y-12 animate-fade-up">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Your Generated Slides</h2>
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
              
              <div className="space-y-8">
                {generatedSlides.map((slide, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-3">
                      <CardTitle className="text-xl text-gray-800">
                        {slide.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        {slide.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
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
