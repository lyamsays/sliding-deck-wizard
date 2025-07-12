
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden bg-gradient-to-b from-purple-50 via-white to-purple-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-purple-200">
              <Sparkles className="h-4 w-4" />
              AI-Powered Presentation Builder
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
            Create presentations that
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 bg-clip-text text-transparent block mt-2">
              command attention
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Transform your ideas into professional slide decks in seconds. Designed for consultants, professors, and business leaders who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg">
              <Link to="/create">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Presentation Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 py-6 text-lg rounded-xl">
              <Link to="/how-it-works">
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>No design skills needed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>AI-generated visuals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Professional themes</span>
            </div>
          </div>
        </div>
        
        <div className="mt-20 md:mt-28 max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-white to-purple-100 rounded-2xl blur-3xl opacity-60"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-purple-100 p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" 
                    alt="Professional presenting to colleagues" 
                    className="w-full h-auto rounded-xl object-cover shadow-lg"
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">
                    From rough notes to polished presentations
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3"></div>
                      <p className="text-muted-foreground">Paste your content or upload documents</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3"></div>
                      <p className="text-muted-foreground">AI generates slides with professional design</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3"></div>
                      <p className="text-muted-foreground">Auto-generated images and visual elements</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3"></div>
                      <p className="text-muted-foreground">Export and present with confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-400/30 to-purple-600/20 opacity-30"></div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-400/20 to-purple-400/30 opacity-30"></div>
      </div>
    </section>
  );
};

export default Hero;
