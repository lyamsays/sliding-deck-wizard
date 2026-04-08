import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Sparkles, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// ⚠️  Fill these in from your Stripe dashboard:
// 1. Create a product "Educator Pro" at https://dashboard.stripe.com/products
// 2. Add a recurring monthly price of $15.00
// 3. Copy the price ID (starts with price_) and paste below
const STRIPE_PRICE_ID = 'price_1TK5YuLmA0QjAzumxuF3hKCt';

const FREE_FEATURES = [
  '3 presentations per month',
  'Up to 8 slides per deck',
  'All visual themes',
  'PDF & image export',
  'Present mode',
];

const PRO_FEATURES = [
  'Unlimited presentations',
  'Up to 15 slides per deck',
  'Document upload (PDF, Word — 20MB)',
  'PowerPoint export with speaker notes',
  'All visual themes + future themes',
  'Present mode with speaker notes',
  'Shareable deck links',
  'Priority generation speed',
];

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) { navigate('/sign-up'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: STRIPE_PRICE_ID }
      });
      if (error || !data?.url) throw new Error(error?.message || 'Failed to create checkout');
      window.location.href = data.url;
    } catch (err: any) {
      toast({ title: 'Checkout failed', description: err.message, variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-purple-200">
              <GraduationCap className="h-3.5 w-3.5" /> Simple pricing for educators
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Start free. Upgrade when you need more.</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">No trial, no credit card for the free tier. Upgrade only when you want unlimited decks and document upload.</p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Free</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-400">/ month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Perfect for trying it out</p>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/create" className="block w-full text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-purple-600 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">MOST POPULAR</div>
              <div className="mb-6">
                <div className="text-sm font-semibold text-purple-200 uppercase tracking-wider mb-2">Educator Pro</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$15</span>
                  <span className="text-purple-300">/ month</span>
                </div>
                <p className="text-sm text-purple-200 mt-2">For active educators and professors</p>
              </div>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white">
                    <Check className="h-4 w-4 text-purple-300 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white text-purple-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-purple-50 transition-colors disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? 'Redirecting...' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Common questions</h2>
            <div className="space-y-6">
              {[
                { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your account settings and you keep Pro access until the end of your billing period.' },
                { q: 'What happens to my decks if I downgrade?', a: 'All your decks are preserved. You just won\'t be able to create new ones beyond the free limit.' },
                { q: 'Do you offer institutional or department pricing?', a: 'Yes — email us at hello@usesliding.com for discounted team and department plans.' },
                { q: 'Is there a student discount?', a: 'Students get the free tier which covers most use cases. Email us with your .edu address for a special rate.' },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-gray-100 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
