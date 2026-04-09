import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const posts = [
  {
    title: "Why Professors Spend 4 Hours a Week on Slides (And How to Get That Time Back)",
    excerpt: "A survey of 200 educators found the average professor spends between 3-5 hours per week creating and updating presentation materials. Here's the breakdown — and what to do about it.",
    date: "April 8, 2026",
    readTime: "5 min read",
    category: "Educator Productivity",
    slug: "professor-slide-time"
  },
  {
    title: "The Testing Effect: Why Your Slides Should Generate Discussion, Not Just Transfer Information",
    excerpt: "Cognitive science research consistently shows that retrieval practice beats passive re-reading. Here's how to design slides that force active recall — and why your speaker notes matter more than your bullets.",
    date: "April 3, 2026",
    readTime: "7 min read",
    category: "Teaching & Learning",
    slug: "testing-effect-slides"
  },
  {
    title: "Behind Sliding.io: How I Built an AI Presentation Tool for Professors in Law School",
    excerpt: "I'm a first-year law student at BU who graduated from Cornell last year. This is the story of why I built Sliding.io, what I got wrong the first three times, and what the product looks like today.",
    date: "March 28, 2026",
    readTime: "8 min read",
    category: "Company",
    slug: "behind-sliding-io"
  },
  {
    title: "Spaced Repetition, Forgetting Curves, and What They Mean for Lecture Design",
    excerpt: "Ebbinghaus showed we forget 70% of new information within 24 hours. The implications for how professors structure lectures — and the slides within them — are significant and underappreciated.",
    date: "March 20, 2026",
    readTime: "6 min read",
    category: "Teaching & Learning",
    slug: "spaced-repetition-lectures"
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            The <span className="text-primary">Sliding.io</span> Blog
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Writing on education, cognitive science, teaching strategy, and building Sliding.io.
            <br />
            <span className="text-sm mt-1 block">By <a href="/about" className="text-primary hover:underline">Lyam Ouattara</a></span>
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post, i) => (
            <article key={i} className="bg-white rounded-2xl border border-gray-100 p-7 hover:border-purple-200 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{post.category}</span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </div>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-1 text-sm text-primary font-medium">
                Read more <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-purple-50 rounded-2xl p-8 text-center border border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Get new posts by email</h2>
          <p className="text-gray-500 text-sm mb-5">One or two articles a month on education, AI, and teaching strategy. No spam.</p>
          <div className="flex max-w-sm mx-auto gap-2">
            <input type="email" placeholder="you@university.edu" className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">Subscribe</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
