import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  FileText, 
  Upload, 
  ArrowRight,
  Lightbulb,
  Clock,
  Zap,
  Brain,
  X
} from 'lucide-react';

const InstantCreator = () => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'upload' | 'template'>('prompt');
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const promptSuggestions = [
    "Create a presentation about sustainable business practices for executives",
    "Build a lecture on machine learning fundamentals for computer science students",
    "Make a quarterly financial review presentation for board members",
    "Design a product launch presentation for stakeholders"
  ];

  const templates = [
    {
      id: 'consulting',
      title: 'Strategy Consulting',
      description: 'BCG Matrix, Porter\'s Five Forces, SWOT Analysis',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop',
      slides: 15,
      category: 'Business'
    },
    {
      id: 'academic',
      title: 'Research Presentation',
      description: 'Literature review, methodology, findings',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
      slides: 20,
      category: 'Academic'
    },
    {
      id: 'pitch',
      title: 'Startup Pitch Deck',
      description: 'Problem, solution, market, traction',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop',
      slides: 12,
      category: 'Startup'
    }
  ];

  const handleGenerateFromPrompt = () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPromptText(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <X className="h-5 w-5 mr-2" />
            Back to home
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            Create your presentation in
            <span className="text-primary"> seconds</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose how you'd like to start. Our AI will handle the rest.
          </p>
        </div>

        {/* Method Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-secondary/50 rounded-xl p-1">
            {[
              { id: 'prompt', label: 'AI Prompt', icon: Brain },
              { id: 'template', label: 'Template', icon: Sparkles },
              { id: 'upload', label: 'Upload File', icon: Upload }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'prompt' && (
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Describe Your Presentation
                </CardTitle>
                <p className="text-muted-foreground">
                  Tell us what you want to present and we'll create it for you
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Textarea
                    placeholder="e.g., Create a presentation about renewable energy trends for board members, include market analysis, cost benefits, and implementation timeline..."
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="min-h-[120px] text-lg"
                  />
                </div>

                {/* Quick suggestions */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Quick ideas:</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {promptSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleGenerateFromPrompt}
                  disabled={!promptText.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Creating your presentation...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Presentation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {showPreview && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-green-800 font-medium mb-2">
                      ✨ Preview ready! Your presentation has been created.
                    </div>
                    <Button asChild>
                      <Link to="/slide-input">
                        View & Edit Presentation
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'template' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Choose Your Template</h3>
                <p className="text-muted-foreground">Professional templates designed for your industry</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={template.image} 
                        alt={template.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge>{template.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-2">{template.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{template.slides} slides</span>
                        <Button size="sm" asChild>
                          <Link to={`/create?template=${template.id}`}>
                            Use Template
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/themes">
                    Browse All Templates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <Card className="border-2 border-dashed">
              <CardContent className="p-12 text-center">
                <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Upload Your Content</h3>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Transform your existing documents into professional presentations. 
                  We support Word docs, PDFs, text files, and more.
                </p>
                
                <div className="space-y-4">
                  <Button size="lg" className="w-full max-w-md">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File to Upload
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    Supported formats: .docx, .pdf, .txt, .pptx
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="text-left max-w-md mx-auto">
                  <h4 className="font-semibold mb-3">What happens next?</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      AI analyzes your content (30 seconds)
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Creates professional slide structure
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Applies consistent formatting & design
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick stats at bottom */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-card rounded-xl p-6 shadow-sm">
            <div>
              <div className="text-2xl font-bold text-primary">30s</div>
              <div className="text-sm text-muted-foreground">Avg. creation time</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Professionals trust us</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <div className="text-2xl font-bold text-primary">2M+</div>
              <div className="text-sm text-muted-foreground">Presentations created</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantCreator;