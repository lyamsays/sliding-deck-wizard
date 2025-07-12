import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Sparkles, Upload, FileText } from 'lucide-react';

interface ContentInputProps {
  slideContent: string;
  setSlideContent: (content: string) => void;
  profession: string;
  setProfession: (profession: string) => void;
  purpose: string;
  setPurpose: (purpose: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  framework: string;
  setFramework: (framework: string) => void;
  autoGenerateImages: boolean;
  setAutoGenerateImages: (auto: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  onTryExample: () => void;
}

const ContentInput: React.FC<ContentInputProps> = ({
  slideContent,
  setSlideContent,
  profession,
  setProfession,
  purpose,
  setPurpose,
  tone,
  setTone,
  framework,
  setFramework,
  autoGenerateImages,
  setAutoGenerateImages,
  onSubmit,
  isGenerating,
  onTryExample
}) => {
  const quickPrompts = [
    "Create a quarterly business review presentation for executives covering Q3 performance, key metrics, and strategic initiatives for Q4.",
    "Design a research methodology presentation for academic peers explaining our experimental approach, data collection methods, and analysis framework.",
    "Build a client proposal deck showcasing our consulting services, case studies, and implementation timeline for digital transformation.",
    "Develop a product launch presentation for stakeholders including market analysis, competitive positioning, and go-to-market strategy."
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
          Create Your Presentation
        </CardTitle>
        <p className="text-muted-foreground">
          Describe your presentation or paste your content, and our AI will create professional slides
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Quick Setup Row */}
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="profession">Your Role</Label>
              <Select value={profession} onValueChange={setProfession}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultant">Management Consultant</SelectItem>
                  <SelectItem value="Educator">Professor/Educator</SelectItem>
                  <SelectItem value="Executive">Business Executive</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Other">Other Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Presentation purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client Meeting">Client Meeting</SelectItem>
                  <SelectItem value="Board Presentation">Board Presentation</SelectItem>
                  <SelectItem value="Academic Lecture">Academic Lecture</SelectItem>
                  <SelectItem value="Team Update">Team Update</SelectItem>
                  <SelectItem value="Conference Talk">Conference Talk</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-lg font-semibold">
                What would you like to present?
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onTryExample}
                className="text-xs"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Try Example
              </Button>
            </div>
            
            <Textarea
              id="content"
              placeholder="Describe your presentation topic, paste your content, or upload a document..."
              value={slideContent}
              onChange={(e) => setSlideContent(e.target.value)}
              className="min-h-[200px] text-base"
              disabled={isGenerating}
            />
            
            {slideContent.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {slideContent.length} characters • Recommended: 500+ for best results
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          {slideContent.length === 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Or start with a template:
              </Label>
              <div className="grid gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSlideContent(prompt)}
                    className="text-left p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 text-sm transition-colors border border-transparent hover:border-border"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Auto-generate Images</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create relevant images for your slides
                </p>
              </div>
              <Switch
                checked={autoGenerateImages}
                onCheckedChange={setAutoGenerateImages}
              />
            </div>
            
            {profession === "Consultant" && (
              <div className="space-y-2">
                <Label htmlFor="framework">Consulting Framework (Optional)</Label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="BCG Matrix">BCG Growth-Share Matrix</SelectItem>
                    <SelectItem value="Porter's Five Forces">Porter's Five Forces</SelectItem>
                    <SelectItem value="SWOT">SWOT Analysis</SelectItem>
                    <SelectItem value="McKinsey 7S">McKinsey 7S Framework</SelectItem>
                    <SelectItem value="Value Chain">Value Chain Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={!slideContent.trim() || isGenerating}
              className="flex-1 text-lg py-6"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Creating Slides...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Professional Slides
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="sm:w-auto text-lg py-6"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentInput;