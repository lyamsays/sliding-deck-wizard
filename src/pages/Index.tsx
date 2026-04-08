
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import ProfessionalFeatures from '../components/landing/ProfessionalFeatures';
import ComparisonSection from '../components/landing/ComparisonSection';
import QuickStart from '../components/landing/QuickStart';

const Index = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <QuickStart />
        <FeatureShowcase />
        <ProfessionalFeatures />
        <ComparisonSection />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
