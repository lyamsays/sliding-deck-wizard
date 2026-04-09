import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Upload, Wand2, PencilRuler, Download } from 'lucide-react';

const steps = [
  { icon: Upload, step: '01', title: 'Upload or paste your content', desc: 'Drop in a PDF, Word doc, or paste your lecture notes directly. Research papers, syllabi, outlines — anything works. Up to 20MB.' },
  { icon: Wand2, step: '02', title: 'Set your audience and generate', desc: 'Select your role (Professor, TA, K-12 teacher) and your audience (undergrads, PhD students, executives). Pick a slide count and theme. Hit Generate — slides appear in under 30 seconds.' },
  { icon: PencilRuler, step: '03', title: 'Edit, reorder, switch themes', desc: 'Drag slides to reorder, add or delete slides, switch themes live without regenerating. Click any slide to edit bullets or regenerate just that one slide with specific instructions.' },
  { icon: Download, step: '04', title: 'Present or export', desc: 'Click Present for fullscreen mode with speaker notes. Or download as editable PowerPoint (with notes embedded), PDF, or a ZIP of images. Share a public link to let others view the deck.' },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">How it works</h1>
          <p className="text-xl text-gray-500">From your notes to classroom-ready slides in 4 steps</p>
        </div>

        <div className="space-y-6">
          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="flex gap-5 bg-white rounded-2xl border border-gray-100 p-6 hover:border-purple-200 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Icon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-purple-400 tracking-widest mb-1">STEP {step}</div>
                <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">See it in action</h2>
          <p className="text-purple-200 text-sm mb-5">Click "Try Example" on the create page to generate a real deck from psychology lecture notes.</p>
          <Link to="/create" className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-purple-50 transition-colors">
            Generate your first deck →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
