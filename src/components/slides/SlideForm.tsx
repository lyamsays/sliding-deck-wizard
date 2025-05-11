import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader, Sparkles, Palette, ArrowRight, ArrowLeft, FileText, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
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
import { motion } from "framer-motion";
import { extractTextFromFile } from '@/utils/fileExtractors';

interface SlideFormProps {
  isGenerating: boolean;
  error: string | null;
  slideContent: string;
  profession: string;
  purpose: string;
  tone: string;
  generationProgress: number;
  autoGenerateImages: boolean;
  selectedTheme: string;
  framework?: string;
  setSlideContent: (content: string) => void;
  setProfession: (profession: string) => void;
  setPurpose: (purpose: string) => void;
  setTone: (tone: string) => void;
  setAutoGenerateImages: (autoGenerate: boolean) => void;
  setSelectedTheme: (theme: string) => void;
  setFramework?: (framework: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTryExample: () => void;
}

const SlideForm: React.FC<SlideFormProps> = ({
  isGenerating,
  error,
  slideContent,
  profession,
  purpose,
  tone,
  generationProgress,
  autoGenerateImages,
  selectedTheme,
  framework,
  setSlideContent,
  setProfession,
  setPurpose,
  setTone,
  setAutoGenerateImages,
  setSelectedTheme,
  setFramework,
  onSubmit,
  onTryExample
}) => {
  // State to track if we need to show the framework dropdown
  const [showFrameworkDropdown, setShowFrameworkDropdown] = useState(profession === "Consultant");
  
  // New state for the two-step process
  const [currentStep, setCurrentStep] = useState<'metadata' | 'content'>('metadata');
  
  // Toast for notifications
  const { toast } = useToast();
  
  // Update the showFrameworkDropdown state when profession changes
  useEffect(() => {
    setShowFrameworkDropdown(profession === "Consultant");
  }, [profession]);

  const handleNext = () => {
    setCurrentStep('content');
  };

  const handleBack = () => {
    setCurrentStep('metadata');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  // Add file handling function
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'pdf' && fileType !== 'docx') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive"
      });
      return;
    }
    
    // Show loading toast
    toast({
      title: "Processing file",
      description: "Reading content from your file...",
    });
    
    try {
      // Use our new utility function to extract text
      const text = await extractTextFromFile(file);
      setSlideContent(text);
      
      toast({
        title: "File processed",
        description: "Content has been extracted from your file.",
      });
    } catch (error: any) {
      toast({
        title: "Error processing file",
        description: error.message || "Could not read content from your file. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6 animate-fade-down">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmitForm} className="space-y-6 animate-fade-up">
        {/* Step 1: Metadata & Theme Selection */}
        {currentStep === 'metadata' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Step 1: Presentation Setup</h2>
              <p className="text-gray-500 mt-1">Let's start by setting up your presentation details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Select
                    value={profession}
                    onValueChange={(value) => {
                      setProfession(value);
                      // Reset framework if changing away from Consultant
                      if (value !== "Consultant" && setFramework) {
                        setFramework("None");
                      }
                    }}
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
                  <Input
                    id="purpose"
                    placeholder="Enter purpose (e.g., Proposal, Pitch)"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    disabled={isGenerating}
                    className="w-full"
                  />
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

                {/* Framework dropdown - shown only when Consultant is selected */}
                {showFrameworkDropdown && setFramework && (
                  <div className="space-y-2">
                    <Label htmlFor="framework">Consulting Framework</Label>
                    <Select
                      value={framework || "None"}
                      onValueChange={setFramework}
                      disabled={isGenerating}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Consulting Frameworks</SelectLabel>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="BCG Matrix">BCG Matrix</SelectItem>
                          <SelectItem value="SWOT Analysis">SWOT Analysis</SelectItem>
                          <SelectItem value="Porter's Five Forces">Porter's Five Forces</SelectItem>
                          <SelectItem value="Ansoff Matrix">Ansoff Matrix</SelectItem>
                          <SelectItem value="PESTLE Analysis">PESTLE Analysis</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      {framework && framework !== "None" ? 
                        `Your slides will be structured using the ${framework} framework.` : 
                        "Select a framework to structure your presentation slides."}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Presentation Theme</Label>
                  <Select
                    value={selectedTheme}
                    onValueChange={setSelectedTheme}
                    disabled={isGenerating}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Themes</SelectLabel>
                        <SelectItem value="stardust">Stardust (Dark)</SelectItem>
                        <SelectItem value="creme">Crème (Light)</SelectItem>
                        <SelectItem value="minimalist">Minimalist (Light)</SelectItem>
                        <SelectItem value="vortex">Vortex (Dark)</SelectItem>
                        <SelectItem value="lux">Lux (Dark)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Choose a theme to customize your slides.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      asChild
                      className="text-xs"
                    >
                      <Link to="/themes">
                        <Palette className="h-3 w-3 mr-1" />
                        Browse Themes
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <h3 className="font-medium text-sm mb-2">Selected Options</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><span className="font-medium">Profession:</span> {profession || "Not selected"}</li>
                    <li><span className="font-medium">Purpose:</span> {purpose || "Not specified"}</li>
                    <li><span className="font-medium">Tone:</span> {tone || "Not selected"}</li>
                    {showFrameworkDropdown && <li><span className="font-medium">Framework:</span> {framework !== "None" ? framework : "No framework"}</li>}
                    <li><span className="font-medium">Theme:</span> {selectedTheme || "Default"}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                onClick={handleNext} 
                disabled={isGenerating || !profession || !tone}
                className="text-white bg-primary hover:bg-primary/90"
              >
                Continue to Content
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Content Input */}
        {currentStep === 'content' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Step 2: Content Input</h2>
              <p className="text-gray-500 mt-1">Now, let's add your presentation content</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 w-full">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm text-gray-500">Content</label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onTryExample}
                    size="sm"
                    className="text-xs flex items-center gap-1"
                    disabled={isGenerating}
                  >
                    <Sparkles className="h-3 w-3" />
                    Try Example
                  </Button>
                  
                  <div className="relative">
                    <Input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      disabled={isGenerating}
                    />
                    <Button 
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      disabled={isGenerating}
                    >
                      <FileText className="h-3 w-3" />
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>
              <Textarea 
                className="min-h-[300px] w-full bg-white border-0 resize-none focus-visible:ring-1 focus-visible:ring-primary text-base md:text-lg"
                placeholder="Paste your content here... (bullet points, notes, or paragraphs)"
                value={slideContent}
                onChange={(e) => setSlideContent(e.target.value)}
                disabled={isGenerating}
              />
              
              <div className="mt-3 text-xs text-gray-500">
                <p>You can paste text directly or upload a PDF/DOCX file</p>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="auto-generate-images" 
                  checked={autoGenerateImages} 
                  onChange={(e) => setAutoGenerateImages(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
                <label htmlFor="auto-generate-images" className="text-sm text-gray-600">
                  Automatically generate images for slides
                </label>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                disabled={isGenerating}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Setup
              </Button>
              
              <Button 
                type="submit" 
                disabled={isGenerating || !slideContent.trim()}
                className="text-white bg-primary hover:bg-primary/90"
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
            </div>
          </motion.div>
        )}
        
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
      </form>
    </>
  );
};

export default SlideForm;
