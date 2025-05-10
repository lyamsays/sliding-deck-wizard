
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative py-12 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 animate-fade-in">
            From Idea to Deck <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">in Seconds</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 animate-fade-up">
            Transform your notes, bullet points, and raw content into beautiful, structured slide decks using AI — no design skills required.
          </p>
          <div className="mt-10 flex justify-center gap-4 animate-fade-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90 transition-all">
              Try the Demo
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-accent transition-all">
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 max-w-5xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-up">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
            alt="Professional team collaborating on presentation" 
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>
      </div>
      
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10"></div>
      </div>
    </section>
  );
};

export default Hero;
