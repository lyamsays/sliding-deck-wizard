
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';

const ProfessionalShowcase = () => {
  const useCases = [
    {
      icon: Briefcase,
      title: "Management Consultants",
      description: "Create client-ready presentations with structured analysis and professional visuals",
      features: ["Strategy frameworks", "Data visualization", "Executive summaries"]
    },
    {
      icon: GraduationCap,
      title: "Professors & Educators",
      description: "Develop engaging course materials and academic presentations effortlessly",
      features: ["Lecture slides", "Research presentations", "Student materials"]
    },
    {
      icon: TrendingUp,
      title: "Business Leaders",
      description: "Transform business insights into compelling presentations for stakeholders",
      features: ["Board presentations", "Team updates", "Strategy decks"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built for professionals who demand excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a consultant, professor, or business leader, our platform adapts to your professional needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <useCase.icon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
              <p className="text-gray-600 mb-6">{useCase.description}</p>
              <div className="space-y-2">
                {useCase.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProfessionalShowcase;
