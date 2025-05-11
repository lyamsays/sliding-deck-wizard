
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Terms of Service
          </h1>
          <p className="mt-4 text-gray-500">
            Last updated: May 1, 2025
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <p className="lead">
            By using Sliding.io, you agree to the following terms and conditions.
          </p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using our service, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
          
          <h2>2. Use of the Service</h2>
          <p>
            You may not use the service for unlawful or malicious purposes, including but not limited to:
          </p>
          <ul>
            <li>Violating any applicable laws or regulations</li>
            <li>Infringing on intellectual property rights</li>
            <li>Distributing harmful content or malware</li>
            <li>Interfering with the proper functioning of the service</li>
          </ul>
          
          <h2>3. User Content</h2>
          <p>
            You retain rights to your content; we use it only to generate your slides and improve product performance. By submitting content to our service, you grant us a non-exclusive license to use, store, and process that content solely for the purpose of providing and improving our services.
          </p>
          
          <h2>4. Service Availability</h2>
          <p>
            This is an early-stage tool; functionality and availability may change without notice. We strive to provide a reliable service, but we do not guarantee continuous, uninterrupted access to our services.
          </p>
          
          <h2>5. Disclaimer of Warranties</h2>
          <p>
            We do not guarantee error-free outputs — user review is required. Our service is provided "as is" without warranties of any kind, either express or implied.
          </p>
          
          <h2>6. User Feedback</h2>
          <p>
            Feedback submitted may be used to improve the product. By providing feedback, you grant us the right to use that feedback to enhance our services without any obligation to compensate you.
          </p>
          
          <h2>7. Termination</h2>
          <p>
            Access may be revoked at our discretion if terms are violated. We reserve the right to terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason.
          </p>
          
          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Sliding.io shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
          </p>
          
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these terms at any time. It is your responsibility to check our terms periodically for changes.
          </p>
          
          <h2>10. Contact</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p>
            <a href="mailto:lyam@usesliding.com" className="text-primary hover:underline">
              lyam@usesliding.com
            </a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
