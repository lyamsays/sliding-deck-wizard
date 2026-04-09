import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Real testimonials will be added here as users provide them
const testimonials: { quote: string; name: string; role: string }[] = [];

const QuickStart = () => (
  <section className="py-24 bg-white border-t border-gray-100">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-14">
        <div className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-3">Early access</div>
        <h2 className="text-4xl font-bold text-gray-900">Just launched — try it yourself</h2>
      </div>
      <div className="mb-12 bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
        <p className="text-gray-500 text-sm mb-2">Sliding.io launched in April 2026.</p>
        <p className="text-gray-700 font-medium">Be among the first educators to try it — and share your experience.</p>
        <a href="/create" className="inline-flex items-center gap-2 mt-4 text-purple-600 font-semibold text-sm hover:underline">
          Try it free, no signup needed →
        </a>
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
