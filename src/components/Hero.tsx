
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-primary/20">
              <Sparkles className="h-4 w-4" />
              AI-Powered Presentation Builder
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 animate-fade-up mb-6 leading-tight">
            Create presentations that
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent block mt-2">
              command attention
            </span>
          </h1>
          
          <p className="mt-6 text-xl md:text-2xl text-gray-600 animate-fade-up leading-relaxed max-w-3xl mx-auto">
            Transform your ideas into professional slide decks in seconds. Designed for consultants, professors, and business leaders who demand excellence.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-fade-up">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 transition-all transform hover:scale-105 text-lg px-8 py-6 shadow-lg hover:shadow-xl" 
              asChild
            >
              <Link to="/create" className="flex items-center gap-2">
                Create your first deck
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-lg px-8 py-6 hover:border-primary/30" 
              asChild
            >
              <Link to="/themes" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                View examples
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500 animate-fade-up">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No design skills needed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AI-generated visuals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Professional themes</span>
            </div>
          </div>
        </div>
        
        <div className="mt-20 md:mt-28 max-w-6xl mx-auto animate-fade-up">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-4 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" 
                    alt="Professional presenting to colleagues" 
                    className="w-full h-auto rounded-2xl object-cover shadow-lg"
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    From rough notes to polished presentations
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                      <p className="text-gray-600">Paste your content or upload documents</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                      <p className="text-gray-600">AI generates slides with professional design</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                      <p className="text-gray-600">Auto-generated images and visual elements</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                      <p className="text-gray-600">Export and present with confidence</p>
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
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary/20 to-purple-600/20 opacity-30"></div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-600/20 to-primary/20 opacity-30"></div>
      </div>
    </section>
  );
};

export default Hero;
