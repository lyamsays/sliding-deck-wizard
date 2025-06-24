
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProfessionalShowcase = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Strategy Consultant",
      company: "McKinsey & Company",
      quote: "This tool has revolutionized how I create client presentations. What used to take hours now takes minutes.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786"
    },
    {
      name: "Prof. Michael Rodriguez",
      role: "Business Professor",
      company: "Stanford Graduate School",
      quote: "Perfect for academic presentations. The AI understands complex concepts and creates clear, engaging slides.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      name: "Jennifer Kim",
      role: "Senior Consultant",
      company: "Deloitte",
      quote: "The auto-image generation feature saves me so much time. Professional visuals without the design headache.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by top professionals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From management consultants to university professors, professionals choose our platform for creating impactful presentations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-gray-600">Presentations Created</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-gray-600">Consultants</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-gray-600">Universities</div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            asChild
          >
            <Link to="/create">
              Join thousands of professionals
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalShowcase;
