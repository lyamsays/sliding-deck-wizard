import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
          <p className="mt-3 text-gray-500 text-sm">Last updated: April 8, 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Sliding.io ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. These terms apply to all users — free and paid.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. The Service</h2>
            <p>Sliding.io is an AI-powered presentation tool that generates slide decks from user-provided content. The Service is provided by Lyam Ouattara, operating as an individual/sole proprietor.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Accounts</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>One account per person; you may not share accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Your content</h2>
            <p>You retain ownership of all content you upload or paste into Sliding.io (lecture notes, documents, text). By using the Service, you grant Sliding.io a limited license to process your content solely to generate your slides. I do not claim ownership of your content and do not use it to train AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Acceptable use</h2>
            <p>You may not use Sliding.io to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Generate content that is illegal, harmful, abusive, or violates third-party rights</li>
              <li>Attempt to reverse-engineer or scrape the Service</li>
              <li>Circumvent usage limits or access controls</li>
              <li>Use the Service for any commercial purpose beyond creating presentations for your own professional use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Subscriptions and billing</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Free tier</strong> — 3 presentations/month, up to 8 slides, no credit card required</li>
              <li><strong>Educator Pro</strong> — $15/month, billed monthly via Stripe, cancel anytime</li>
              <li>Cancellations take effect at the end of the current billing period; no partial refunds</li>
              <li>All payments are processed by Stripe; I do not store your payment information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual property</h2>
            <p>The Sliding.io name, logo, and product design are owned by Lyam Ouattara. The AI-generated slides are yours — you own the output. Images sourced from Unsplash are subject to the Unsplash License.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Disclaimer of warranties</h2>
            <p>The Service is provided "as is" without warranty of any kind. I do not guarantee uninterrupted access, error-free output, or that AI-generated content will be accurate or suitable for your specific needs. Always review AI-generated slides before presenting them.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Limitation of liability</h2>
            <p>To the fullest extent permitted by law, Lyam Ouattara shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. My total liability to you shall not exceed the amount you paid for the Service in the 3 months preceding any claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Termination</h2>
            <p>I reserve the right to suspend or terminate accounts that violate these Terms. You may delete your account at any time by emailing lyam@usesliding.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Changes to these Terms</h2>
            <p>I may update these Terms from time to time. Significant changes will be communicated via email. Continued use of the Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Governing law</h2>
            <p>These Terms are governed by the laws of the Commonwealth of Massachusetts, without regard to conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contact</h2>
            <p>Questions about these Terms? Email <a href="mailto:lyam@usesliding.com" className="text-primary hover:underline">lyam@usesliding.com</a>.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
