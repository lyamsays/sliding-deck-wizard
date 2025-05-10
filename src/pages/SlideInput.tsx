import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Slide } from '@/types/deck';
import { getRandomPastelColor, getIconSuggestion } from '@/types/deck';

// Import refactored components
import SlideForm from '@/components/slides/SlideForm';
import GenerationProgress from '@/components/slides/GenerationProgress';
import ImageGenerationProgress from '@/components/slides/ImageGenerationProgress';
import SlideList from '@/components/slides/SlideList';

interface SlidesResponse {
  slides: Slide[];
}

const SlideInput = () => {
  const [slideContent, setSlideContent] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deckTitle, setDeckTitle] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [profession, setProfession] = useState<string>("Consultant");
  const [purpose, setPurpose] = useState<string>("");
  const [tone, setTone] = useState<string>("Formal");
  const [viewMode, setViewMode] = useState<'outline' | 'slide'>('slide');
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [autoGenerateImages, setAutoGenerateImages] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const slidePreviewRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log("SlideInput: Component mounted, user status:", user ? "Logged in" : "Not logged in");
  }, [user]);
  
  useEffect(() => {
    // When generatedSlides updates, update editedSlides
    if (generatedSlides.length > 0) {
      // Add style properties to each slide
      const styledSlides = generatedSlides.map(slide => ({
        ...slide,
        style: {
          backgroundColor: getRandomPastelColor(),
          iconType: getIconSuggestion(slide.title, slide.visualSuggestion),
          // Explicitly cast to one of the allowed layout types
          layout: Math.random() > 0.5 ? 'right-image' : 'left-image' as 'right-image' | 'left-image',
          colorScheme: 'professional'
        }
      }));
      
      setEditedSlides(styledSlides);
      
      // If auto-generate images is enabled, generate images for all slides
      if (autoGenerateImages) {
        generateAllImages();
      }
    }
  }, [generatedSlides]);
  
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
        
        // Check for OpenAI quota error
        if (error.message?.includes('quota') || error.message?.includes('exceeded')) {
          throw new Error('OpenAI API quota exceeded. The service is temporarily unavailable. Please try again later or contact support.');
        }
        
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
      
      // Scroll to the slides preview
      setTimeout(scrollToPreview, 1000);
      
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
  
  const handleSlideUpdate = (index: number, updatedSlide: Slide) => {
    const updatedSlides = [...editedSlides];
    updatedSlides[index] = updatedSlide;
    setEditedSlides(updatedSlides);
  };
  
  const handleRemoveImage = (index: number) => {
    const updatedSlides = [...editedSlides];
    delete updatedSlides[index].imageUrl;
    delete updatedSlides[index].revisedPrompt;
    setEditedSlides(updatedSlides);
    
    toast({
      title: "Image removed",
      description: "The image has been removed from this slide.",
    });
  };
  
  const generateAllImages = async () => {
    if (editedSlides.length === 0) {
      toast({
        title: "No slides to generate images for",
        description: "Generate some slides first.",
        variant: "destructive"
      });
      return;
    }
    
    const slidesWithSuggestions = editedSlides.filter(slide => slide.visualSuggestion);
    
    if (slidesWithSuggestions.length === 0) {
      toast({
        title: "No visual suggestions",
        description: "None of your slides have visual suggestions to generate images from.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingImages(true);
    
    // Start with 10% progress
    setImageProgress(10);
    
    const updatedSlides = [...editedSlides];
    const totalSlides = slidesWithSuggestions.length;
    let processedCount = 0;
    
    toast({
      title: "Generating images",
      description: `Starting image generation for ${totalSlides} slides...`,
    });
    
    try {
      for (let i = 0; i < editedSlides.length; i++) {
        const slide = editedSlides[i];
        
        if (!slide.visualSuggestion || slide.imageUrl) {
          continue;
        }
        
        // Create a refined prompt for image generation
        const imagePrompt = `Create a professional presentation slide visual about "${slide.title}". ${slide.visualSuggestion}. Make it suitable for a business presentation, clean and minimal style, no text in the image.`;
        
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { prompt: imagePrompt }
        });
        
        if (error) {
          console.error(`Error generating image for slide ${i}:`, error);
          continue;
        }
        
        if (data.error) {
          console.error(`API error generating image for slide ${i}:`, data.error);
          continue;
        }
        
        const { imageUrl, revisedPrompt } = data;
        
        updatedSlides[i] = {
          ...slide,
          imageUrl,
          revisedPrompt
        };
        
        processedCount++;
        
        // Update progress (keeping 10% for start and 10% for completion)
        const progressValue = 10 + Math.round((processedCount / totalSlides) * 80);
        setImageProgress(progressValue);
      }
      
      // Final update to slides
      setEditedSlides(updatedSlides);
      setImageProgress(100);
      
      toast({
        title: "Images generated",
        description: `Successfully generated ${processedCount} images.`,
      });
    } catch (error: any) {
      toast({
        title: "Some images failed",
        description: error.message || "Some images could not be generated. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImages(false);
    }
  };
  
  const handleDownloadSlides = () => {
    if (editedSlides.length === 0) {
      toast({
        title: "No slides to download",
        description: "Generate some slides first before downloading.",
        variant: "destructive"
      });
      return;
    }
    
    let content = `# ${deckTitle || 'Untitled Presentation'}\n\n`;
    
    editedSlides.forEach((slide, index) => {
      content += `## Slide ${index + 1}: ${slide.title}\n\n`;
      
      slide.bullets.forEach(bullet => {
        content += `* ${bullet}\n`;
      });
      
      if (slide.visualSuggestion) {
        content += `\nVisual suggestion: ${slide.visualSuggestion}\n`;
      }
      
      content += '\n\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deckTitle || 'presentation'}.md`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your slides are being downloaded.",
    });
  };
  
  const scrollToPreview = () => {
    if (slidePreviewRef.current) {
      slidePreviewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTryExample = () => {
    const exampleContent = `Traditional economics assumes rational actors

Behavioral economics shows people are biased

Anchoring effect

Loss aversion

Nudge theory`;
    
    setSlideContent(exampleContent);
    
    toast({
      title: "Example loaded",
      description: "Try generating slides with this sample content!",
    });
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
          
          <SlideForm
            isGenerating={isGenerating}
            error={error}
            slideContent={slideContent}
            profession={profession}
            purpose={purpose}
            tone={tone}
            generationProgress={generationProgress}
            autoGenerateImages={autoGenerateImages}
            setSlideContent={setSlideContent}
            setProfession={setProfession}
            setPurpose={setPurpose}
            setTone={setTone}
            setAutoGenerateImages={setAutoGenerateImages}
            onSubmit={handleSubmit}
            onTryExample={handleTryExample}
          />
          
          <ImageGenerationProgress
            isGeneratingImages={isGeneratingImages}
            imageProgress={imageProgress}
          />
          
          {!isGenerating && !generatedSlides.length && !error && (
            <p className="mt-4 text-sm text-gray-500 italic text-center">
              Slide previews will appear after generation.
            </p>
          )}
          
          <GenerationProgress isGenerating={isGenerating} />
          
          <div ref={slidePreviewRef}>
            <SlideList
              editedSlides={editedSlides}
              viewMode={viewMode}
              setViewMode={setViewMode}
              deckTitle={deckTitle}
              setDeckTitle={setDeckTitle}
              handleSave={handleSave}
              handleSlideUpdate={handleSlideUpdate}
              handleRemoveImage={handleRemoveImage}
              handleDownloadSlides={handleDownloadSlides}
              isSaving={isSaving}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SlideInput;
