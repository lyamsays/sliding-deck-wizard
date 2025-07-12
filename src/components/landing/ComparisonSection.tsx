import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight } from 'lucide-react';

const ComparisonSection = () => {
  const features = [
    { name: "AI-Powered Content Generation", sliding: true, competitors: "Limited" },
    { name: "Professional Consulting Templates", sliding: true, competitors: false },
    { name: "Academic Presentation Formats", sliding: true, competitors: "Basic" },
    { name: "Multi-Format Export (PPT/PDF/Web)", sliding: true, competitors: "Limited" },
    { name: "Real-time Collaboration", sliding: true, competitors: true },
    { name: "Custom Branding & Themes", sliding: true, competitors: "Premium Only" },
    { name: "Strategy Framework Templates", sliding: true, competitors: false },
    { name: "Data Visualization Intelligence", sliding: true, competitors: "Basic" },
    { name: "Speed of Creation", sliding: "10x Faster", competitors: "Standard" },
    { name: "Professional Focus", sliding: true, competitors: "General Use" }
  ];


  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-500" />;
    } else if (value === false) {
      return <X className="h-5 w-5 text-red-400" />;
    } else {
      return <span className="text-sm text-muted-foreground">{value}</span>;
    }
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Competitive Analysis
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why professionals choose
            <span className="text-primary"> Sliding.io</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how we stack up against other presentation platforms when it comes to professional needs
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg mb-16 border">
          <div className="grid grid-cols-3 gap-0">
            {/* Header */}
            <div className="p-6 border-b border-r">
              <h3 className="font-semibold text-lg">Features</h3>
            </div>
            <div className="p-6 border-b border-r bg-primary/5">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-primary">Sliding.io</h3>
                <Badge className="bg-primary text-white">Pro</Badge>
              </div>
            </div>
            <div className="p-6 border-b">
              <h3 className="font-semibold text-lg text-muted-foreground">Other Tools</h3>
            </div>

            {/* Feature Rows */}
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                <div className="p-4 border-r border-b bg-background/50">
                  <span className="text-sm font-medium">{feature.name}</span>
                </div>
                <div className="p-4 border-r border-b bg-primary/5 text-center">
                  {renderFeatureValue(feature.sliding)}
                </div>
                <div className="p-4 border-b text-center">
                  {renderFeatureValue(feature.competitors)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>


        {/* Migration CTA */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to make the switch?
          </h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Join the thousands of consultants, professors, and business leaders who've already upgraded their presentation workflow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" asChild className="font-semibold">
              <Link to="/create">
                Try Sliding.io Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <span className="text-sm opacity-75">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;