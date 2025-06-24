
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <ErrorBoundary>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Create Beautiful Slide Decks with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your ideas into professional presentations in seconds.
            </p>
            <a 
              href="/create" 
              className="btn btn-primary px-6 py-3 text-lg"
            >
              Get Started
            </a>
          </div>
          
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <img 
                src="https://via.placeholder.com/800x450?text=AI+Slide+Generator" 
                alt="AI Slide Generator Demo" 
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

export default Index;
