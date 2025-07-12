
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
    const exampleContent = `Digital Transformation Strategy for Mid-Market Manufacturing Companies
Prepared for: ABC Manufacturing Corp. Board of Directors
Presentation Date: March 15, 2025
Confidential

Executive Summary - Current Digital Maturity Assessment
• Industry benchmark: Manufacturing companies average 2.3/5 digital maturity score
• ABC Manufacturing current score: 1.8/5 (below industry average)
• Key gaps identified: legacy ERP system (SAP R/3 from 2008), manual quality control processes, disconnected IoT sensors
• Competitive threat: 73% of mid-market manufacturers investing $500K+ annually in digital initiatives
• Market opportunity: Companies completing digital transformation see average 23% efficiency gains and 18% revenue growth within 24 months

Current State Analysis - Technology Infrastructure Audit
Legacy Systems Inventory:
• ERP: SAP R/3 system implemented 2008, last updated 2019, running on Windows Server 2016
• Manufacturing Execution System (MES): Custom-built system from 2012, no cloud integration
• Quality Management: Paper-based inspection forms, Excel spreadsheets for tracking defects
• Inventory Management: Barcode scanning with 3 separate databases not synchronized
• Financial Reporting: Manual month-end close taking 8-12 days, limited real-time visibility

Operational Pain Points Discovered:
• Production planning: 4 hours daily spent manually consolidating data from 6 different systems
• Quality control: Average 2.3 hours to investigate defect root cause due to data silos
• Customer orders: 15-minute average response time for order status inquiries
• Inventory accuracy: 87% accuracy rate, industry best practice is 99.5%
• Supplier communication: Email and phone-based, causing 23% of delivery delays

Technology Architecture - Proposed Future State
Cloud Infrastructure Migration (AWS):
• Primary region: US-East-1 (Virginia) for latency optimization
• Secondary region: US-West-2 (Oregon) for disaster recovery
• Compute: EC2 instances - 12x m5.xlarge for production workloads
• Storage: S3 for document management, EBS for database storage
• Database: Amazon RDS PostgreSQL 14.2 for transactional data, Redshift for analytics
• Networking: VPC with 3 availability zones, Direct Connect for on-premise integration

Enterprise Applications Roadmap:
• ERP Replacement: SAP S/4HANA Cloud implementation with manufacturing add-ons
• MES Upgrade: Siemens Opcenter MES with real-time production monitoring
• Quality Management: Statistical Process Control (SPC) software integrated with IoT sensors
• Business Intelligence: Microsoft Power BI Premium with real-time dashboards
• Document Management: SharePoint Online with automated workflow approvals

IoT and Industry 4.0 Implementation:
• Smart sensors: 150 temperature/pressure sensors across 3 production lines
• Machine connectivity: OPC-UA protocol integration for 25 CNC machines and 8 injection molding machines
• Predictive maintenance: Azure IoT Hub processing 2.5 million data points daily
• Digital twins: 3D models of production lines for simulation and optimization
• Edge computing: 5 Azure Stack Edge devices for real-time processing

Financial Analysis - Investment and ROI Calculations
Total Investment Breakdown (24-month implementation):
• Software licenses and subscriptions: $847,000
  - SAP S/4HANA Cloud: $285,000 (45 users × $189/month × 24 months + setup)
  - Microsoft Azure infrastructure: $312,000 (monthly consumption estimated)
  - IoT platform and analytics: $180,000
  - Integration middleware: $70,000
• Professional services and implementation: $920,000
  - SAP implementation partner: $485,000
  - System integration: $275,000
  - Change management and training: $160,000
• Hardware and infrastructure: $445,000
  - IoT sensors and edge devices: $285,000
  - Network infrastructure upgrades: $160,000
• Internal resources (opportunity cost): $325,000
  - IT staff allocation (2.5 FTEs × 18 months): $225,000
  - Business user time for testing/training: $100,000

Projected Annual Benefits (Year 2 and beyond):
• Labor cost reduction: $425,000/year
  - Automated reporting saves 15 hours/week across 8 departments
  - Reduced manual data entry: 25% efficiency gain in production planning
  - Quality inspection automation: 2 FTE reallocation to value-added activities
• Material cost savings: $315,000/year
  - Inventory optimization reducing working capital by $1.2M
  - Waste reduction through predictive quality control: 3.2% material savings
  - Supplier performance management reducing expedited shipping: $85,000
• Revenue enhancement: $680,000/year
  - Faster customer response improving retention by 8%
  - Increased capacity utilization from 78% to 89% through better scheduling
  - Premium pricing for quality certifications enabled by digital traceability

Risk-Adjusted NPV Analysis:
• Total investment: $2,537,000
• Annual benefits: $1,420,000 (recurring)
• Implementation risks adjustment: 15% contingency
• Payback period: 20 months
• 5-year NPV (8% discount rate): $3,124,000
• IRR: 43.2%

Implementation Roadmap - Detailed Project Timeline
Phase 1: Foundation and Assessment (Months 1-4)
Week 1-2: Project kickoff and team formation
• Executive steering committee establishment
• Project management office setup with Microsoft Project integration
• Stakeholder mapping across 5 departments: Production, Quality, Finance, IT, Operations

Week 3-6: Current state documentation and requirements gathering
• Business process mapping using BPMN 2.0 standard
• Data mapping and integration requirements for 14 source systems
• As-is system performance baseline establishment
• User acceptance criteria definition with 35 key users

Week 7-12: Technology vendor selection and contracting
• RFP process for 3 ERP vendors: SAP, Oracle, Microsoft Dynamics
• IoT platform evaluation: AWS IoT Core vs Azure IoT Hub vs Google Cloud IoT
• Integration platform selection: MuleSoft vs Dell Boomi vs Azure Logic Apps
• Contract negotiations and software licensing agreements

Week 13-16: Infrastructure setup and security implementation
• AWS account setup with multi-account strategy
• Active Directory integration with Azure AD Connect
• VPN establishment and firewall configuration
• Penetration testing and vulnerability assessment

Phase 2: Core Systems Implementation (Months 5-12)
Months 5-8: ERP System Deployment
• SAP S/4HANA sandbox environment configuration
• Master data migration: 15,000 material records, 2,300 customer records, 850 supplier records
• Financial configuration: 4 company codes, 12 cost centers, 180 GL accounts
• Manufacturing module setup: 8 work centers, 450 BOMs, 1,200 routing operations
• User acceptance testing with 25 power users across all modules

Months 9-10: IoT Platform and Sensor Installation
• Sensor deployment across 3 production lines with minimal downtime
• OPC-UA gateway configuration for machine connectivity
• Real-time dashboard development in Power BI with 15 KPIs
• Predictive maintenance algorithm training with 2 years historical data

Months 11-12: Integration and Testing
• API development for system-to-system integration (REST/SOAP)
• End-to-end testing scenarios covering 95% of business processes
• Performance testing with 3x normal transaction volume
• Disaster recovery testing with 4-hour RTO requirement

Phase 3: Optimization and Expansion (Months 13-18)
Advanced Analytics Implementation:
• Machine learning model development for demand forecasting
• Quality prediction algorithms using historical defect data
• Supply chain optimization using constraint-based planning
• Customer behavior analysis for improved sales forecasting

Process Automation Projects:
• Robotic Process Automation (RPA) for accounts payable: 85% of invoices automated
• Automated quality reporting reducing manual effort by 12 hours/week
• Self-service customer portal for order tracking and delivery scheduling
• Automated procurement workflows for MRO items under $500

Change Management - Cultural Transformation Strategy
Leadership Engagement Program:
• Executive sponsorship with CEO as primary champion
• Department head accountability metrics tied to adoption rates
• Monthly steering committee meetings with progress dashboards
• Success story communication through company newsletter and town halls

Training and Development Initiative:
• Role-based training curriculum for 127 employees across 5 user types
• Super-user program with 15 power users providing peer support
• E-learning modules with certification requirements
• Hands-on simulation environment for practice without impacting production

Communication Strategy:
• Bi-weekly progress updates via email and intranet
• Lunch-and-learn sessions highlighting benefits and addressing concerns
• Department-specific workshops addressing "what's in it for me"
• Recognition program for early adopters and change champions

Risk Management and Mitigation Strategies
Technical Risk Assessment:
• Data migration risk: Parallel run for 2 months to ensure data integrity
• System integration challenges: Proof of concept for critical interfaces
• Performance degradation: Load testing with 150% expected transaction volume
• Cybersecurity threats: Multi-factor authentication and encryption at rest/transit

Business Continuity Planning:
• Fallback procedures documented for each system migration
• Business process backup plans for 72-hour system outage scenario
• Key user backup training for critical business functions
• Vendor support escalation procedures with 4-hour response SLA

Success Metrics and KPIs - Measurable Outcomes
Operational Excellence Indicators:
• Overall Equipment Effectiveness (OEE): Target improvement from 67% to 82%
• Order fulfillment cycle time: Reduce from 8.5 days to 5.2 days
• Inventory turns: Increase from 6.2x to 8.7x annually
• First-pass quality rate: Improve from 94.2% to 98.5%
• Customer on-time delivery: Increase from 87% to 96%

Financial Performance Metrics:
• Cost per unit: 12% reduction through efficiency gains
• Working capital optimization: $1.2M reduction in inventory carrying costs
• Labor productivity: 18% improvement in revenue per employee
• Gross margin improvement: 2.4 percentage points through waste reduction

Digital Maturity Advancement:
• Real-time data availability: 95% of key metrics updated within 5 minutes
• Automated process coverage: 70% of routine transactions requiring no manual intervention
• Mobile accessibility: 80% of key functions available on mobile devices
• System integration: 90% reduction in manual data transfer between systems

Next Steps and Immediate Actions
30-Day Action Items (March 15 - April 15, 2025):
• Board approval and budget allocation: $2.54M capital expenditure approval
• Project manager assignment: Internal PM with external consultant support
• Steering committee formation: 7 executives committed to monthly meetings
• Vendor selection finalization: SAP implementation partner contract execution
• Infrastructure assessment: Current network capacity evaluation for cloud readiness

60-Day Milestones (by May 15, 2025):
• Project charter approval with scope, timeline, and success criteria
• Team formation: 12 internal resources identified with backfill planning
• AWS account setup with initial security configuration
• Current state documentation: 95% of existing processes mapped and documented
• Pilot area selection: Line 2 injection molding as proof of concept

Long-term Strategic Vision (2025-2027):
• Establish ABC Manufacturing as Industry 4.0 leader in regional market
• Achieve autonomous production capability on 1 production line by 2026
• Implement AI-driven quality prediction reducing defects by 75%
• Expand IoT implementation to supplier ecosystem for supply chain visibility
• Develop digital products and services generating 15% of total revenue by 2027

Competitive Analysis and Market Positioning:
• Primary competitors: Johnson Manufacturing (completed digital transformation 2023), Wilson Industries (currently implementing), Peterson Corp (lagging)
• Technology adoption benchmark: ABC currently 18 months behind industry leaders
• Market differentiation opportunity: First in region to achieve full supply chain digitalization
• Customer expectation evolution: 78% now expect real-time order tracking and delivery updates`;
    
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
