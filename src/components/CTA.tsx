
import React from 'react';
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-accent px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Ready to Create Beautiful Slide Decks?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          The AI presentation tool built specifically for educators and researchers
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 transition-all">
            Try the Demo
          </Button>
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-accent transition-all">
            View Plans
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
