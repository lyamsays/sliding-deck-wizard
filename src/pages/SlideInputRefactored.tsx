import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { Slide } from '@/types/deck';

// Import new modular components
import ContentInput from '@/components/slides/ContentInput';
import GenerationProgress from '@/components/slides/GenerationProgress';
import SlideEditor from '@/components/slides/SlideEditor';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import ImageGenerationProgress from '@/components/slides/ImageGenerationProgress';
import TrySuccess from '@/components/slides/TrySuccess';
import TryBeforeSignup from '@/components/slides/TryBeforeSignup';

interface SlidesResponse {
  slides: Slide[];
}

const SlideInput = () => {
  console.log("SlideInput component rendering");
  
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const autoGenerate = new URLSearchParams(location.search).get('autoGenerate') === 'true';
  
  // Core state
  const [slideContent, setSlideContent] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([]);
  const [deckTitle, setDeckTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [profession, setProfession] = useState<string>("Consultant");
  const [purpose, setPurpose] = useState<string>("");
  const [tone, setTone] = useState<string>("Professional");
  const [framework, setFramework] = useState<string>("None");
  const [autoGenerateImages, setAutoGenerateImages] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('creme');
  
  // UI state
  const [viewMode, setViewMode] = useState<'outline' | 'slide'>('slide');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  
  const slidePreviewRef = useRef<HTMLDivElement>(null);
  
  // Check for setup data on mount
  useEffect(() => {
    console.log("SlideInput: Component mounted, user status:", user ? "Logged in" : "Not logged in");
    
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
        
        localStorage.removeItem('setupData');
        
        toast({
          title: "Setup completed!",
          description: "Your preferences have been loaded. Generating your presentation...",
        });
        
        if (autoGenerate && setupData.content) {
          setTimeout(() => {
            handleAutoGenerate(setupData);
          }, 100);
        }
        
      } catch (error) {
        console.error("SlideInput: Error parsing setup data:", error);
      }
    }
    
    // Check for first-time user onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("SlideInput: Component unmounting");
    };
  }, []);
  
  const scrollToPreview = () => {
    if (slidePreviewRef.current) {
      slidePreviewRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const handleAutoGenerate = async (setupData: any) => {
    console.log("SlideInput: Auto-generating slides from setup data");
    
    setError(null);
    setIsGenerating(true);
    setGeneratedSlides([]);
    
    setGenerationProgress(10);
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => prev < 90 ? prev + 10 : prev);
    }, 500);
    
    try {
      console.log("SlideInput: Starting auto slide generation");
      setGenerationProgress(30);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation timed out. The server might be busy, please try again.')), 30000);
      });
      
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
      
      const { data, error } = await responsePromise as {
        data: SlidesResponse | null;
        error: { message?: string } | null;
      };
      
      if (error) {
        console.error("SlideInput: Auto generation function returned error:", error);
        throw error;
      }
      
      const slidesData = data as SlidesResponse;
      
      if (!slidesData.slides || !Array.isArray(slidesData.slides) || slidesData.slides.length === 0) {
        console.error("SlideInput: Invalid auto generation slides structure:", slidesData);
        throw new Error('Invalid or empty response from AI. Please try with more detailed content.');
      }
      
      console.log("SlideInput: Successfully auto-generated slides:", slidesData.slides.length);
      
      setGenerationProgress(100);
      setGeneratedSlides(slidesData.slides);
      setEditedSlides(slidesData.slides);
      
      if (slidesData.slides.length > 0) {
        setDeckTitle(slidesData.slides[0].title);
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
        setGenerationProgress(0);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SlideInput: Form submitted for slide generation");
    
    localStorage.setItem('selectedTheme', selectedTheme);
    setError(null);
    
    if (!slideContent.trim()) {
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
    
    setGenerationProgress(10);
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => prev < 90 ? prev + 10 : prev);
    }, 500);
    
    try {
      console.log("SlideInput: Starting slide generation, content length:", slideContent.length);
      setGenerationProgress(30);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation timed out. The server might be busy, please try again.')), 30000);
      });
      
      const responsePromise = supabase.functions.invoke('generate-slides', {
        body: { 
          content: slideContent,
          profession: profession,
          purpose: purpose,
          tone: tone,
          framework: profession === "Consultant" ? framework : undefined,
          themeId: selectedTheme,
          autoGenerateImages: autoGenerateImages
        }
      });
      
      const { data, error } = await responsePromise as {
        data: SlidesResponse | null;
        error: { message?: string } | null;
      };
      
      if (error) {
        console.error("SlideInput: Function returned error:", error);
        if (error.message?.includes('quota') || error.message?.includes('exceeded')) {
          throw new Error('OpenAI API quota exceeded. The service is temporarily unavailable. Please try again later or contact support.');
        }
        throw error;
      }
      
      const slidesData = data as SlidesResponse;
      
      if (!slidesData.slides || !Array.isArray(slidesData.slides) || slidesData.slides.length === 0) {
        console.error("SlideInput: Invalid slides structure:", slidesData);
        throw new Error('Invalid or empty response from AI. Please try with more detailed content.');
      }
      
      console.log("SlideInput: Successfully generated slides:", slidesData.slides.length);
      
      setGenerationProgress(100);
      setGeneratedSlides(slidesData.slides);
      setEditedSlides(slidesData.slides);
      
      if (slidesData.slides.length > 0) {
        setDeckTitle(slidesData.slides[0].title);
      } else {
        setDeckTitle('Untitled Deck');
      }
      
      toast({
        title: "🎉 Slides generated successfully!",
        description: `Created ${slidesData.slides.length} professional slides. ${
          autoGenerateImages ? 'Images will be added automatically.' : ''
        }`,
      });
      
      setTimeout(scrollToPreview, 1000);
      
    } catch (error) {
      const err = error as Error;
      console.error('SlideInput: Error generating slides:', err);
      setError(err.message || "Failed to generate slides. Please try again.");
      toast({
        title: "⚠️ Generation failed",
        description: `${err.message} Please try adjusting your content or try again.`,
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      if (generationProgress < 100) {
        setGenerationProgress(0);
      }
    }
  };
  
  const handleSave = async () => {
    if (!user) {
      // Show sign-up prompt instead of redirecting immediately
      toast({
        title: "Save your amazing presentation!",
        description: "Sign up free to save and access your slides anytime.",
        action: (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/signup')}>
              Sign Up Free
            </Button>
          </div>
        ),
      });
      return;
    }
    
    if (editedSlides.length === 0) {
      toast({
        title: "No slides to save",
        description: "Generate some slides first before saving.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("SlideInput: Attempting to save slides:", editedSlides.length);
    setIsSaving(true);
    
    try {
      const slidesJson = JSON.parse(JSON.stringify(editedSlides)) as Json;
      
      const { data, error } = await supabase
        .from('slide_decks')
        .insert({
          title: deckTitle || 'Untitled Deck',
          slides: slidesJson,
          user_id: user.id
        })
        .select();
      
      if (error) {
        console.error("SlideInput: Save error:", error);
        throw error;
      }
      
      console.log("SlideInput: Slides saved successfully");
      toast({
        title: "💾 Presentation saved!",
        description: "Your slides are now safely stored in your account.",
      });
      
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
  
  const handleSlideEdit = (editedSlide: Slide, index: number) => {
    const updatedSlides = [...editedSlides];
    updatedSlides[index] = editedSlide;
    setEditedSlides(updatedSlides);
  };
  
  const onTryExample = () => {
    const examples = [
      "Create a quarterly business review presentation for executives covering Q3 performance, key metrics, and strategic initiatives for Q4.",
      "Design a research methodology presentation for academic peers explaining our experimental approach, data collection methods, and analysis framework.",
      "Build a client proposal deck showcasing our consulting services, case studies, and implementation timeline for digital transformation."
    ];
    
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setSlideContent(randomExample);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Try Before Signup Banner (for non-logged-in users) */}
        {!user && editedSlides.length === 0 && (
          <TryBeforeSignup />
        )}
        
        {/* Content Input Section */}
        {editedSlides.length === 0 && (
          <ContentInput
            slideContent={slideContent}
            setSlideContent={setSlideContent}
            profession={profession}
            setProfession={setProfession}
            purpose={purpose}
            setPurpose={setPurpose}
            tone={tone}
            setTone={setTone}
            framework={framework}
            setFramework={setFramework}
            autoGenerateImages={autoGenerateImages}
            setAutoGenerateImages={setAutoGenerateImages}
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
            onTryExample={onTryExample}
          />
        )}
        
        {/* Generation Progress */}
        <GenerationProgress
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          currentStep="generating"
          autoGenerateImages={autoGenerateImages}
        />
        
        {/* Image Generation Progress */}
        {isGeneratingImages && (
          <ImageGenerationProgress 
            isGeneratingImages={isGeneratingImages}
            imageProgress={imageProgress}
          />
        )}
        
        {/* Try Success Prompt (for non-logged-in users) */}
        {editedSlides.length > 0 && (
          <TrySuccess
            slideCount={editedSlides.length}
            onSave={handleSave}
            user={user}
          />
        )}
        
        {/* Slide Editor */}
        <div ref={slidePreviewRef}>
          {editedSlides.length > 0 && (
            <SlideEditor
              slides={editedSlides}
              deckTitle={deckTitle}
              setDeckTitle={setDeckTitle}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onSave={handleSave}
              onSlideEdit={handleSlideEdit}
              isSaving={isSaving}
              user={user}
            />
          )}
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </main>
      
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          open={showOnboarding}
          onOpenChange={(open) => setShowOnboarding(open)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default SlideInput;