import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const testimonials = [
  { quote: "I prepped a full 90-minute lecture on cellular respiration in under 10 minutes. The speaker notes are genuinely useful — not just bullet repetitions.", name: "Dr. M. Thompson", role: "Biology Professor" },
  { quote: "Finally a tool that understands I'm presenting to undergrads, not a sales team. The audience-specific depth adjustment is exactly what I needed.", name: "Prof. J. Okafor", role: "Economics, State University" },
  { quote: "Uploaded my 40-page syllabus and got a full semester overview deck with discussion questions in the notes. Saved me an entire afternoon.", name: "Sarah K.", role: "High School AP Chemistry" },
];

const QuickStart = () => (
  <section className="py-24 bg-white border-t border-gray-100">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-14">
        <div className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-3">What educators say</div>
        <h2 className="text-4xl font-bold text-gray-900">Professors love it</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {testimonials.map(({ quote, name, role }) => (
          <div key={name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-purple-400 text-3xl font-serif leading-none mb-3">"</div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{quote}</p>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{name}</div>
              <div className="text-gray-400 text-xs">{role}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-3">Ready to save hours on every lecture?</h2>
        <p className="text-purple-200 mb-7 text-lg">No signup required. Generate your first deck in 30 seconds.</p>
        <Link to="/create" className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-8 py-3.5 rounded-xl text-base hover:bg-purple-50 transition-colors shadow-lg">
          Create your first presentation
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default QuickStart;
