import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Presentation, 
  FileText, 
  BarChart3, 
  Zap, 
  Users, 
  Download,
  Sparkles,
  Clock,
  Target
} from 'lucide-react';

const ProfessionalFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content Generation",
      description: "Transform your ideas into professional presentations instantly with advanced AI",
      benefits: ["Smart content structuring", "Professional tone adaptation", "Industry-specific frameworks"],
      badge: "AI-First"
    },
    {
      icon: Presentation,
      title: "Executive-Ready Templates",
      description: "Access consulting-grade templates designed for boardrooms and client meetings",
      benefits: ["Strategy frameworks", "Financial modeling layouts", "Executive summary formats"],
      badge: "Professional"
    },
    {
      icon: BarChart3,
      title: "Data Visualization Intelligence",
      description: "Automatically generate charts and graphs from your data and insights",
      benefits: ["Smart chart selection", "Professional styling", "Interactive elements"],
      badge: "Analytics"
    },
    {
      icon: FileText,
      title: "Multi-Format Export",
      description: "Export to PowerPoint, PDF, or interactive web presentations",
      benefits: ["Client-ready formats", "Brand consistency", "High-resolution outputs"],
      badge: "Export"
    },
    {
      icon: Zap,
      title: "Rapid Iteration",
      description: "Make changes instantly with AI assistance and real-time preview",
      benefits: ["Live editing", "Version control", "Instant updates"],
      badge: "Speed"
    },
    {
      icon: Users,
      title: "Collaboration Tools",
      description: "Work seamlessly with your team on presentations and projects",
      benefits: ["Real-time collaboration", "Comment system", "Role-based access"],
      badge: "Team"
    }
  ];

  const useCases = [
    {
      title: "Strategy Consulting",
      description: "Create client presentations with frameworks like BCG Matrix, Porter's Five Forces",
      time: "10 min vs 2 hours"
    },
    {
      title: "Academic Research",
      description: "Transform research papers into engaging conference presentations",
      time: "15 min vs 3 hours"
    },
    {
      title: "Board Meetings",
      description: "Executive summaries and strategic updates with professional polish",
      time: "5 min vs 1 hour"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Professional AI Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for the way professionals
            <span className="text-primary"> actually work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From management consultants to university professors, Sliding.io understands your workflow and accelerates your presentation creation
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Use Cases */}
        <div className="bg-card rounded-2xl p-8 mb-16 border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">See the time difference</h3>
            <p className="text-muted-foreground">Real professionals, real time savings</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-secondary/50">
                <h4 className="font-semibold text-lg mb-2">{useCase.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  {useCase.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Ready to transform your presentation workflow?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Join thousands of consultants and professors who've already made the switch
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="font-semibold">
                <Link to="/create">
                  Start Creating Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                See Live Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalFeatures;