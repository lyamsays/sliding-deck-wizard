
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MetadataStepProps {
  profession: string;
  purpose: string;
  tone: string;
  selectedTheme: string;
  framework?: string;
  setProfession: (profession: string) => void;
  setPurpose: (purpose: string) => void;
  setTone: (tone: string) => void;
  setSelectedTheme: (theme: string) => void;
  setFramework?: (framework: string) => void;
  isGenerating: boolean;
}

const MetadataStep: React.FC<MetadataStepProps> = ({
  profession,
  purpose,
  tone,
  selectedTheme,
  framework,
  setProfession,
  setPurpose,
  setTone,
  setSelectedTheme,
  setFramework,
  isGenerating
}) => {
  // State to track if we need to show the framework dropdown
  const [showFrameworkDropdown, setShowFrameworkDropdown] = useState(profession === "Consultant");
  
  // Update the showFrameworkDropdown state when profession changes
  useEffect(() => {
    setShowFrameworkDropdown(profession === "Consultant");
  }, [profession]);

  return (
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
  );
};

export default MetadataStep;
