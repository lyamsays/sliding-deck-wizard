
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Server, AlertTriangle } from 'lucide-react';

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Security
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Sliding.io is built with security in mind. We use standard encryption and data handling practices to keep your content safe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start mb-4">
              <Shield className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Data Protection</h2>
            </div>
            <p className="text-gray-700">
              We implement reasonable precautions to protect your information. While we use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security. All data is encrypted both in transit and at rest.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start mb-4">
              <Lock className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Account Security</h2>
            </div>
            <p className="text-gray-700">
              Your account is protected by industry-standard authentication methods. We recommend using strong, unique passwords and enabling two-factor authentication when available to further secure your account.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start mb-4">
              <Server className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Infrastructure</h2>
            </div>
            <p className="text-gray-700">
              Our services run on secure, industry-leading cloud infrastructure with built-in safeguards and regular security updates. We maintain multiple layers of protection to ensure your data remains secure and available.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start mb-4">
              <AlertTriangle className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Vulnerability Management</h2>
            </div>
            <p className="text-gray-700">
              We regularly test our systems for security vulnerabilities and implement patches promptly. Our team stays informed about the latest security threats and best practices to maintain a secure environment.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">Our Security Commitment</h2>
          <p className="text-gray-700 mb-4">
            At Sliding.io, security is not an afterthought—it's built into our development process from the beginning. We are committed to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Protecting your data through encryption and access controls</li>
            <li>Regular security testing and audits</li>
            <li>Promptly addressing security issues</li>
            <li>Maintaining transparency about our security practices</li>
            <li>Continuous improvement of our security measures</li>
          </ul>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Report a Security Issue</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            If you believe you've found a security vulnerability in our service, please report it to us immediately. We appreciate your help in keeping Sliding.io secure.
          </p>
          <a href="mailto:security@usesliding.com" className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
            Contact Security Team
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SecurityPage;
