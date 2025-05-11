
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check } from 'lucide-react';

const Features = () => {
  const featureItems = [
    {
      title: "Instantly convert raw ideas into clean, structured slides",
      description: "Transform bullet points, meeting notes, or loose ideas into professionally formatted slides in seconds."
    },
    {
      title: "Smart layout and theme suggestions",
      description: "Our AI automatically recommends the perfect layout and visual theme based on your content type and purpose."
    },
    {
      title: "Visual generation (images, icons, context-aware support)",
      description: "Get relevant visuals suggested for each slide based on content analysis, with easy customization options."
    },
    {
      title: "Simple export to PDF and PowerPoint",
      description: "Download your finished slides in industry-standard formats that work anywhere, preserving all styling and visuals."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Powerful Features for</span>
            <span className="block text-primary">Effortless Presentations</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Everything you need to transform your ideas into professional slides without the hassle.
          </p>
        </div>

        <div className="mt-16">
          {featureItems.map((feature, index) => (
            <div key={index} className="mb-16 border-b border-gray-200 pb-12 last:border-0">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-start">
                    <Check className="text-primary mr-2 h-6 w-6 flex-shrink-0 mt-1" />
                    {feature.title}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 lg:col-span-6">
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 italic">Feature visualization</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
