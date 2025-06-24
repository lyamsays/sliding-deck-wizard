
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI-Powered Presentation Builder
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 animate-fade-up mb-6">
            Turn your Ideas into
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent block">
              Beautiful Presentations
            </span>
          </h1>
          
          <p className="mt-6 text-xl md:text-2xl text-gray-600 animate-fade-up leading-relaxed">
            Create professional presentations in minutes with AI-powered content generation, 
            stunning themes, and intelligent design suggestions.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-fade-up">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 transition-all transform hover:scale-105 text-lg px-8 py-6" 
              asChild
            >
              <Link to="/create" className="flex items-center gap-2">
                Start Creating
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/20 text-primary hover:bg-primary/5 transition-all text-lg px-8 py-6" 
              asChild
            >
              <Link to="/themes" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                View Demo
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500 animate-fade-up">
            <span className="font-medium">✨ No design skills required</span>
            <span className="mx-4">•</span>
            <span className="font-medium">🚀 Generate slides in seconds</span>
            <span className="mx-4">•</span>
            <span className="font-medium">🎨 Professional themes included</span>
          </div>
        </div>
        
        <div className="mt-20 md:mt-28 max-w-6xl mx-auto animate-fade-up">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-8">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                alt="Professional team collaborating on presentation" 
                className="w-full h-auto rounded-xl object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary/30 to-blue-600/30 opacity-20"></div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-600/30 to-primary/30 opacity-20"></div>
      </div>
    </section>
  );
};

export default Hero;
