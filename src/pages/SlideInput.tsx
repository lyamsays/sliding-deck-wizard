
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SlideInput = () => {
  const [slideContent, setSlideContent] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Content submitted:', slideContent);
    // Here you would typically handle the API call to generate slides
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Turn Your Ideas Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Slides</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Paste your notes or bullet points below. We'll handle the rest.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <Textarea 
                className="min-h-[300px] w-full bg-white border-0 resize-none focus-visible:ring-1 focus-visible:ring-primary text-base md:text-lg"
                placeholder="Paste your content here... (bullet points, notes, or paragraphs)"
                value={slideContent}
                onChange={(e) => setSlideContent(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col items-center">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-primary hover:bg-primary/90 transition-all px-8 py-6 text-lg"
              >
                Generate Slides
              </Button>
              
              <p className="mt-4 text-sm text-gray-500 italic">
                Slide previews will appear after generation.
              </p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SlideInput;
