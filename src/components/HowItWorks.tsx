
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Paste Your Content",
      description: "Upload or paste your notes, bullet points, or any raw content you have.",
    },
    {
      number: "02",
      title: "AI Processing",
      description: "Our AI analyzes your content, organizes it logically, and applies design best practices.",
    },
    {
      number: "03",
      title: "Get Your Slide Deck",
      description: "Download your beautifully formatted slide deck ready for your next presentation.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary px-4" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Sliding.io Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creating professional slide decks has never been easier
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 right-0 w-1/2 h-1 border-t-2 border-dashed border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
