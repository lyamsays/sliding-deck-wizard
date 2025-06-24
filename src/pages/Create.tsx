
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SlideForm from '@/components/slides/SlideForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Presentation, Sparkles, Clock, Users } from 'lucide-react';

const Create = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to slide input page for now (existing functionality)
  const handleGetStarted = () => {
    navigate('/slide-input');
  };

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
            Choose from beautiful themes and let our AI create compelling content for you.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Generate professional slides with intelligent content suggestions
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Save Time</h3>
            <p className="text-sm text-muted-foreground">
              Create presentations in minutes, not hours
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Presentation className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Beautiful Themes</h3>
            <p className="text-sm text-muted-foreground">
              Choose from professionally designed templates
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Collaborate</h3>
            <p className="text-sm text-muted-foreground">
              Share and work together on presentations
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
                Join thousands of professionals who create stunning presentations with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Presentation className="mr-2 h-5 w-5" />
                  Create Your First Presentation
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/themes')}
                >
                  Browse Themes
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
