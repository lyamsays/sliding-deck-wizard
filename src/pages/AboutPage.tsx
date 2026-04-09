import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">

        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            About <span className="text-primary">Sliding.io</span>
          </h1>
          <p className="text-xl text-gray-500">
            An AI presentation tool built by an educator, for educators.
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <p className="lead text-xl text-gray-600 font-medium">
            Sliding.io was built around one observation: professors spend enormous amounts of time formatting slides — time that could be spent on research, teaching, or students.
          </p>

          <div className="my-10 bg-purple-50 border border-purple-100 rounded-2xl p-8">
            <p className="italic text-gray-700 text-lg leading-relaxed">
              "I built Sliding.io because I kept watching people in academia — professors, researchers, TAs — spend hours every week wrestling with PowerPoint. The content was already in their heads. The slides were just friction."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                LO
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Lyam Ouattara</div>
                <div className="text-gray-500 text-xs">Founder — Cornell '24, BU Law '27</div>
              </div>
            </div>
          </div>

          <p>
            Sliding.io isn't trying to be Gamma or PowerPoint. It's a tool built specifically for the way educators work — uploading lecture notes, research papers, and syllabi, then getting structured, audience-specific slides with real pedagogical speaker notes in under a minute.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">What makes it different</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3"><Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" /><span><strong>Educator-specific AI</strong> — set your role (Professor, TA, K-12 teacher), your audience (undergrads, PhD students, high schoolers), and the AI adjusts vocabulary, depth, and examples accordingly</span></li>
            <li className="flex items-start gap-3"><Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" /><span><strong>Speaker notes that teach</strong> — not a repetition of the bullets, but actual pedagogical guidance: when to pause, which question to ask, how to transition</span></li>
            <li className="flex items-start gap-3"><Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" /><span><strong>Document upload</strong> — upload a PDF or Word doc up to 20MB and the AI reads it directly, no copy-pasting required</span></li>
            <li className="flex items-start gap-3"><Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" /><span><strong>Real exports</strong> — editable PowerPoint files with speaker notes embedded, not screenshots</span></li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">The mission</h2>
          <p>
            Give professors and educators back the hours they lose to slide formatting every week — so they can spend that time on the work that actually matters.
          </p>

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Get in touch</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Questions, feedback, or ideas for features? I read every email personally.
            </p>
            <a href="mailto:lyam@usesliding.com" className="text-primary font-medium hover:underline">
              lyam@usesliding.com
            </a>
          </div>

          <div className="mt-10 text-center">
            <Link to="/create" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Try Sliding.io free →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
