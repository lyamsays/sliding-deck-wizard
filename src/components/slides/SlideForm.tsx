
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader, Sparkles, Palette } from "lucide-react";
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
  
  // Update the showFrameworkDropdown state when profession changes
  useEffect(() => {
    setShowFrameworkDropdown(profession === "Consultant");
  }, [profession]);

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6 animate-fade-down">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6 animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Theme Selection */}
        <div className="border border-dashed border-gray-200 rounded-md p-4 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Presentation Theme</Label>
              <Select
                value={selectedTheme}
                onValueChange={setSelectedTheme}
                disabled={isGenerating}
              >
                <SelectTrigger className="w-full md:w-[200px]">
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
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              asChild
              className="text-sm flex items-center gap-1"
              disabled={isGenerating}
            >
              <Link to="/themes">
                <Palette className="h-4 w-4" />
                Browse All Themes
              </Link>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Choose a theme to customize the look and feel of your slides.
          </p>
        </div>

        {/* Framework dropdown - shown only when Consultant is selected */}
        {showFrameworkDropdown && setFramework && (
          <div className="border border-dashed border-gray-200 rounded-md p-4 bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="framework">Select a Framework</Label>
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
              <p className="text-xs text-gray-500 mt-1">
                {framework && framework !== "None" ? 
                  `Your slides will be structured using the ${framework} framework.` : 
                  "Select a framework to structure your presentation slides."}
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm text-gray-500">Content</label>
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
          </div>
          <Textarea 
            className="min-h-[300px] w-full bg-white border-0 resize-none focus-visible:ring-1 focus-visible:ring-primary text-base md:text-lg"
            placeholder="Paste your content here... (bullet points, notes, or paragraphs)"
            value={slideContent}
            onChange={(e) => setSlideContent(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-2">
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
        </div>
      </form>
    </>
  );
};

export default SlideForm;
