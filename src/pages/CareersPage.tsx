import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Careers at <span className="text-primary">Sliding.io</span>
          </h1>
        </div>

        <div className="bg-purple-50 rounded-2xl p-10 text-center border border-purple-100">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Sliding.io is a solo project — for now</h2>
          <p className="text-gray-600 leading-relaxed max-w-lg mx-auto mb-6">
            I'm Lyam Ouattara, a first-year law student at BU and the sole person building Sliding.io. There are no open positions right now, but I'm always open to conversations with people who are passionate about education and AI.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-lg mx-auto mb-8">
            If you're an educator who wants to help shape the product, a developer who wants to collaborate, or a researcher interested in the intersection of AI and pedagogy — send me a note.
          </p>
          <a
            href="mailto:lyam@usesliding.com"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors"
          >
            <Mail className="h-4 w-4" />
            lyam@usesliding.com
          </a>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">In the meantime, the best way to support Sliding.io is to use it.</p>
          <Link to="/create" className="text-primary font-medium hover:underline text-sm">
            Try it free — no signup needed →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;
