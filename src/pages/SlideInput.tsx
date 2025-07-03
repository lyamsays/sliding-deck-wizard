import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Slide } from '@/types/deck';
import { getRandomPastelColor, getIconSuggestion } from '@/types/deck';

// Import refactored components
import SlideForm from '@/components/slides/SlideForm';
import GenerationProgress from '@/components/slides/GenerationProgress';
import ImageGenerationProgress from '@/components/slides/ImageGenerationProgress';
import SlideList from '@/components/slides/slide-list'; // Updated import path

// Import new components
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import CreationSteps from '@/components/slides/CreationSteps';
import FeatureTooltip from '@/components/onboarding/FeatureTooltip';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HelpCircle, Settings } from 'lucide-react';
import { themes } from '@/components/themes/theme-data';
import { Theme } from '@/components/themes/theme-types';

// Add error boundary
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p className="font-bold">Something went wrong:</p>
      <pre className="mt-2 text-sm overflow-auto">{error.message}</pre>
      <Button 
        className="mt-4" 
        onClick={resetErrorBoundary}
        variant="destructive"
      >
        Try again
      </Button>
    </div>
  );
};

interface SlidesResponse {
  slides: Slide[];
}

const SlideInput = () => {
  console.log("SlideInput component rendering"); // Debug log
  
  const location = useLocation();
  const autoGenerate = new URLSearchParams(location.search).get('autoGenerate') === 'true';
  
  // Check for setup data on component mount
  useEffect(() => {
    const setupDataString = localStorage.getItem('setupData');
    if (setupDataString) {
      try {
        const setupData = JSON.parse(setupDataString);
        console.log("SlideInput: Loading setup data:", setupData);
        
        // Pre-fill form with setup data
        setSlideContent(setupData.content || '');
        setProfession(setupData.profession || 'Consultant');
        setPurpose(setupData.purpose || '');
        setTone(setupData.tone || 'Professional');
        setSelectedTheme(setupData.selectedTheme || 'creme');
        setAutoGenerateImages(setupData.autoGenerateImages !== undefined ? setupData.autoGenerateImages : true);
        
        // Clear the setup data from localStorage
        localStorage.removeItem('setupData');
        
        // Show a welcome message
        toast({
          title: "Setup completed!",
          description: "Your preferences have been loaded. Generating your presentation...",
        });
        
        // Auto-generate slides if coming from setup
        if (autoGenerate && setupData.content) {
          // Small delay to ensure state is set
          setTimeout(() => {
            handleAutoGenerate(setupData);
          }, 100);
        }
        
      } catch (error) {
        console.error("SlideInput: Error parsing setup data:", error);
      }
    }
  }, []);

  // Original state variables
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
  const [framework, setFramework] = useState<string>("None");
  const [viewMode, setViewMode] = useState<'outline' | 'slide'>('slide');
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [autoGenerateImages, setAutoGenerateImages] = useState(true);
  
  // New state variable for theme selection
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    // Try to get the saved theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    return savedTheme || 'creme'; // Default to 'creme' if no theme is saved
  });
  
  // New state variables for enhanced UX
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentCreationStep, setCurrentCreationStep] = useState<'input' | 'generating' | 'editing' | 'exporting'>('input');
  const [showTips, setShowTips] = useState(true);
  const [hasJustLoaded, setHasJustLoaded] = useState(true);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const slidePreviewRef = useRef<HTMLDivElement>(null);
  
  // Check if this is the user's first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && hasJustLoaded) {
      setShowOnboarding(true);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
    setHasJustLoaded(false);
  }, [hasJustLoaded]);
  
  // Update current step based on app state
  useEffect(() => {
    if (isGenerating) {
      setCurrentCreationStep('generating');
    } else if (generatedSlides.length > 0) {
      setCurrentCreationStep('editing');
    }
  }, [isGenerating, generatedSlides.length]);
  
  // Original useEffect hooks
  useEffect(() => {
    console.log("SlideInput: Component mounted, user status:", user ? "Logged in" : "Not logged in");
  }, [user]);
  
  useEffect(() => {
    // When generatedSlides updates, update editedSlides and apply selected theme
    if (generatedSlides.length > 0) {
      console.log("SlideInput: Applying theme to slides. Selected theme:", selectedTheme);
      // Find the selected theme from themes array
      const themeData = themes.find(theme => theme.id === selectedTheme) || themes.find(theme => theme.id === 'creme')!;
      console.log("SlideInput: Theme data found:", themeData.name);
      
      // Add style properties to each slide based on the selected theme
      const styledSlides = generatedSlides.map((slide, index) => ({
        ...slide,
        style: {
          backgroundColor: themeData.background,
          iconType: getIconSuggestion(slide.title, slide.visualSuggestion),
          layout: Math.random() > 0.5 ? 'right-image' : 'left-image' as 'right-image' | 'left-image',
          colorScheme: themeData.id,
          accentColor: themeData.accentColor,
          textColor: themeData.textColor,
          titleFont: themeData.titleFont,
          bodyFont: themeData.bodyFont,
          cardDesign: themeData.cardDesign
        }
      }));
      
      setEditedSlides(styledSlides);
      console.log("SlideInput: Styled slides set with theme properties");
      
      // Call image generation if autoGenerateImages is enabled
      if (autoGenerateImages) {
        console.log("SlideInput: Auto image generation is enabled, will generate images after delay");
        setTimeout(() => {
          generateAllImages();
        }, 500);
      }
    }
  }, [generatedSlides, selectedTheme]);
  
  const handleAutoGenerate = async (setupData: any) => {
    console.log("SlideInput: Auto-generating slides from setup data");
    
    setError(null);
    setIsGenerating(true);
    setGeneratedSlides([]);
    setCurrentCreationStep('generating');
    
    // Set up a progress indicator that simulates the generation process
    setGenerationProgress(10);
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        return prev < 90 ? prev + 10 : prev;
      });
    }, 500);
    
    try {
      console.log("SlideInput: Starting auto slide generation");
      setGenerationProgress(30);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation timed out. The server might be busy, please try again.')), 30000);
      });
      
      console.log("SlideInput: Calling Supabase function for auto generation");
      const responsePromise = supabase.functions.invoke('generate-slides', {
        body: { 
          content: setupData.content,
          profession: setupData.profession,
          purpose: setupData.purpose,
          tone: setupData.tone,
          framework: setupData.profession === "Consultant" ? framework : undefined,
          themeId: setupData.selectedTheme,
          autoGenerateImages: setupData.autoGenerateImages
        }
      });
      
      const { data, error } = await Promise.race<{
        data: SlidesResponse | null;
        error: { message?: string } | null;
      }>([
        responsePromise,
        timeoutPromise.then(() => {
          console.error("SlideInput: Auto generation timeout reached");
          throw new Error('Generation timed out. The server might be busy, please try again.');
        })
      ]);
      
      if (error) {
        console.error("SlideInput: Auto generation function returned error:", error);
        throw error;
      }
      
      console.log("SlideInput: Received auto generation response from function");
      const slidesData = data as SlidesResponse;
      
      if (!slidesData.slides || !Array.isArray(slidesData.slides) || slidesData.slides.length === 0) {
        console.error("SlideInput: Invalid auto generation slides structure:", slidesData);
        throw new Error('Invalid or empty response from AI. Please try with more detailed content.');
      }
      
      console.log("SlideInput: Successfully auto-generated slides:", slidesData.slides.length);
      
      setGenerationProgress(100);
      setGeneratedSlides(slidesData.slides);
      setCurrentCreationStep('editing');
      
      if (slidesData.slides.length > 0) {
        setDeckTitle(slidesData.slides[0].title);
        console.log("SlideInput: Set auto-generated deck title to:", slidesData.slides[0].title);
      } else {
        setDeckTitle('Untitled Deck');
      }
      
      toast({
        title: "Slides generated!",
        description: `Successfully created ${slidesData.slides.length} slides from your setup.`,
      });
      
      setTimeout(scrollToPreview, 1000);
      
    } catch (error) {
      const err = error as Error;
      console.error('SlideInput: Error auto-generating slides:', err);
      setError(err.message || "Failed to generate slides. Please try again.");
      toast({
        title: "Auto-generation failed",
        description: err.message || "Failed to auto-generate slides. Please adjust your content and try again.",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      if (generationProgress < 100) {
        console.log("SlideInput: Resetting auto-generation progress as generation did not complete successfully");
        setGenerationProgress(0);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SlideInput: Form submitted for slide generation");
    console.log("SlideInput: Selected options - Profession:", profession, "Purpose:", purpose, "Tone:", tone, "Framework:", framework);
    console.log("SlideInput: Selected theme:", selectedTheme);
    console.log("SlideInput: Auto-generate images:", autoGenerateImages);
    
    // Save the selected theme to localStorage
    localStorage.setItem('selectedTheme', selectedTheme);
    
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
    setCurrentCreationStep('generating');
    
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
      // Call the Supabase function with a timeout, including the new dropdown selections and theme
      const responsePromise = supabase.functions.invoke('generate-slides', {
        body: { 
          content: slideContent,
          profession: profession,
          purpose: purpose,
          tone: tone,
          framework: profession === "Consultant" ? framework : undefined,
          themeId: selectedTheme,
          autoGenerateImages: autoGenerateImages // This flag explicitly sent to the function
        }
      });
      
      // Race between the actual API call and the timeout
      const { data, error } = await Promise.race<{
        data: SlidesResponse | null;
        error: { message?: string } | null;
      }>([
        responsePromise,
        timeoutPromise.then(() => {
          console.error("SlideInput: Generation timeout reached");
          throw new Error('Generation timed out. The server might be busy, please try again.');
        })
      ]);
      
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
      setCurrentCreationStep('editing');
      
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
      
    } catch (error) {
      const err = error as Error;
      console.error('SlideInput: Error generating slides:', err);
      setError(err.message || "Failed to generate slides. Please try again.");
      toast({
        title: "Generation failed",
        description: err.message || "Failed to generate slides. Please try again.",
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
    } catch (error) {
      const err = error as Error;
      console.error('SlideInput: Error saving slides:', err);
      toast({
        title: "Save failed",
        description: err.message || "Failed to save slides. Please try again.",
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
    
    console.log("SlideInput: Starting automatic image generation for all slides");
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
        
        console.log(`SlideInput: Generating image for slide ${i}: ${slide.title}`);
        
        // Create a refined prompt for image generation with more emphasis on professional design
        const imagePrompt = `Create a professional presentation slide visual about "${slide.title}". ${slide.visualSuggestion}. Make it suitable for a business presentation, clean and minimal style with ample white space, no text in the image, elegant professional look, high-quality visual.`;
        
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
        console.log(`SlideInput: Successfully generated image for slide ${i}`);
        
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
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Some images failed",
        description: err.message || "Some images could not be generated. Please try again.",
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

  const handleExport = () => {
    setCurrentCreationStep('exporting');
  };

  const toggleTips = () => {
    setShowTips(prev => !prev);
    if (showTips) {
      toast({
        title: "Tips disabled",
        description: "You can re-enable them from the help menu.",
      });
    } else {
      toast({
        title: "Tips enabled",
        description: "Hover over elements to see helpful tips.",
      });
    }
  };

  // Add console logging to track component lifecycle
  useEffect(() => {
    console.log("SlideInput: Component mounted, user status:", user ? "Logged in" : "Not logged in");
    
    // Return cleanup function
    return () => {
      console.log("SlideInput: Component unmounting");
    };
  }, [user]);

  // Add error handling wrapper
  try {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        
        {/* Help button */}
        <div className="fixed bottom-5 right-5 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-semibold">Help & Settings</h2>
                
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setShowOnboarding(true)}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Show Tutorial
                  </Button>
                  
                  <Button 
                    variant={showTips ? "default" : "outline"} 
                    className="w-full justify-start" 
                    onClick={toggleTips}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {showTips ? "Disable Tips" : "Enable Tips"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <main className="flex-1 py-12 md:py-16 px-4 container-enhanced">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                Turn Your Ideas Into Slides
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Paste your notes or bullet points below. We'll handle the rest.
              </p>
            </div>
            
            {/* Wizard steps */}
            <CreationSteps currentStep={currentCreationStep} />
            
            <div className="section-card animate-fade-up">
              {showTips && (
                <FeatureTooltip 
                  title="Create Your Presentation"
                  description="Enter your content, select your preferences, and let our AI do the work!"
                  position="right"
                >
                  <SlideForm
                    isGenerating={isGenerating}
                    error={error}
                    slideContent={slideContent}
                    profession={profession}
                    purpose={purpose}
                    tone={tone}
                    framework={framework}
                    generationProgress={generationProgress}
                    autoGenerateImages={autoGenerateImages}
                    selectedTheme={selectedTheme}
                    setSlideContent={setSlideContent}
                    setProfession={setProfession}
                    setPurpose={setPurpose}
                    setTone={setTone}
                    setFramework={setFramework}
                    setAutoGenerateImages={setAutoGenerateImages}
                    setSelectedTheme={setSelectedTheme}
                    onSubmit={handleSubmit}
                    onTryExample={handleTryExample}
                  />
                </FeatureTooltip>
              )}
              
              {!showTips && (
                <SlideForm
                  isGenerating={isGenerating}
                  error={error}
                  slideContent={slideContent}
                  profession={profession}
                  purpose={purpose}
                  tone={tone}
                  framework={framework}
                  generationProgress={generationProgress}
                  autoGenerateImages={autoGenerateImages}
                  selectedTheme={selectedTheme}
                  setSlideContent={setSlideContent}
                  setProfession={setProfession}
                  setPurpose={setPurpose}
                  setTone={setTone}
                  setFramework={setFramework}
                  setAutoGenerateImages={setAutoGenerateImages}
                  setSelectedTheme={setSelectedTheme}
                  onSubmit={handleSubmit}
                  onTryExample={handleTryExample}
                />
              )}
            </div>
            
            <ImageGenerationProgress
              isGeneratingImages={isGeneratingImages}
              imageProgress={imageProgress}
            />
            
            {!isGenerating && !generatedSlides.length && !error && (
              <p className="mt-6 text-sm text-gray-500 italic text-center">
                Slide previews will appear here after generation.
              </p>
            )}
            
            <GenerationProgress isGenerating={isGenerating} />
            
            <div ref={slidePreviewRef}>
              {showTips && editedSlides.length > 0 ? (
                <FeatureTooltip 
                  title="Edit Your Slides"
                  description="Click on any text to edit directly. Change view modes and customize your presentation."
                  position="top"
                >
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
                </FeatureTooltip>
              ) : (
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
              )}
            </div>
          </div>
        </main>
        
        <Footer />
        
        {/* Onboarding modal */}
        <OnboardingModal 
          open={showOnboarding} 
          onOpenChange={setShowOnboarding} 
        />
      </div>
    );
  } catch (err) {
    console.error("Error in SlideInput render:", err);
    return <ErrorFallback error={err instanceof Error ? err : new Error("Unknown error occurred")} resetErrorBoundary={() => window.location.reload()} />;
  }
};

export default SlideInput;
