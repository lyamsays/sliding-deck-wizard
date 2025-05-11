
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  MessageSquare, 
  AlertCircle,
  ThumbsUp
} from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Get in Touch</span>
            <span className="block text-primary">We'd Love to Hear from You</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Questions, bugs, or partnerships? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <form>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <Button className="w-full" size="lg">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
          
          <div className="flex flex-col space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-lg">Email Us Directly</h3>
                  <p className="text-gray-600 mb-2">
                    For the fastest response, email us at:
                  </p>
                  <a href="mailto:lyam@usesliding.com" className="text-primary hover:underline">
                    lyam@usesliding.com
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-start">
                <ThumbsUp className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-lg">Feedback</h3>
                  <p className="text-gray-600">
                    We're actively improving Sliding.io and your feedback is invaluable to us. Let us know what you think about our product and how we can make it better for you.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-lg">Report an Issue</h3>
                  <p className="text-gray-600">
                    Found a bug? Let us know the details and we'll fix it as soon as possible.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-start">
                <MessageSquare className="h-6 w-6 text-green-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-lg">Business Inquiries</h3>
                  <p className="text-gray-600">
                    Interested in partnering with us or have a business opportunity? We'd love to discuss how we can work together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
