import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { RefreshCw, ImageIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { Slide } from '@/types/deck';
import { getRandomPastelColor, getIconSuggestion } from '@/types/deck';
import { themes } from '@/components/themes/theme-data';

// Import new modular components
import ContentInput from '@/components/slides/ContentInput';
import GenerationProgress from '@/components/slides/GenerationProgress';
import SlideEditor from '@/components/slides/SlideEditor';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import ImageGenerationProgress from '@/components/slides/ImageGenerationProgress';
import TrySuccess from '@/components/slides/TrySuccess';
import TryBeforeSignup from '@/components/slides/TryBeforeSignup';

interface SlidesResponse {
  deckTitle?: string;
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
  const [profession, setProfession] = useState<string>("Professor");
  const [purpose, setPurpose] = useState<string>("");
  const [tone, setTone] = useState<string>("Professional");
  const [framework, setFramework] = useState<string>("None");
  const [autoGenerateImages, setAutoGenerateImages] = useState(false);
  const [numSlides, setNumSlides] = useState<number>(8);
  const [selectedTheme, setSelectedTheme] = useState<string>('pristine');
  
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
        setSelectedTheme(setupData.selectedTheme || 'pristine');
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
  
  // Smart Layout Function - Applies intelligent styling and layout to slides
  const applySmartLayout = (slides: Slide[], themeId: string) => {
    const themeData = themes.find(theme => theme.id === themeId) || themes.find(theme => theme.id === 'pristine')!;
    
    console.log("SlideInput: Applying smart layout with theme:", themeId, themeData);
    
    return slides.map((slide, index) => ({
      // Normalize all fields — Claude may return null for optional fields
      id: slide.id || `slide-${index}`,
      title: slide.title || `Slide ${index + 1}`,
      subtitle: slide.subtitle || undefined,
      slideType: slide.slideType || 'content',
      bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
      visualSuggestion: slide.visualSuggestion || '',
      speakerNotes: slide.speakerNotes || '',
      imageUrl: slide.imageUrl || '',
      revisedPrompt: slide.revisedPrompt || '',
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
  };
  
  // Automatic Image Generation Function
  const generateAllImages = async (slidesToProcess: Slide[]) => {
    if (slidesToProcess.length === 0) {
      toast({
        title: "No slides to generate images for",
        description: "Generate some slides first.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("SlideInput: Starting automatic image generation for all slides");
    const slidesWithSuggestions = slidesToProcess.filter(slide => slide.visualSuggestion && !slide.imageUrl);
    
    if (slidesWithSuggestions.length === 0) {
      console.log("SlideInput: No slides need image generation");
      return;
    }
    
    setIsGeneratingImages(true);
    setImageProgress(10);
    
    const updatedSlides = [...slidesToProcess];
    const totalSlides = slidesWithSuggestions.length;
    let processedCount = 0;
    
    toast({
      title: "🎨 Generating images automatically",
      description: `Creating professional visuals for ${totalSlides} slides...`,
    });
    
    try {
      for (let i = 0; i < slidesToProcess.length; i++) {
        const slide = slidesToProcess[i];
        
        if (!slide.visualSuggestion || slide.imageUrl) {
          continue;
        }
        
        console.log(`SlideInput: Generating image for slide ${i}: ${slide.title}`);
        
        try {
          const { ImageGenerationService } = await import('@/services/imageGeneration');
          
          const result = await ImageGenerationService.generateImage({
            prompt: slide.visualSuggestion || `Visual for ${slide.title}`,
            slideTitle: slide.title,
            slideContext: slide.bullets?.join(', '),
            timeout: 60000 // Extended timeout for better quality
          });
          
          console.log(`SlideInput: Successfully generated image for slide ${i}`);
          
          updatedSlides[i] = {
            ...slide,
            imageUrl: result.imageUrl,
            revisedPrompt: result.revisedPrompt
          };
          
          processedCount++;
          const progressValue = 10 + Math.round((processedCount / totalSlides) * 80);
          setImageProgress(progressValue);
          
        } catch (error) {
          console.error(`Error generating image for slide ${i}:`, error);
          processedCount++;
          const progressPercentage = 10 + (processedCount / totalSlides) * 80;
          setImageProgress(progressPercentage);
        }
      }
      
      setEditedSlides(updatedSlides);
      setImageProgress(100);
      
      toast({
        title: "✨ Images generated successfully!",
        description: `Created ${processedCount} professional images automatically.`,
      });
      
    } catch (error) {
      const err = error as Error;
      console.error("Error in automatic image generation:", err);
      toast({
        title: "Some images failed",
        description: err.message || "Some images could not be generated. You can add them manually.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImages(false);
      setTimeout(() => setImageProgress(0), 2000);
    }
  };

  // Manual Image Generation Function for button trigger
  const handleManualImageGeneration = () => {
    if (editedSlides.length === 0) {
      toast({
        title: "No slides available",
        description: "Please generate slides first before adding images.",
        variant: "destructive"
      });
      return;
    }
    
    generateAllImages(editedSlides);
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
          role: setupData.profession || 'Professor',
          audience: setupData.purpose || 'General Audience',
          tone: setupData.tone || 'Professional',
          purpose: setupData.purpose || 'Lecture / Class',
          themeId: setupData.selectedTheme,
          autoGenerateImages: setupData.autoGenerateImages,
          numSlides: numSlides,
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
      const autoStyledSlides = applySmartLayout(slidesData.slides, selectedTheme);
      setGeneratedSlides(autoStyledSlides);
      setEditedSlides(autoStyledSlides);
      
      setDeckTitle(slidesData.deckTitle || (slidesData.slides.length > 0 ? slidesData.slides[0].title : 'Untitled Deck'));
      
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
          role: profession,
          audience: purpose,
          tone: tone,
          purpose: purpose,
          themeId: selectedTheme,
          autoGenerateImages: autoGenerateImages,
          numSlides: numSlides,
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
      
      // Apply smart layout and styling to slides
      const styledSlides = applySmartLayout(slidesData.slides, selectedTheme);
      setGeneratedSlides(styledSlides);
      setEditedSlides(styledSlides);
      
      setDeckTitle(slidesData.deckTitle || (slidesData.slides.length > 0 ? slidesData.slides[0].title : 'Untitled Deck'));
      
      toast({
        title: "🎉 Slides generated successfully!",
        description: `Created ${slidesData.slides.length} professional slides. ${
          autoGenerateImages ? 'Starting automatic image generation...' : ''
        }`,
      });
      
      // Start automatic image generation if enabled (or always for better UX)
      if (autoGenerateImages) {
        toast({
          title: "🎨 Starting image generation",
          description: "Creating professional visuals for your slides...",
        });
        
        setTimeout(() => {
          generateAllImages(styledSlides);
        }, 1000); // Reduced delay for faster UX
      }
      
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

  const handleSlidesReorder = (newSlides: Slide[]) => {
    setEditedSlides(newSlides);
    setGeneratedSlides(newSlides);
  };
  
  const onTryExample = () => {
    const examples = [
      // 1. Psychology — Memory & Learning
      `Introduction to Psychology — Memory & Learning
PSYC 101 | Week 7 | Professor Sarah Chen

THE THREE STAGES OF MEMORY

Encoding: Information enters working memory through our senses. Deep processing — connecting new information to meaning and prior knowledge — leads to 3x better retention than shallow processing like re-reading.

Storage: The hippocampus consolidates short-term memories into long-term storage during sleep. Sleep deprivation reduces memory consolidation by up to 40%. This is why all-nighters before exams backfire scientifically.

Retrieval: Memory is reconstructive, not like replaying a video. Each time we recall something, we slightly alter it. This explains why 70% of wrongful convictions involve mistaken eyewitness identification.

KEY RESEARCH FINDINGS

Ebbinghaus Forgetting Curve (1885): Without review, 50% of new information is forgotten within 1 hour, and 70% within 24 hours.

Spaced Repetition Effect: Reviewing material at increasing intervals (1 day, 3 days, 1 week, 1 month) leads to 80% better long-term retention compared to cramming.

Testing Effect: Being tested on material produces 50% better retention after one week than students who re-study the same content.

Elaborative Interrogation: Asking "why" and "how" while studying forces deeper processing — students using this technique scored 72% higher on delayed tests.

WHY WE FORGET
Interference Theory: New memories interfere with old ones (retroactive) and vice versa (proactive). This is why studying similar subjects back-to-back hurts both.
Motivated Forgetting: The prefrontal cortex actively suppresses hippocampal retrieval of painful memories.
Decay Theory: Memory traces fade over time without rehearsal, though interference is now considered the stronger factor.

PRACTICAL STUDY STRATEGIES FOR STUDENTS
1. Practice retrieval daily — close your notes and try to recall key concepts without looking
2. Sleep 7-9 hours before exams — consolidation happens during slow-wave and REM sleep
3. Avoid studying similar subjects consecutively — reduces interference
4. Teach concepts to others — the Protégé Effect improves your own retention by 90%`,

      // 2. Macroeconomics — Market Structures & Competition
      `Principles of Macroeconomics — Market Structures & Competition
ECON 201 | Week 9 | Professor James Okafor

MARKET STRUCTURES OVERVIEW

Perfect Competition: Many sellers, identical products, free entry and exit. Price equals marginal cost in the long run. Firms are price takers — no individual seller influences the market price. Real-world example: agricultural commodities like wheat.

Monopolistic Competition: Many sellers, differentiated products, free entry. Short-run profits eroded by entry in the long run. Examples: restaurants, clothing brands, hairdressers. Firms have some pricing power through differentiation.

Oligopoly: Few dominant sellers, high barriers to entry, strategic interdependence. Decisions of one firm directly affect others — firms must anticipate rivals' responses. Examples: airlines, smartphones (Apple vs Samsung), oil (OPEC).

Monopoly: Single seller with no close substitutes, high barriers to entry. Sets price above marginal cost, creating deadweight loss. Examples: utility companies, patented pharmaceuticals, De Beers diamonds (historically).

KEY ECONOMIC CONCEPTS

Deadweight Loss: The efficiency cost of monopoly power. When P > MC, mutually beneficial transactions don't occur. Estimated at $100B+ annually in the US economy from monopolistic pricing.

Price Discrimination: Charging different prices to different consumers based on willingness to pay. First-degree (perfect): individualized pricing. Third-degree: student/senior discounts, airline fare classes. Increases producer surplus, reduces deadweight loss.

Herfindahl-Hirschman Index (HHI): Market concentration measure. Sum of squared market shares. HHI below 1,500: competitive market. HHI above 2,500: highly concentrated — triggers antitrust review.

GAME THEORY IN OLIGOPOLY

Prisoner's Dilemma: Firms have incentive to undercut each other even when cooperation would maximize joint profits. This drives competitive pricing despite oligopolistic structure.

Nash Equilibrium: Each firm's strategy is optimal given competitors' strategies. Neither player benefits from unilaterally changing their decision. Airline pricing wars often reach Nash equilibria.

ANTITRUST POLICY
Sherman Act (1890): Prohibits restraint of trade and monopolization.
Clayton Act (1914): Bans price discrimination that reduces competition.
FTC Act (1914): Establishes Federal Trade Commission to enforce competition law.
Recent cases: Google (search monopoly, $1.7B EU fine), Meta (Instagram/WhatsApp acquisitions).`,

      // 3. Molecular Biology — DNA Replication & Gene Expression
      `Molecular Biology — DNA Replication & Gene Expression
BIOL 302 | Week 5 | Professor Amara Diallo

DNA REPLICATION

Semiconservative Replication: Each daughter DNA molecule retains one original strand. Confirmed by Meselson-Stahl experiment (1958) using N-15/N-14 isotope labeling. The most elegant experiment in molecular biology.

Key Enzymes in Replication:
- DNA Helicase: Unwinds and separates the double helix at replication forks. Moves at 1,000 bp/second in prokaryotes.
- DNA Primase: Synthesizes short RNA primers (5-10 nucleotides) needed to initiate synthesis. DNA polymerase cannot start de novo.
- DNA Polymerase III: Primary replication enzyme in prokaryotes. Adds nucleotides 5' to 3' only — explains why one strand is synthesized continuously (leading) and one discontinuously (lagging).
- DNA Ligase: Joins Okazaki fragments on the lagging strand by sealing nicks in the phosphodiester backbone.

Okazaki Fragments: Short DNA segments (1,000-2,000 bp in prokaryotes, 100-200 bp in eukaryotes) synthesized on the lagging strand. Each requires its own RNA primer. Discovered by Reiji and Tsuneko Okazaki in 1968.

GENE EXPRESSION: TRANSCRIPTION

RNA Polymerase II: Transcribes protein-coding genes in eukaryotes. Requires general transcription factors (TFIID, TFIIH) to assemble at the promoter. Does not need a primer — unlike DNA polymerase.

Promoter Elements:
- TATA Box: Located ~30 bp upstream of transcription start. Bound by TFIID (TBP subunit). Determines precise start site.
- Enhancers: Can be thousands of bp upstream or downstream. Bound by activators that loop DNA to contact Mediator complex. Increase transcription rate up to 1,000-fold.

mRNA Processing in Eukaryotes:
- 5' Capping: 7-methylguanosine cap added co-transcriptionally. Protects mRNA from exonucleases. Required for ribosome recognition.
- Splicing: Introns removed by the spliceosome (5 snRNPs + ~200 proteins). Alternative splicing generates ~100,000 proteins from ~20,000 genes.
- Poly-A Tail: 200+ adenine nucleotides added to 3' end. Increases mRNA stability and assists nuclear export.

TRANSLATION

Ribosome Structure: Large (60S) + Small (40S) subunits in eukaryotes. Three tRNA binding sites: A (aminoacyl), P (peptidyl), E (exit). Peptide bond formation catalyzed by 23S rRNA — the ribosome is a ribozyme.

Genetic Code Properties:
- Degenerate: 64 codons encode 20 amino acids — most amino acids have multiple codons (redundancy)
- Unambiguous: Each codon specifies exactly one amino acid
- Nearly universal: Same code in bacteria, plants, fungi, and humans (with minor exceptions in mitochondria)

POST-TRANSLATIONAL MODIFICATION
Phosphorylation, glycosylation, ubiquitination — regulate protein activity, localization, and degradation lifetime.`
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
            autoGenerateImages={autoGenerateImages}
            setAutoGenerateImages={setAutoGenerateImages}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
            numSlides={numSlides}
            setNumSlides={setNumSlides}
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
        
        {/* Try Success Prompt (for non-logged-in users) - Only show after images are done */}
        {editedSlides.length > 0 && !isGeneratingImages && (
          <TrySuccess
            slideCount={editedSlides.length}
            onSave={handleSave}
            user={user}
            slides={editedSlides}
            deckTitle={deckTitle}
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
              onSlidesReorder={handleSlidesReorder}
              isSaving={isSaving}
              user={user}
            />
          )}
        </div>
        
        {/* Generate Images Button - Floating Action */}
        {editedSlides.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              onClick={handleManualImageGeneration}
              disabled={isGeneratingImages}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 shadow-lg rounded-full h-14 w-14 p-0"
            >
              {isGeneratingImages ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        )}
        
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