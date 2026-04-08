import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Sparkles, Upload, FileText, ArrowRight } from 'lucide-react';
import { themes } from '@/components/themes/theme-data';
import ThemePreview from '@/components/themes/ThemePreview';
import DocumentUpload from './DocumentUpload';

interface ContentInputProps {
  slideContent: string;
  setSlideContent: (content: string) => void;
  profession: string;
  setProfession: (profession: string) => void;
  purpose: string;
  setPurpose: (purpose: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  autoGenerateImages: boolean;
  setAutoGenerateImages: (auto: boolean) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  numSlides: number;
  setNumSlides: (n: number) => void;
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
  autoGenerateImages,
  setAutoGenerateImages,
  selectedTheme,
  setSelectedTheme,
  numSlides,
  setNumSlides,
  onSubmit,
  isGenerating,
  onTryExample
}) => {
  const quickPrompts = [
    `Digital Transformation Strategy for Mid-Market Manufacturing Companies
Prepared for: ABC Manufacturing Corp. Board of Directors
Presentation Date: March 15, 2025

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

Financial Analysis - Investment and ROI Calculations
Total Investment Breakdown (24-month implementation):
• Software licenses and subscriptions: $847,000
• Professional services and implementation: $920,000
• Hardware and infrastructure: $445,000
• Internal resources (opportunity cost): $325,000

Projected Annual Benefits (Year 2 and beyond):
• Labor cost reduction: $425,000/year
• Material cost savings: $315,000/year
• Revenue enhancement: $680,000/year

Implementation Timeline:
Phase 1 (Months 1-4): Foundation and Assessment
Phase 2 (Months 5-12): Core Systems Implementation
Phase 3 (Months 13-18): Optimization and Expansion`,
    
    `Quarterly Business Review Q3 2024 - Executive Summary
Prepared for: Board of Directors
Revenue Performance: $47.2M (vs $44.1M target, +7% beat)

Q3 2024 Financial Highlights
Revenue Growth Analysis:
• Total Revenue: $47.2M (+12% YoY, +7% vs target of $44.1M)
• Recurring Revenue: $32.8M (+18% YoY, now 69% of total revenue)
• New Customer Acquisition: 847 new accounts (+23% vs Q3 2023)
• Customer Retention Rate: 94.2% (industry benchmark: 89%)
• Average Deal Size: $28,400 (+15% YoY improvement)

Operating Metrics Performance:
• Gross Margin: 68.4% (vs 65.2% target, +3.2 pts improvement)
• Operating Margin: 22.1% (+4.7 pts YoY expansion)
• EBITDA: $12.3M (+28% YoY growth)
• Free Cash Flow: $8.9M (+35% YoY increase)
• Customer Acquisition Cost (CAC): $1,250 (down 18% from $1,525 in Q2)

Market Position and Competitive Analysis:
• Market share in core segment: 23.4% (+2.1 pts YoY growth)
• Net Promoter Score: 68 (up from 61 in Q2)
• Win rate against top 3 competitors: 72% (vs 65% target)
• Product adoption rate: 89% of customers using 2+ products
• Expansion revenue: $5.2M from existing customers

Q4 2024 Strategic Initiatives:
Product Development Roadmap:
• AI-powered analytics module launch (targeting $2M ARR)
• Mobile app enhancement with offline capabilities
• API marketplace launch for third-party integrations
• Enterprise security certification (SOC 2 Type II completion)

Market Expansion Strategy:
• European market entry: UK and Germany pilot programs
• Vertical expansion: Healthcare and education sectors
• Partnership program: 3 strategic technology integrations
• Sales team expansion: 12 new account executives in Q4

Operational Excellence Projects:
• Customer success platform implementation
• Marketing automation system upgrade
• Supply chain optimization (targeting 15% cost reduction)
• Remote work productivity initiatives

Risk Assessment and Mitigation:
Market Risks:
• Economic downturn impact on enterprise software spending
• Increased competition from venture-backed startups
• Regulatory changes in data privacy (GDPR compliance)

Operational Risks:
• Key talent retention in competitive market
• Technology infrastructure scaling challenges
• Customer concentration (top 10 customers = 34% revenue)

Financial Projections Q4 2024:
• Revenue Target: $52.1M (+10% sequential growth)
• New Customer Target: 950 new accounts
• Gross Margin Target: 69.5%
• Operating Expense Budget: $24.8M
• Headcount Plan: +47 employees across all departments`,

    `Research Methodology: Machine Learning Applications in Predictive Healthcare Analytics
Submitted to: Journal of Medical Informatics
Research Team: Dr. Sarah Chen, Dr. Michael Rodriguez, Dr. Lisa Zhang
Institution: Stanford Medical AI Research Laboratory

Research Objective and Hypothesis
Primary Research Question:
Can ensemble machine learning models predict patient readmission risk within 30 days with accuracy exceeding 85% using electronic health record (EHR) data alone?

Hypothesis:
We hypothesize that a combination of Random Forest, Gradient Boosting, and Neural Network algorithms, trained on structured EHR data including demographics, diagnoses, medications, and laboratory values, will achieve >85% accuracy in predicting 30-day readmission risk, significantly outperforming current clinical prediction tools (LACE score: 68% accuracy).

Literature Review and Research Gap:
• Current prediction models (HOSPITAL score, LACE index) achieve 60-72% accuracy
• Previous ML studies limited by small datasets (<10,000 patients)
• Gap: Lack of real-time implementation in clinical workflow
• Our contribution: Large-scale dataset (127,000 patients) with real-time deployment

Data Collection Methodology
Dataset Composition:
• Source: Multi-hospital EHR system (Epic Systems) across 4 medical centers
• Patient Population: 127,439 adult patients (age ≥18) with index admissions
• Time Period: January 2019 - December 2023 (5-year retrospective study)
• Inclusion Criteria: Minimum 24-hour stay, complete EHR documentation
• Exclusion Criteria: Psychiatric admissions, planned readmissions, transfers

Feature Engineering Process:
Demographic Variables (8 features):
• Age (continuous), Gender (binary), Race/ethnicity (categorical)
• Insurance type (categorical), Marital status (categorical)
• ZIP code-based socioeconomic indicators
• Distance from hospital (calculated using geocoding)
• Primary language (English vs non-English)

Clinical Variables (47 features):
• Primary and secondary diagnoses (ICD-10 codes, grouped into 18 categories)
• Comorbidity burden (Charlson Comorbidity Index calculation)
• Vital signs at admission and discharge (mean, min, max values)
• Laboratory values: Complete metabolic panel, CBC with differential
• Medication count and high-risk medication flags (anticoagulants, opioids)

Healthcare Utilization Variables (12 features):
• Length of stay (hours), ICU stay duration
• Number of previous admissions (12-month lookback)
• Emergency department visits (6-month history)
• Specialist consultations during admission
• Discharge disposition (home, skilled nursing, rehabilitation)

Experimental Design and Machine Learning Pipeline
Data Preprocessing:
• Missing value imputation: MICE (Multiple Imputation by Chained Equations)
• Categorical encoding: One-hot encoding for nominal variables
• Feature scaling: StandardScaler for continuous variables
• Outlier detection: Isolation Forest algorithm (contamination=0.05)
• Class imbalance handling: SMOTE (Synthetic Minority Oversampling Technique)

Model Development Strategy:
Base Models Evaluated:
• Logistic Regression (baseline clinical model)
• Random Forest (n_estimators=500, max_depth=15)
• Gradient Boosting (XGBoost with hyperparameter tuning)
• Support Vector Machine (RBF kernel, gamma optimization)
• Neural Network (3 hidden layers: 128, 64, 32 neurons)

Ensemble Method:
• Stacking ensemble with logistic regression meta-learner
• 5-fold cross-validation for base model training
• Bayesian optimization for hyperparameter tuning (100 iterations)

Model Validation Framework:
Training/Validation/Test Split:
• Training set: 70% (89,207 patients) - 2019-2021 data
• Validation set: 15% (19,116 patients) - 2022 data
• Test set: 15% (19,116 patients) - 2023 data (temporal validation)

Performance Metrics:
• Primary: Area Under ROC Curve (AUC-ROC)
• Secondary: Precision, Recall, F1-score, Specificity
• Clinical relevance: Number needed to evaluate (NNE)
• Calibration: Brier score, Hosmer-Lemeshow test

Statistical Analysis Plan:
• Confidence intervals: Bootstrap resampling (n=1000)
• Significance testing: DeLong test for AUC comparison
• Feature importance: SHAP (SHapley Additive exPlanations) values
• Subgroup analysis: Performance by age groups, comorbidity burden

Results and Performance Evaluation
Model Performance Comparison:
• Ensemble Model AUC: 0.887 (95% CI: 0.881-0.893)
• Random Forest AUC: 0.834 (95% CI: 0.827-0.841)
• XGBoost AUC: 0.841 (95% CI: 0.834-0.848)
• Neural Network AUC: 0.829 (95% CI: 0.822-0.836)
• Logistic Regression AUC: 0.745 (95% CI: 0.737-0.753)
• LACE Score AUC: 0.684 (95% CI: 0.676-0.692)

Clinical Implementation Metrics:
• Sensitivity: 82.4% (identifying high-risk patients)
• Specificity: 79.1% (avoiding false alarms)
• Positive Predictive Value: 34.2% (precision in high-risk alerts)
• Negative Predictive Value: 96.8% (confidence in low-risk predictions)
• Number Needed to Evaluate: 2.9 patients per true positive

Feature Importance Analysis:
Top 10 Predictive Features (SHAP values):
1. Length of stay (SHAP: 0.124)
2. Number of medications at discharge (SHAP: 0.098)
3. Emergency department visits in past 6 months (SHAP: 0.087)
4. Charlson Comorbidity Index (SHAP: 0.076)
5. Serum creatinine level (SHAP: 0.065)

Real-world Deployment and Clinical Integration:
• Integration with Epic EHR system via FHIR API
• Real-time risk scoring within 30 seconds of discharge order
• Clinical decision support alerts for high-risk patients (>0.7 probability)
• Pilot deployment across 2 hospitals with 847 patients
• Nurse navigator intervention for high-risk patients (phone calls within 48 hours)

Discussion and Clinical Implications:
• 23% improvement over current best practice (LACE score)
• Potential to reduce readmissions by 12-15% based on pilot data
• Cost-effectiveness: $2,300 saved per prevented readmission
• Workflow integration challenges: Alert fatigue, physician acceptance
• Future research: Incorporation of social determinants, natural language processing of clinical notes`,

    `Product Launch Strategy: CloudSync Enterprise 2.0
Launch Date: April 15, 2025
Target Market: Mid-market companies (500-5000 employees)
Product Manager: Jessica Martinez | Marketing Lead: David Kim

Market Analysis and Opportunity Assessment
Total Addressable Market (TAM):
• Global enterprise file sync market: $8.3B (2024)
• Projected market growth: 23% CAGR through 2027
• Mid-market segment: $2.1B opportunity
• Geographic focus: North America ($890M), Europe ($520M)

Competitive Landscape Analysis:
Primary Competitors:
• Dropbox Business: 32% market share, pricing $15-25/user/month
• Microsoft OneDrive: 28% market share, bundled with Office 365
• Google Drive Enterprise: 18% market share, integrated with Workspace
• Box: 12% market share, strong enterprise security features

Competitive Advantages:
• 40% faster sync speeds (internal benchmark testing)
• Advanced encryption: Zero-knowledge architecture
• Hybrid cloud deployment options (on-premise + cloud)
• AI-powered duplicate detection and file organization
• Seamless integration with 47 business applications

Target Customer Segmentation:
Primary Segment: Growing Tech Companies (40% of TAM)
• Company size: 500-2000 employees
• IT budget: $2M-8M annually
• Pain points: Data silos, compliance requirements, collaboration inefficiencies
• Decision makers: CTO, IT Director, Security Officer
• Buying process: 3-6 month evaluation, committee decision

Secondary Segment: Professional Services (35% of TAM)
• Company size: 200-1500 employees
• Industries: Legal, accounting, consulting, architecture
• Pain points: Client data security, version control, mobile access
• Decision makers: Managing Partner, IT Manager
• Buying process: 2-4 month evaluation, partner decision

Go-to-Market Strategy
Pricing Strategy:
CloudSync Enterprise 2.0 Tiers:
• Professional: $18/user/month (up to 1TB storage)
• Business: $32/user/month (unlimited storage + advanced features)
• Enterprise: $48/user/month (premium security + dedicated support)
• Custom Enterprise: Contact sales (on-premise deployment)

Launch Pricing Incentives:
• Early adopter discount: 25% off first year for Q2 2025 signups
• Migration assistance: Free data transfer from competitor platforms
• Proof of concept: 30-day free trial with full feature access
• Volume discounts: 15% off for 100+ users, 25% off for 500+ users

Sales and Channel Strategy:
Direct Sales Team:
• 12 inside sales reps (inbound lead qualification)
• 8 field sales executives (enterprise accounts)
• 4 sales engineers (technical demonstrations)
• Target: 147 new customers in first 6 months

Channel Partner Program:
• Technology integrators: 15 certified partners with 20% margin
• Reseller network: 25 regional partners with 25% margin
• Referral program: $500 bounty per qualified lead

Marketing Campaign Strategy:
Pre-Launch Phase (January - March 2025):
• Thought leadership content: 12 whitepapers on enterprise file management
• Webinar series: "Future of Enterprise Collaboration" (targeting 2000 attendees)
• Industry conference presence: RSA Conference, Gartner IT Symposium
• Analyst briefings: Gartner, Forrester, IDC positioning
• Beta customer program: 25 select customers testing and providing testimonials

Launch Phase (April - June 2025):
• Press release and media blitz: TechCrunch, VentureBeat, Forbes
• Product launch event: Virtual event targeting 1500 prospects
• Digital advertising: LinkedIn sponsored content, Google Ads ($150K budget)
• Content marketing: Case studies, ROI calculators, comparison guides
• Trade publication features: CIO Magazine, InformationWeek

Customer Success and Support Strategy:
Onboarding Program:
• Dedicated customer success manager for Enterprise tier
• Implementation timeline: 2-4 weeks average deployment
• Training programs: Administrator certification, end-user workshops
• Success metrics: Time to first value <7 days, user adoption >80% in 30 days

Support Infrastructure:
• 24/7 technical support for Enterprise customers
• Knowledge base with 200+ articles and video tutorials
• Community forum with peer-to-peer support
• Escalation process: L1 (basic), L2 (technical), L3 (engineering)

Success Metrics and KPIs:
Revenue Targets:
• Q2 2025: $2.1M ARR from new customers
• Q3 2025: $4.8M ARR cumulative
• Q4 2025: $7.2M ARR cumulative
• Year 1 Goal: $12M ARR from CloudSync Enterprise 2.0

Customer Acquisition Metrics:
• New customer target: 250 customers in first 12 months
• Average deal size: $45,000 annually
• Sales cycle length: <90 days average
• Customer lifetime value: $180,000 (36-month retention)
• Customer acquisition cost: $8,500 per customer

Product Adoption KPIs:
• Free trial to paid conversion: >18% (industry benchmark: 12%)
• User engagement: >75% monthly active users
• Feature adoption: >60% using advanced collaboration features
• Net Promoter Score: >50 within 6 months
• Customer retention: >92% annual retention rate

Risk Assessment and Mitigation:
Market Risks:
• Economic downturn reducing IT spending
• Increased competition from Microsoft/Google bundling
• Security breaches impacting industry confidence
• Regulatory changes affecting data storage requirements

Product Risks:
• Technical issues during launch affecting performance
• Integration challenges with popular business applications
• User adoption slower than projected
• Competitor feature parity within 12 months

Mitigation Strategies:
• Flexible pricing options for budget-conscious customers
• Strong security messaging and third-party audits
• Comprehensive testing and gradual rollout plan
• Continuous innovation roadmap with quarterly releases`
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
          Create Your Presentation
        </CardTitle>
        <p className="text-muted-foreground">
          Upload your notes, research papers, or lecture materials — or paste text directly. Our AI will generate audience-specific slides with speaker notes.
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
                  <SelectItem value="Professor">Professor / Lecturer</SelectItem>
                  <SelectItem value="K-12 Teacher">K-12 Teacher</SelectItem>
                  <SelectItem value="Researcher">Researcher</SelectItem>
                  <SelectItem value="Corporate Trainer">Corporate Trainer</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Audience</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Who are you presenting to?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduates">Undergraduates</SelectItem>
                  <SelectItem value="Graduate Students">Graduate Students</SelectItem>
                  <SelectItem value="PhD Students">PhD Students</SelectItem>
                  <SelectItem value="High School Students">High School Students</SelectItem>
                  <SelectItem value="Middle School Students">Middle School Students</SelectItem>
                  <SelectItem value="Corporate Professionals">Corporate Professionals</SelectItem>
                  <SelectItem value="Executive Leadership">Executive Leadership</SelectItem>
                  <SelectItem value="General Audience">General Audience</SelectItem>
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
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Conversational">Conversational</SelectItem>
                  <SelectItem value="Engaging">Engaging</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Document Upload */}
          <DocumentUpload
            onContentExtracted={(content) => setSlideContent(content)}
            disabled={isGenerating}
          />

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
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {slideContent.length} characters
                </span>
                <span className={`font-medium ${
                  slideContent.length > 500 ? 'text-green-600' : 
                  slideContent.length > 200 ? 'text-blue-600' : 
                  'text-orange-600'
                }`}>
                  {slideContent.length > 500 ? '✓ Optimal for best results' : 
                   slideContent.length > 200 ? '👍 Good length' : 
                   '💡 Add more detail for better slides'}
                </span>
              </div>
            )}
          </div>


          {/* Slide count selector */}
          <div className="space-y-2">
            <Label className="font-medium text-sm">Number of Slides</Label>
            <div className="flex gap-2">
              {[6, 8, 10, 12, 15].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNumSlides(n)}
                  className="flex-1 py-2 rounded-lg border text-sm font-medium transition-all"
                  style={numSlides === n
                    ? { backgroundColor: '#7c3aed', color: '#ffffff', borderColor: '#7c3aed' }
                    : { borderColor: '#e5e7eb', backgroundColor: 'transparent' }
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex-1">
                <Label className="font-semibold text-base cursor-pointer">Auto-generate Images</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically create relevant images for your slides
                </p>
              </div>
              <div className="ml-4">
                <Switch
                  checked={autoGenerateImages}
                  onCheckedChange={setAutoGenerateImages}
                  className="scale-125 border-2 border-purple-400 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-background"
                />
              </div>
            </div>
            
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="font-medium">Presentation Theme</Label>
              <p className="text-sm text-muted-foreground">
                Choose a visual style for your presentation
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[...themes.filter(t => t.categories.includes('educator')), ...themes.filter(t => !t.categories.includes('educator'))].slice(0, 9).map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                      selectedTheme === theme.id
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <ThemePreview themeId={theme.id} />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {theme.name}
                      </div>
                    </div>
                    {selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={!slideContent.trim() || isGenerating}
              className="w-full max-w-md text-lg py-6"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Creating your presentation...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Professional Slides ({slideContent.length > 500 ? 'Optimal' : slideContent.length > 200 ? 'Good' : 'Basic'} quality)
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentInput;