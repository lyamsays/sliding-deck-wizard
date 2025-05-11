
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
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
  onNext
}) => {
  const showFrameworkOption = profession === "Consultant";

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
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Pitch">Pitch / Proposal</SelectItem>
                <SelectItem value="Inform">Informative / Educational</SelectItem>
                <SelectItem value="Update">Project Update</SelectItem>
                <SelectItem value="Report">Report Findings</SelectItem>
                <SelectItem value="Plan">Strategic Planning</SelectItem>
                <SelectItem value="Overview">Overview / Introduction</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Preferred tone?</label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Formal">Formal / Professional</SelectItem>
                <SelectItem value="Friendly">Friendly / Conversational</SelectItem>
                <SelectItem value="Technical">Technical / Detailed</SelectItem>
                <SelectItem value="Persuasive">Persuasive / Compelling</SelectItem>
                <SelectItem value="Creative">Creative / Innovative</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Theme</label>
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
        >
          Next Step <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MetadataStep;
