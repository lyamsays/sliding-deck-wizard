import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Upload, Users, Mic2, Palette, Download, RefreshCw, Play, Link2 } from 'lucide-react';

const features = [
  { icon: Upload, title: "Upload your lecture materials", desc: "PDF, Word, or plain text up to 20MB. Upload a research paper, lecture outline, or syllabus and the AI reads it directly — no copy-pasting." },
  { icon: Users, title: "Audience-aware slide generation", desc: "Set your audience before generating — undergrads, PhD students, high schoolers, executives. The AI adjusts vocabulary, depth, and examples to match who's in the room." },
  { icon: Mic2, title: "Speaker notes that actually help you teach", desc: "Not a repetition of the bullets. Real pedagogical cues: when to pause, which question to ask, an example to tell, a transition to the next slide." },
  { icon: Palette, title: "8 educator themes, instantly switchable", desc: "From clean ivory to editorial obsidian. Switch themes after generating — no regeneration needed, applies instantly to all slides." },
  { icon: RefreshCw, title: "Edit and regenerate individual slides", desc: "Click edit on any slide for quick actions (make concise, add examples, change tone) or a full regenerate with custom instructions. No need to redo the whole deck." },
  { icon: Play, title: "Present mode — teach directly from the app", desc: "Fullscreen keyboard-navigable presentation with a speaker notes panel. Swipe to navigate on mobile. No need to export just to present." },
  { icon: Download, title: "Export in every format you need", desc: "Editable PowerPoint with speaker notes embedded. PDF. Individual slide images as a ZIP. Layouts match what you see in the preview." },
  { icon: Link2, title: "Shareable links — no login required to view", desc: "Every saved deck gets a public URL you can share with students or colleagues. They can view slides and speaker notes, and click to create their own." },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-purple-200">
            Built for professors & educators
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Everything educators actually need
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Not a general-purpose tool repurposed for education. Built from the ground up for how professors prepare and teach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-purple-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/create" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-purple-100">
            Try every feature free →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
