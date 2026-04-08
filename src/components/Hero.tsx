import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen, Clock, FileText, GraduationCap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-0">
      <div className="max-w-6xl mx-auto px-4">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium">
            <GraduationCap className="h-3.5 w-3.5" />
            Built for professors & educators
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05] mb-6">
            Turn your lecture notes
            <span className="block" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              into beautiful slides
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Upload your notes, research papers, or syllabus. Get audience-specific slides with educator-quality speaker notes in under 30 seconds.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Button size="lg" asChild className="h-12 px-8 text-base rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200">
            <Link to="/create">
              <Sparkles className="mr-2 h-4 w-4" />
              Try it free — no signup needed
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-12 px-8 text-base rounded-xl border-gray-200">
            <Link to="/create">
              See an example
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Social proof pills */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 text-sm text-gray-400">
          {[
            { icon: Clock, text: 'Slides in under 30 seconds' },
            { icon: FileText, text: 'Upload PDF, Word, or paste notes' },
            { icon: BookOpen, text: 'Speaker notes included' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-purple-400" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Product screenshot mockup — hidden on small screens, shown on md+ */}
        <div className="relative mx-auto max-w-5xl hidden md:block">
          {/* Browser chrome */}
          <div className="rounded-t-2xl bg-gray-100 border border-gray-200 border-b-0 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center border border-gray-200">
              usesliding.com/create
            </div>
          </div>

          {/* Fake app UI */}
          <div className="rounded-b-2xl border border-t-0 border-gray-200 bg-gray-50 overflow-hidden shadow-2xl shadow-purple-100/50" style={{ height: '420px' }}>
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-56 bg-white border-r border-gray-100 p-3 flex flex-col gap-2 flex-shrink-0">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">SLIDES (8)</div>
                {[
                  { title: 'Why Your Brain Forgets', active: true, bg: '#0d1b2a', accent: '#7c3aed' },
                  { title: 'Memory Happens in 3 Stages', active: false, bg: '#0d1b2a', accent: '#7c3aed' },
                  { title: 'Memory Is Reconstruction', active: false, bg: '#0d1b2a', accent: '#7c3aed' },
                  { title: 'You Forget 70% in 24hr', active: false, bg: '#0d1b2a', accent: '#7c3aed' },
                  { title: 'Testing Beats Re-Reading', active: false, bg: '#0d1b2a', accent: '#7c3aed' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-lg overflow-hidden border transition-all ${s.active ? 'ring-2 ring-purple-500 border-purple-300' : 'border-gray-100'}`}>
                    <div className="relative" style={{ backgroundColor: s.bg, aspectRatio: '16/9' }}>
                      <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: s.accent }} />
                      <div className="absolute inset-0 flex items-center p-2">
                        <span className="text-white font-bold leading-tight" style={{ fontSize: '5px' }}>{s.title}</span>
                      </div>
                    </div>
                    <div className="bg-white px-1.5 py-0.5">
                      <span className="text-gray-600 text-xs truncate block" style={{ fontSize: '9px' }}>{i + 1}. {s.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main slide */}
              <div className="flex-1 flex flex-col p-4 gap-3">
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Memory & Learning: The Science of How We Remember</span>
                  <div className="flex gap-2">
                    <div className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg font-medium">▶ Present</div>
                    <div className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg font-medium">Save</div>
                  </div>
                </div>

                {/* Slide preview */}
                <div className="flex-1 rounded-xl overflow-hidden relative" style={{ background: '#0d1b2a' }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#7c3aed' }} />
                  {/* Image right side */}
                  <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=80" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0d1b2a 0%, transparent 60%)' }} />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-center p-6 pr-[44%]">
                    <div className="text-purple-400 font-bold mb-2" style={{ fontSize: '7px', letterSpacing: '0.1em' }}>PSYC 101 · WEEK 7 · DR. SARAH CHEN</div>
                    <div className="text-white font-bold leading-tight mb-3" style={{ fontSize: '16px' }}>Why Does Your Brain Forget Everything?</div>
                    <div className="flex flex-col gap-1.5">
                      {['Encoding: deep processing = 3x better retention', 'Hippocampus consolidates during sleep — not cramming', '70% of wrongful convictions from memory errors'].map((b, i) => (
                        <div key={i} className="flex gap-1.5 items-start">
                          <span className="text-purple-400 font-bold" style={{ fontSize: '7px', marginTop: '1px' }}>▸</span>
                          <span className="text-white opacity-90" style={{ fontSize: '7px', lineHeight: 1.4 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-3 text-white opacity-30 font-mono" style={{ fontSize: '8px' }}>1</div>
                </div>

                {/* Speaker notes */}
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Speaker Notes</div>
                  <p className="text-gray-600" style={{ fontSize: '11px', lineHeight: 1.6 }}>
                    Open with a provocation: ask how many students crammed for their last exam. Tell them that by the end of class, they'll have the cognitive science to study in half the time with better results...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-purple-100/60 via-transparent to-indigo-100/60 blur-2xl" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
