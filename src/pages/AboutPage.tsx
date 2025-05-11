
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Beaker } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">About</span>
              <span className="block text-primary">Sliding.io</span>
            </h1>
          </div>
          
          <div className="prose prose-lg mx-auto">
            <p className="lead text-xl text-gray-600 font-medium">
              Sliding.io was born out of a simple insight: professionals — from consultants to professors — spend far too much time formatting slides instead of focusing on ideas.
            </p>
            
            <div className="my-12 bg-gray-100 rounded-xl p-8">
              <p className="italic text-gray-700">
                "As a pre-law student with a passion for AI and entrepreneurship, I kept hearing the same frustration in conversations with mentors and professors: building presentations is time-consuming, repetitive, and often a barrier to getting real work done."
              </p>
            </div>
            
            <p>
              Sliding.io isn't just another slide tool. It's a purpose-built assistant designed to save time, remove friction, and let professionals focus on what matters — thinking, teaching, advising, and leading.
            </p>
            
            <div className="my-12 bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                <div className="bg-purple-50 rounded-lg p-4 flex items-center justify-center mb-4 md:mb-0">
                  <Beaker className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">No Templates Required</h3>
                  <p className="text-gray-600">
                    Unlike traditional tools, there's no need to wrestle with templates or spend time on manual layout adjustments.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="my-8 text-center">
              <p className="text-xl font-semibold">
                This platform wasn't built for me.<br />
                It was built for you.
              </p>
            </div>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
            <p>
              We're on a mission to give people back the hours they spend wrestling with presentation software, so they can focus on what truly matters: their ideas, their audience, and their impact.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Get in Touch</h2>
            <p>
              If you have thoughts, ideas, or feedback that can help us serve you better, reach out directly:
            </p>
            <p className="my-4">
              <a href="mailto:lyam@usesliding.com" className="text-primary hover:underline font-medium">
                lyam@usesliding.com
              </a>
            </p>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <a href="/create">Try Sliding.io Now</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
