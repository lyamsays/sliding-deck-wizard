
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, HelpCircle } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { themes } from '@/components/themes/theme-data';
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ThemePreview from '@/components/themes/ThemePreview';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MetadataStepProps {
  profession: string;
  purpose: string;
  tone: string;
  framework?: string;
  autoGenerateImages: boolean;
  selectedTheme: string;
  setProfession: (profession: string) => void;
  setPurpose: (purpose: string) => void;
  setTone: (tone: string) => void;
  setFramework?: (framework: string) => void;
  setAutoGenerateImages: (autoGenerate: boolean) => void;
  setSelectedTheme: (theme: string) => void;
  onNext: () => void;
  isGenerating: boolean;
}

interface ToneOption {
  value: string;
  label: string;
  description: string;
}

const MetadataStep: React.FC<MetadataStepProps> = ({
  profession,
  purpose,
  tone,
  framework,
  autoGenerateImages,
  selectedTheme,
  setProfession,
  setPurpose,
  setTone,
  setFramework,
  setAutoGenerateImages,
  setSelectedTheme,
  onNext,
  isGenerating
}) => {
  const navigate = useNavigate();
  const showFrameworkOption = profession === "Consultant";
  const [showThemePreview, setShowThemePreview] = useState(true);

  // Framework options for consultants
  const frameworkOptions = [
    { value: "None", label: "None" },
    { value: "SWOT", label: "SWOT Analysis" },
    { value: "Porter", label: "Porter's Five Forces" },
    { value: "BCG", label: "BCG Matrix" },
    { value: "PESTEL", label: "PESTEL Analysis" },
    { value: "ValueChain", label: "Value Chain Analysis" },
    { value: "FourPs", label: "Marketing Mix (4Ps)" },
    { value: "BalancedScorecard", label: "Balanced Scorecard" }
  ];

  // Tone options with descriptions
  const toneOptions: ToneOption[] = [
    { 
      value: "Professional", 
      label: "Professional", 
      description: "Clear, concise slides with formal language and corporate-friendly visuals" 
    },
    { 
      value: "Persuasive", 
      label: "Persuasive", 
      description: "Action-oriented slides with compelling visuals and strong, motivating language" 
    },
    { 
      value: "Academic", 
      label: "Academic", 
      description: "Detail-rich slides with data-driven content and scientific/educational visuals" 
    },
    { 
      value: "Creative", 
      label: "Creative", 
      description: "Bold, innovative slides with unique layouts and imaginative visuals" 
    },
    { 
      value: "Minimalist", 
      label: "Minimalist", 
      description: "Clean, spacious slides with essential content and elegant, simple visuals" 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-center mb-4">Step 1: Presentation Details</h2>
        <p className="text-muted-foreground text-center mb-6">
          Tell us about your presentation to get better results.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">For what profession?</label>
          <Select value={profession} onValueChange={setProfession}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Consultant">Consultant</SelectItem>
                <SelectItem value="Educator">Educator</SelectItem>
                <SelectItem value="Marketing">Marketing Professional</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
                <SelectItem value="Engineer">Engineer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Researcher">Researcher</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">What's the purpose?</label>
          <Input
            type="text"
            placeholder="e.g., Team update, Client presentation"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            Preferred tone
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="w-80 p-4">
                  <p className="font-medium mb-2">Tone affects your presentation style:</p>
                  <ul className="text-xs space-y-1">
                    {toneOptions.map(option => (
                      <li key={option.value} className="flex">
                        <span className="font-medium w-24">{option.label}:</span> 
                        <span className="text-muted-foreground">{option.description}</span>
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {toneOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block w-full">{option.label}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">{option.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Theme</label>
          <div className="flex flex-col space-y-2">
            <Collapsible
              open={showThemePreview}
              onOpenChange={setShowThemePreview}
              className="w-full"
            >
              <div className="flex gap-2">
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate('/themes')}
                  className="whitespace-nowrap"
                >
                  Browse Themes
                </Button>
              </div>
              <CollapsibleContent className="mt-2">
                <ThemePreview themeId={selectedTheme} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        
        {showFrameworkOption && setFramework && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Consulting Framework</label>
            <Select value={framework} onValueChange={setFramework}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {frameworkOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-generate-images"
            checked={autoGenerateImages}
            onCheckedChange={setAutoGenerateImages}
          />
          <Label htmlFor="auto-generate-images">Auto-generate images</Label>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={onNext} 
          className="btn-enhanced"
          disabled={isGenerating}
        >
          Next Step <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MetadataStep;
