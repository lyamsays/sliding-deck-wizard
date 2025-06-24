
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lightbulb, FileText, Copy } from 'lucide-react';

interface ContentStepProps {
  content: string;
  setContent: (content: string) => void;
}

const ContentStep: React.FC<ContentStepProps> = ({ content, setContent }) => {
  const handleExampleContent = () => {
    const exampleContent = `Market Analysis Q4 2024

Key findings from our market research

Revenue increased 23% year-over-year
Customer acquisition up 15%
Market share expanded to 18%

Competitive landscape
Three new competitors entered
Pricing pressure in premium segment
Innovation cycle accelerating

Strategic recommendations
Invest in R&D capabilities
Expand international presence
Strengthen customer retention programs

Next steps and timeline
Q1: Launch new product line
Q2: Enter European markets  
Q3: Implement retention strategy`;
    
    setContent(exampleContent);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Paste Your Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExampleContent}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Try Example
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Paste from Clipboard
            </Button>
          </div>

          <Textarea
            placeholder="Paste your notes, bullet points, or outline here. We support:

• Plain text with bullet points
• Meeting notes
• Research findings
• Strategic plans
• Any structured content

Example:
Project Overview
- Budget: $50K
- Timeline: 6 months  
- Team size: 5 people

Key deliverables
- Market analysis
- Product roadmap
- Implementation plan"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] text-base font-mono"
          />
          
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Tips for best results:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use bullet points or numbered lists for structure</li>
              <li>Include section headers to organize content</li>
              <li>Add brief descriptions or details under main points</li>
              <li>The more organized your input, the better the output</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentStep;
