
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SetupWizard, { SetupData } from '@/components/setup/SetupWizard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Presentation, Sparkles, Clock, Users, ArrowRight, X } from 'lucide-react';

const Create = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSetup, setShowSetup] = useState(true); // Start with setup by default

  const handleGetStarted = () => {
    setShowSetup(true);
  };

  const handleSetupComplete = (data: SetupData) => {
    // Store setup data and navigate to slide generation
    localStorage.setItem('setupData', JSON.stringify(data));
    navigate('/slide-input?autoGenerate=true');
  };

  const handleSetupCancel = () => {
    setShowSetup(false);
  };

  // Allow users to skip setup with a clear opt-out
  const handleSkipSetup = () => {
    setShowSetup(false);
  };

  if (showSetup) {
    return <SetupWizard onComplete={handleSetupComplete} onCancel={handleSetupCancel} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Create Amazing Presentations
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your ideas into professional presentations with AI-powered slide generation. 
            Our guided setup helps you create exactly what you need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Guided Setup</h3>
            <p className="text-sm text-muted-foreground">
              Step-by-step wizard to create the perfect presentation
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Intelligent content generation and visual suggestions
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Presentation className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Professional Themes</h3>
            <p className="text-sm text-muted-foreground">
              Industry-specific themes for every profession
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Easy Export</h3>
            <p className="text-sm text-muted-foreground">
              Share and export in multiple formats
            </p>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/5 to-blue-50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">Ready to Get Started?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Our guided setup will help you create the perfect presentation in just a few steps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  <Presentation className="h-5 w-5" />
                  Start Guided Setup
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/slide-input')}
                >
                  Skip to Advanced Mode
                </Button>
              </div>
              {!user && (
                <p className="text-sm text-muted-foreground mt-4">
                  <Button variant="link" onClick={() => navigate('/sign-up')} className="p-0 h-auto">
                    Sign up for free
                  </Button>
                  {' '}to save and manage your presentations
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Create;
