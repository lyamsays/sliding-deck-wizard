
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
    const exampleContent = `Digital Transformation Strategy for Mid-Market Companies

Executive Summary
• 73% of mid-market companies lag behind in digital adoption
• Average ROI of 127% achieved within 18 months of implementation
• Key challenges: legacy systems, workforce training, budget constraints
• Our approach focuses on phased implementation with measurable outcomes

Current State Analysis
• Manual processes account for 65% of operational tasks
• Paper-based workflows still dominant in finance and HR
• Customer touchpoints fragmented across 8 different systems
• Data silos preventing real-time decision making
• IT infrastructure running on 7-year-old hardware

Technology Roadmap
Cloud Migration Strategy
• Move to AWS/Azure hybrid cloud infrastructure
• Implement microservices architecture
• API-first integration approach
• Automated backup and disaster recovery

Digital Platform Implementation
• CRM system integration (Salesforce/HubSpot)
• ERP modernization (SAP S/4HANA or NetSuite)
• Business intelligence dashboard (Tableau/Power BI)
• Employee collaboration tools (Microsoft 365/Slack)

Financial Impact & ROI
Cost-Benefit Analysis
• Initial investment: $2.3M over 24 months
• Projected savings: $890K annually in operational costs
• Revenue increase: 15-20% through improved customer experience
• Break-even point: 18 months

Productivity Gains
• 40% reduction in manual data entry
• 60% faster report generation
• 25% improvement in customer response times
• 30% decrease in IT maintenance costs

Implementation Timeline
Phase 1 (Months 1-6): Foundation
• Infrastructure assessment and cloud migration
• Core team training and change management
• CRM system implementation
• Data migration and cleansing

Phase 2 (Months 7-12): Integration
• ERP system deployment
• API integration between platforms
• Business intelligence setup
• Advanced user training

Phase 3 (Months 13-18): Optimization
• Process automation implementation
• Performance monitoring and tuning
• Advanced analytics and reporting
• Full user adoption and support

Risk Mitigation
Technical Risks
• Legacy system integration challenges
• Data security during migration
• User adoption resistance
• System downtime during transitions

Mitigation Strategies
• Comprehensive testing environments
• Phased rollout approach
• 24/7 support during critical periods
• Change management and training programs

Success Metrics & KPIs
Operational Metrics
• System uptime: 99.9% target
• User adoption rate: 95% within 6 months
• Process automation coverage: 70% of repetitive tasks
• Customer satisfaction score: 8.5/10

Financial Metrics
• Cost reduction: $890K annually
• Revenue growth: 15-20% year-over-year
• ROI achievement: 127% within 18 months
• Payback period: 18 months maximum

Next Steps
Immediate Actions (Next 30 Days)
• Executive approval and budget allocation
• Vendor selection and contract negotiation
• Project team assembly and kick-off
• Detailed project planning and timeline refinement

Long-term Vision
• Establish center of excellence for digital innovation
• Explore AI and machine learning opportunities
• Consider expansion to additional business units
• Develop digital-first culture and capabilities`;
    
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
