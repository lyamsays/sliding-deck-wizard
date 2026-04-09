import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="mt-3 text-gray-500 text-sm">Last updated: April 8, 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Overview</h2>
            <p>Sliding.io is operated by Lyam Ouattara ("I", "me", "we"). This Privacy Policy explains what data I collect when you use Sliding.io, how I use it, and your rights regarding that data. Your data is your own. I never sell it.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What I collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Account information</strong> — your email address and password when you sign up</li>
              <li><strong>Presentation content</strong> — text you paste or documents you upload to generate slides, and the slides generated from that content</li>
              <li><strong>Usage data</strong> — basic analytics like pages visited and features used, to understand how the product is being used</li>
              <li><strong>Payment information</strong> — handled entirely by Stripe. I never see or store your credit card details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How I use your data</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and improve the Sliding.io service</li>
              <li>To generate slides from your content via the Anthropic Claude API</li>
              <li>To send transactional emails (account confirmation, subscription receipts)</li>
              <li>To respond to support requests</li>
            </ul>
            <p className="mt-3">I do not use your content to train AI models. I do not share your data with third parties for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Third-party services</h2>
            <p>Sliding.io uses the following third-party services, each with their own privacy policies:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>Supabase</strong> — database and authentication (supabase.com/privacy)</li>
              <li><strong>Anthropic</strong> — AI slide generation; your content is processed per Anthropic's API usage policy (anthropic.com/privacy)</li>
              <li><strong>Stripe</strong> — payment processing (stripe.com/privacy)</li>
              <li><strong>Unsplash</strong> — stock images for slides (unsplash.com/privacy)</li>
              <li><strong>Vercel</strong> — website hosting (vercel.com/legal/privacy-policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data storage and security</h2>
            <p>Your data is stored in Supabase's hosted database with row-level security. Passwords are hashed and never stored in plaintext. All data is transmitted over HTTPS.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your rights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Access</strong> — you can view all your saved decks at any time via My Decks</li>
              <li><strong>Deletion</strong> — you can delete any individual deck at any time. To delete your account and all associated data, email lyam@usesliding.com</li>
              <li><strong>Export</strong> — you can download your presentations as PowerPoint, PDF, or images at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies</h2>
            <p>Sliding.io uses only functional cookies necessary for authentication (session tokens). No tracking or advertising cookies are used.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p>Questions about this Privacy Policy? Email <a href="mailto:lyam@usesliding.com" className="text-primary hover:underline">lyam@usesliding.com</a>.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
