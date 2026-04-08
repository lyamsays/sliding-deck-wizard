import React from 'react';
import { BookOpen, Users, Mic2, Palette, FileDown, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Knows your audience',
    desc: 'Tell the AI who you\'re presenting to — undergrads, grad students, high schoolers, or executives. Slides adjust vocabulary, depth, and examples accordingly.',
  },
  {
    icon: Mic2,
    title: 'Speaker notes that actually help',
    desc: 'Not a repetition of the bullets. Real pedagogical cues: when to pause, what question to ask, which example to tell, how to transition to the next slide.',
  },
  {
    icon: Users,
    title: 'Every role supported',
    desc: 'Professor, K-12 teacher, adjunct, grad TA, corporate trainer. Each role gets contextually appropriate language, structure, and depth.',
  },
  {
    icon: Palette,
    title: 'Themes that look professional',
    desc: '8+ educator themes from minimal ivory to editorial obsidian. Switch themes after generating — no regeneration needed, instant preview.',
  },
  {
    icon: FileDown,
    title: 'Export for how you teach',
    desc: 'Editable PowerPoint with speaker notes embedded. PDF for sharing. Image ZIP for LMS uploads. Everything professors actually need.',
  },
  {
    icon: RefreshCw,
    title: 'Varied, never repetitive',
    desc: 'Layouts rotate intelligently: image-right, image-left, full-bleed, text-only, centered. Every deck looks different even with the same theme.',
  },
];

const ProfessionalFeatures = () => (
  <section className="py-24 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-3">Built for the classroom</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything professors actually need</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">Not a general-purpose tool repurposed for education. Built from the ground up for how professors prepare and teach.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-4 transition-colors">
              <Icon className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProfessionalFeatures;
