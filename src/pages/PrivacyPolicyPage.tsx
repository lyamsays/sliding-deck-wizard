
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-4 text-gray-500">
            Last updated: May 1, 2025
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <h2>Overview</h2>
          <p>
            At Sliding.io, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          
          <p className="font-bold">
            Your data is your own. We never sell it.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul>
            <li>Create an account</li>
            <li>Use our presentation creation services</li>
            <li>Contact our support team</li>
            <li>Subscribe to our newsletters</li>
          </ul>
          
          <p>
            This information may include:
          </p>
          <ul>
            <li>Your name, email address, and other contact details</li>
            <li>Content you upload to create presentations</li>
            <li>Your preferences and settings</li>
            <li>Feedback and survey responses</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>
            We use your information primarily to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Create and generate presentation content</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Send you technical notices, updates, and administrative messages</li>
            <li>Improve and develop new features and offerings</li>
          </ul>
          
          <h2>Data Retention</h2>
          <p>
            We retain your information as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You can request deletion of your account and associated data at any time.
          </p>
          
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
          
          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal information, including:
          </p>
          <ul>
            <li>The right to access and receive a copy of your data</li>
            <li>The right to rectify or update your data</li>
            <li>The right to delete your data</li>
            <li>The right to restrict processing of your data</li>
          </ul>
          
          <h2>Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicyPage;
