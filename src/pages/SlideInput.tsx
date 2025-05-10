
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Json } from '@/integrations/supabase/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  const [error, setError] = useState<string | null>(null);
  const [profession, setProfession] = useState<string>("Consultant");
  const [purpose, setPurpose] = useState<string>("Proposal");
  const [tone, setTone] = useState<string>("Formal");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("SlideInput: Component mounted, user status:", user ? "Logged in" : "Not logged in");
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SlideInput: Form submitted for slide generation");
    console.log("SlideInput: Selected options - Profession:", profession, "Purpose:", purpose, "Tone:", tone);
    
    // Reset any previous errors
    setError(null);
    
    if (!slideContent.trim()) {
      console.warn("SlideInput: Empty content submitted");
      setError("Please enter some content to generate slides.");
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
      console.log("SlideInput: Starting slide generation, content length:", slideContent.length);
      setGenerationProgress(30);
      
      // Add a timeout to handle cases where the function might take too long
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation timed out. The server might be busy, please try again.')), 30000);
      });
      
      console.log("SlideInput: Calling Supabase function");
      // Call the Supabase function with a timeout, including the new dropdown selections
      const responsePromise = supabase.functions.invoke('generate-slides', {
        body: { 
          content: slideContent,
          profession: profession,
          purpose: purpose,
          tone: tone
        }
      });
      
      // Race between the actual API call and the timeout
      const { data, error } = await Promise.race([
        responsePromise,
        timeoutPromise.then(() => { 
          console.error("SlideInput: Generation timeout reached");
          throw new Error('Generation timed out. The server might be busy, please try again.'); 
        })
      ]) as any;
      
      if (error) {
        console.error("SlideInput: Function returned error:", error);
        throw error;
      }
      
      console.log("SlideInput: Received response from function");
      const slidesData = data as SlidesResponse;
      
      if (!slidesData.slides || !Array.isArray(slidesData.slides) || slidesData.slides.length === 0) {
        console.error("SlideInput: Invalid slides structure:", slidesData);
        throw new Error('Invalid or empty response from AI. Please try with more detailed content.');
      }
      
      console.log("SlideInput: Successfully generated slides:", slidesData.slides.length);
      
      setGenerationProgress(100);
      setGeneratedSlides(slidesData.slides);
      
      // Generate a title for the deck based on the first slide
      if (slidesData.slides.length > 0) {
        setDeckTitle(slidesData.slides[0].title);
        console.log("SlideInput: Set deck title to:", slidesData.slides[0].title);
      } else {
        setDeckTitle('Untitled Deck');
      }
      
      toast({
        title: "Slides generated!",
        description: `Successfully created ${slidesData.slides.length} slides.`,
      });
    } catch (error: any) {
      console.error('SlideInput: Error generating slides:', error);
      setError(error.message || "Failed to generate slides. Please try again.");
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate slides. Please try again.",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      if (generationProgress < 100) {
        console.log("SlideInput: Resetting progress as generation did not complete successfully");
        setGenerationProgress(0); // Reset progress if we didn't complete
      }
    }
  };
  
  const handleSave = async () => {
    if (!user) {
      console.warn("SlideInput: Save attempted without being logged in");
      toast({
        title: "Authentication required",
        description: "Please sign in to save your slides.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    
    if (generatedSlides.length === 0) {
      console.warn("SlideInput: Save attempted with no slides generated");
      toast({
        title: "No slides to save",
        description: "Generate some slides first before saving.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("SlideInput: Attempting to save slides:", generatedSlides.length);
    setIsSaving(true);
    
    try {
      // Convert the slides to a format compatible with Supabase's Json type
      const slidesJson = JSON.parse(JSON.stringify(generatedSlides)) as Json;
      
      console.log("SlideInput: Inserting slide deck into database");
      const { error, data } = await supabase
        .from('slide_decks')
        .insert({
          user_id: user.id,
          title: deckTitle,
          slides: slidesJson
        })
        .select()
        .single();
      
      if (error) {
        console.error("SlideInput: Database error when saving:", error);
        throw error;
      }
      
      console.log("SlideInput: Successfully saved slides, deck ID:", data?.id);
      
      toast({
        title: "Saved successfully!",
        description: "Your slides have been saved to your account.",
      });
      
      // Redirect to My Decks page after saving
      navigate('/my-decks');
    } catch (error: any) {
      console.error('SlideInput: Error saving slides:', error);
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
          
          {error && (
            <Alert variant="destructive" className="mb-6 animate-fade-down">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Select
                  value={profession}
                  onValueChange={setProfession}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Profession</SelectLabel>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select
                  value={purpose}
                  onValueChange={setPurpose}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Purpose</SelectLabel>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Lecture">Lecture</SelectItem>
                      <SelectItem value="Team Update">Team Update</SelectItem>
                      <SelectItem value="Pitch">Pitch</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={tone}
                  onValueChange={setTone}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tone</SelectLabel>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Visual-heavy">Visual-heavy</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <Textarea 
                className="min-h-[300px] w-full bg-white border-0 resize-none focus-visible:ring-1 focus-visible:ring-primary text-base md:text-lg"
                placeholder="Paste your content here... (bullet points, notes, or paragraphs)"
                value={slideContent}
                onChange={(e) => setSlideContent(e.target.value)}
                disabled={isGenerating}
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
                    {generationProgress < 30 ? "Preparing your content..." : 
                     generationProgress < 60 ? "Creating slides with AI..." : 
                     generationProgress < 90 ? "Polishing your presentation..." : 
                     "Finalizing your slides..."}
                  </p>
                </div>
              )}
              
              {!isGenerating && !generatedSlides.length && !error && (
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
