
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const Index = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
