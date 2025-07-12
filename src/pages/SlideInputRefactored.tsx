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
  
  // Smart Layout Function - Applies intelligent styling and layout to slides
  const applySmartLayout = (slides: Slide[], themeId: string) => {
    const themeData = themes.find(theme => theme.id === themeId) || themes.find(theme => theme.id === 'creme')!;
    
    console.log("SlideInput: Applying smart layout with theme:", themeId, themeData);
    
    return slides.map((slide, index) => ({
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
        
        const imagePrompt = `Create a high-quality, professional presentation visual for "${slide.title}". ${slide.visualSuggestion}. Style: clean, modern, minimal design with professional color palette. No text overlay. Suitable for business presentation. High resolution and professional quality.`;
        
        try {
          const result = await Promise.race([
            supabase.functions.invoke('generate-image', {
              body: { prompt: imagePrompt }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Image generation timeout')), 30000))
          ]) as { data: any; error: any };
          
          const { data, error } = result;
          
          if (error || data.error) {
            console.error(`Error generating image for slide ${i}:`, error || data.error);
            processedCount++;
            const progressPercentage = 10 + (processedCount / totalSlides) * 80;
            setImageProgress(progressPercentage);
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
      
      // Apply smart layout and styling to slides
      const styledSlides = applySmartLayout(slidesData.slides, selectedTheme);
      setGeneratedSlides(styledSlides);
      setEditedSlides(styledSlides);
      
      if (slidesData.slides.length > 0) {
        setDeckTitle(slidesData.slides[0].title);
      } else {
        setDeckTitle('Untitled Deck');
      }
      
      toast({
        title: "🎉 Slides generated successfully!",
        description: `Created ${slidesData.slides.length} professional slides. ${
          autoGenerateImages ? 'Starting automatic image generation...' : ''
        }`,
      });
      
      // Start automatic image generation if enabled (or always for better UX)
      if (autoGenerateImages || true) { // Always generate images automatically
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
  
  const onTryExample = () => {
    const examples = [
      `Quarterly Business Review Q3 2024 - Executive Summary
Prepared for: Board of Directors
Revenue Performance: $47.2M (vs $44.1M target, +7% beat)

Q3 2024 Financial Highlights
Revenue Growth Analysis:
• Total Revenue: $47.2M (+12% YoY, +7% vs target of $44.1M)
• Recurring Revenue: $32.8M (+18% YoY, now 69% of total revenue)
• New Customer Acquisition: 847 new accounts (+23% vs Q3 2023)
• Customer Retention Rate: 94.2% (industry benchmark: 89%)
• Average Deal Size: $28,400 (+15% YoY improvement)

Operating Metrics Performance:
• Gross Margin: 68.4% (vs 65.2% target, +3.2 pts improvement)
• Operating Margin: 22.1% (+4.7 pts YoY expansion)
• EBITDA: $12.3M (+28% YoY growth)
• Free Cash Flow: $8.9M (+35% YoY increase)
• Customer Acquisition Cost (CAC): $1,250 (down 18% from $1,525 in Q2)

Market Position and Competitive Analysis:
• Market share in core segment: 23.4% (+2.1 pts YoY growth)
• Net Promoter Score: 68 (up from 61 in Q2)
• Win rate against top 3 competitors: 72% (vs 65% target)
• Product adoption rate: 89% of customers using 2+ products
• Expansion revenue: $5.2M from existing customers

Q4 2024 Strategic Initiatives:
Product Development Roadmap:
• AI-powered analytics module launch (targeting $2M ARR)
• Mobile app enhancement with offline capabilities
• API marketplace launch for third-party integrations
• Enterprise security certification (SOC 2 Type II completion)

Market Expansion Strategy:
• European market entry: UK and Germany pilot programs
• Vertical expansion: Healthcare and education sectors
• Partnership program: 3 strategic technology integrations
• Sales team expansion: 12 new account executives in Q4

Financial Projections Q4 2024:
• Revenue Target: $52.1M (+10% sequential growth)
• New Customer Target: 950 new accounts
• Gross Margin Target: 69.5%
• Operating Expense Budget: $24.8M`,

      `Research Methodology: Machine Learning Applications in Predictive Healthcare Analytics
Submitted to: Journal of Medical Informatics
Research Team: Dr. Sarah Chen, Dr. Michael Rodriguez, Dr. Lisa Zhang
Institution: Stanford Medical AI Research Laboratory

Research Objective and Hypothesis
Primary Research Question:
Can ensemble machine learning models predict patient readmission risk within 30 days with accuracy exceeding 85% using electronic health record (EHR) data alone?

Hypothesis:
We hypothesize that a combination of Random Forest, Gradient Boosting, and Neural Network algorithms, trained on structured EHR data including demographics, diagnoses, medications, and laboratory values, will achieve >85% accuracy in predicting 30-day readmission risk.

Data Collection Methodology
Dataset Composition:
• Source: Multi-hospital EHR system (Epic Systems) across 4 medical centers
• Patient Population: 127,439 adult patients (age ≥18) with index admissions
• Time Period: January 2019 - December 2023 (5-year retrospective study)
• Inclusion Criteria: Minimum 24-hour stay, complete EHR documentation
• Exclusion Criteria: Psychiatric admissions, planned readmissions, transfers

Feature Engineering Process:
Clinical Variables (47 features):
• Primary and secondary diagnoses (ICD-10 codes, grouped into 18 categories)
• Comorbidity burden (Charlson Comorbidity Index calculation)
• Vital signs at admission and discharge (mean, min, max values)
• Laboratory values: Complete metabolic panel, CBC with differential
• Medication count and high-risk medication flags

Machine Learning Pipeline:
Base Models Evaluated:
• Logistic Regression (baseline clinical model)
• Random Forest (n_estimators=500, max_depth=15)
• Gradient Boosting (XGBoost with hyperparameter tuning)
• Neural Network (3 hidden layers: 128, 64, 32 neurons)

Results and Performance:
• Ensemble Model AUC: 0.887 (95% CI: 0.881-0.893)
• Sensitivity: 82.4% (identifying high-risk patients)
• Specificity: 79.1% (avoiding false alarms)
• Clinical deployment: Integration with Epic EHR system via FHIR API`,

      `Digital Transformation Consulting Proposal
Client: ABC Manufacturing Corp
Proposal Date: March 15, 2025
Project Value: $2.54M over 24 months

Executive Summary
ABC Manufacturing Corp faces critical digital transformation challenges that threaten competitive positioning. Our comprehensive analysis reveals:
• Current digital maturity score: 1.8/5 (below industry average of 2.3/5)
• Legacy ERP system (SAP R/3 from 2008) limiting operational efficiency
• Manual processes consuming 65% of operational resources
• Competitors investing $500K+ annually in digital initiatives

Our Proven Digital Transformation Framework
Phase 1: Foundation and Assessment (Months 1-4)
• Technology infrastructure audit and gap analysis
• Business process mapping using BPMN 2.0 standards
• Current state documentation across 5 departments
• Cloud readiness assessment for AWS migration
• Stakeholder alignment and change management planning

Phase 2: Core Systems Implementation (Months 5-12)
• SAP S/4HANA Cloud deployment with manufacturing modules
• IoT sensor integration: 150 temperature/pressure sensors across 3 production lines
• Real-time dashboard development with 15 critical KPIs
• API-first integration strategy connecting 8 disparate systems

Phase 3: Optimization and Advanced Analytics (Months 13-18)
• Machine learning implementation for predictive maintenance
• Supply chain optimization using constraint-based planning
• Quality prediction algorithms reducing defects by 75%
• Customer behavior analysis improving retention by 8%

Proven Case Studies and Results
Case Study 1: Peterson Industries (Similar Manufacturing Company)
• Challenge: Legacy systems, manual quality control, inventory inaccuracies
• Solution: Complete digital transformation following our framework
• Results: 23% efficiency improvement, $890K annual cost savings, 18-month ROI

Case Study 2: Wilson Manufacturing (Mid-market Competitor)
• Challenge: Disconnected IoT sensors, limited real-time visibility
• Solution: IoT platform implementation with predictive analytics
• Results: 40% reduction in unplanned downtime, 25% improvement in OEE

Financial Impact and ROI Analysis
Investment Breakdown:
• Software licenses and cloud infrastructure: $847,000
• Professional services and implementation: $920,000
• Hardware and IoT sensors: $445,000
• Change management and training: $325,000
• Total Investment: $2,537,000

Projected Annual Benefits:
• Labor cost reduction: $425,000/year (automation and efficiency gains)
• Material cost savings: $315,000/year (inventory optimization, waste reduction)
• Revenue enhancement: $680,000/year (capacity utilization, quality improvements)
• Total Annual Benefits: $1,420,000

ROI Calculations:
• Payback period: 20 months
• 5-year NPV (8% discount): $3,124,000
• Internal Rate of Return: 43.2%

Implementation Timeline and Milestones
Key Deliverables by Quarter:
Q1 2025: Infrastructure setup, team formation, requirements gathering
Q2 2025: ERP system deployment, data migration, user training
Q3 2025: IoT implementation, dashboard development, process automation
Q4 2025: Advanced analytics, optimization, performance monitoring

Success Metrics and KPIs:
• Overall Equipment Effectiveness: 67% → 82% improvement
• Inventory accuracy: 87% → 99.5% improvement
• Customer on-time delivery: 87% → 96% improvement
• Cost per unit: 12% reduction through efficiency gains

Risk Mitigation Strategy:
• Phased implementation approach minimizing business disruption
• Comprehensive testing environments for all integrations
• 24/7 support during critical migration periods
• Change management program ensuring 95% user adoption

Next Steps:
• Executive approval and budget allocation by March 30
• Project kickoff and team formation by April 15
• Infrastructure assessment completion by May 15
• Go-live milestone achievement by December 2025

Why Choose Our Team:
• 15+ years digital transformation experience
• 89% client satisfaction rate across 127 implementations
• Certified implementation partners: SAP, Microsoft, AWS
• Dedicated project management with agile methodology
• Post-implementation support and optimization services`
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
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
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