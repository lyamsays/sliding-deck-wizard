import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Wand2, Presentation, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload your materials',
    desc: 'Drop in a PDF, Word doc, or paste your notes directly. Research papers, syllabi, lecture outlines — anything works. Up to 20MB.',
  },
  {
    icon: Wand2,
    step: '02',
    title: 'AI builds your deck',
    desc: 'Set your audience (undergrads, PhD students, executives), pick a theme, choose slide count. Our AI generates structured slides with speaker notes in seconds.',
  },
  {
    icon: Presentation,
    step: '03',
    title: 'Edit, reorder, present',
    desc: 'Drag to reorder, swap themes live, add or delete slides. Hit Present for fullscreen mode with keyboard navigation and speaker notes.',
  },
  {
    icon: Download,
    step: '04',
    title: 'Export in any format',
    desc: 'Download as editable PowerPoint (with speaker notes embedded), PDF, or individual slide images. Your slides, your format.',
  },
];

const FeatureShowcase = () => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-3">How it works</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">From notes to classroom-ready in 4 steps</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">No design skills needed. No starting from a blank slide. Just your content, transformed.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map(({ icon: Icon, step, title, desc }) => (
          <div key={step} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Icon className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-100">{step}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/create" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-purple-200">
          Try it free →
        </Link>
      </div>
    </div>
  </section>
);

export default FeatureShowcase;
