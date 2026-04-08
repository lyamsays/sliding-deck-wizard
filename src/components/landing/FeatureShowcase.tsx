
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react';

const FeatureShowcase = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional presentations made 
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> effortless</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your expertise into compelling slide decks with AI-powered design and content generation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-100">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Content Creation</h3>
            <p className="text-gray-600 mb-6">
              Our advanced AI understands your content and creates professional slides with compelling narratives and visual suggestions.
            </p>
            <Link to="/create" className="text-purple-600 font-medium flex items-center hover:text-purple-700 transition-colors">
              Try it now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-indigo-100">
            <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600 mb-6">
              Generate complete presentations in under 30 seconds. From rough notes to polished slides instantly.
            </p>
            <Link to="/themes" className="text-purple-600 font-medium flex items-center hover:text-purple-700 transition-colors">
              View themes <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Auto-Generated Visuals</h3>
            <p className="text-gray-600 mb-6">
              Automatically generate professional images for your slides using AI, or choose from curated stock photos.
            </p>
            <Link to="/create" className="text-purple-600 font-medium flex items-center hover:text-purple-700 transition-colors">
              Generate slides <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to transform your presentations?</h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Upload your notes, research papers, or syllabi and get lecture-ready slides in seconds.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-50 text-lg px-8 py-6 rounded-xl"
            asChild
          >
            <Link to="/create" className="flex items-center">
              Start creating for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
