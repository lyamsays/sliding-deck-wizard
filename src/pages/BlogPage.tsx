import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { posts } from '@/data/posts';


const BlogPage = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.includes('@')) return;
    setLoading(true);
    try {
      await supabase.from('newsletter_subscribers').insert({ email, source: 'blog' });
      // Send welcome email via Supabase Edge Function
      supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Welcome to the Sliding.io newsletter',
          html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
            <h2 style="font-size:22px;font-weight:700;color:#1e1b4b;margin-bottom:8px">You're in 🎉</h2>
            <p style="color:#4b5563;line-height:1.6">Thanks for subscribing to the Sliding.io blog. We write about teaching with AI, presentation design for educators, and building tools that actually save professors time.</p>
            <p style="color:#4b5563;line-height:1.6">While you're here — <a href="https://www.usesliding.com/create" style="color:#7c3aed;font-weight:600">try creating a deck from your lecture notes</a>. It takes about 30 seconds.</p>
            <p style="color:#9ca3af;font-size:13px;margin-top:32px">You can unsubscribe any time by replying to this email.</p>
          </div>`
        }
      }).catch(() => {}); // Fire-and-forget, don't block UI
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

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
            <Link to={`/blog/${post.slug}`} key={i} className="block bg-white rounded-2xl border border-gray-100 p-7 hover:border-purple-200 hover:shadow-sm transition-all group">
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
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-purple-50 rounded-2xl p-8 text-center border border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Get new posts by email</h2>
          <p className="text-gray-500 text-sm mb-5">One or two articles a month on education, AI, and teaching strategy. No spam.</p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
              <Check className="h-5 w-5" /> You're subscribed!
            </div>
          ) : (
            <div className="flex max-w-sm mx-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                placeholder="you@university.edu"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleSubscribe}
                disabled={loading || !email.includes('@')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
