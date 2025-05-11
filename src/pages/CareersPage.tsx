
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase } from 'lucide-react';

const CareersPage = () => {
  const positions = [
    {
      title: "Frontend Developer",
      type: "Full-time",
      location: "Remote",
      description: "We're looking for a frontend developer with experience in React, TypeScript, and modern UI frameworks to help build the next generation of our presentation tool."
    },
    {
      title: "ML Engineer",
      type: "Full-time",
      location: "Remote",
      description: "Join our team to develop and improve the AI behind our slide generation technology. Experience with NLP and content analysis required."
    },
    {
      title: "Product Designer",
      type: "Full-time",
      location: "Remote",
      description: "Help create a seamless, intuitive experience for users turning their content into beautiful presentations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Join Our Team</span>
            <span className="block text-primary">Build the Future of Presentations</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            We're looking for builders, designers, and AI thinkers excited by early-stage product development
          </p>
        </div>

        <div className="bg-primary/5 rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">User-Focused</h3>
              <p className="text-gray-600">We build for real people with real problems, not hypothetical users.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Meaningful Efficiency</h3>
              <p className="text-gray-600">We save people time so they can focus on what matters most to them.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Thoughtful Innovation</h3>
              <p className="text-gray-600">We use AI not for its own sake, but to solve genuine pain points.</p>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
          
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                        {position.type}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                        {position.location}
                      </div>
                    </div>
                    <p className="text-gray-600">{position.description}</p>
                  </div>
                  <Button className="whitespace-nowrap">Apply Now</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mt-8 border border-gray-200">
            <h3 className="text-lg font-medium mb-2">Don't see a role that fits?</h3>
            <p className="text-gray-600 mb-4">
              We're always interested in meeting talented people. Send your resume and tell us why you're interested in Sliding.io.
            </p>
            <Button variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Interested in working with us?</h2>
          <p className="text-gray-600 mb-6">
            Reach out directly to start the conversation:
          </p>
          <a href="mailto:lyam@usesliding.com" className="text-primary hover:underline font-medium">
            lyam@usesliding.com
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareersPage;
