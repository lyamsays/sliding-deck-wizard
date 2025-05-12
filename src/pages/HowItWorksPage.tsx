
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      number: 1,
      title: "Paste in your content",
      description: "Bullet points, outlines, or short text — just paste what you have, no formatting required."
    },
    {
      number: 2,
      title: "Our AI drafts full slides",
      description: "The AI organizes your content into slides with appropriate visuals and formatting automatically."
    },
    {
      number: 3,
      title: "Review, refine, and export",
      description: "Make any final adjustments and download as PowerPoint or PDF. That's it!"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">How It Works</span>
            <span className="block text-primary">Simple, Fast, Effective</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Three easy steps from raw content to professional slides
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          {/* Steps */}
          {steps.map((step, index) => (
            <div key={index} className="relative mb-24 last:mb-0">
              <div className="md:flex md:items-center md:gap-8">
                {/* Step number and content - alternating sides */}
                <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                      {step.number}
                    </div>
                    <h2 className="ml-4 text-2xl font-bold text-gray-900">{step.title}</h2>
                  </div>
                  <p className="text-lg text-gray-600 ml-16">{step.description}</p>
                </div>
              </div>
              
              {/* Arrow to next step */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-8">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to try it yourself?</h3>
          <a href="/create" className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
            Create Your First Deck
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
