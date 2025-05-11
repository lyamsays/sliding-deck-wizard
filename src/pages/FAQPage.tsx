
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "How does the AI generate slides?",
      answer: "It uses your raw input — whether it's bullet points or brief explanations — and organizes it into slide sections, then suggests visuals and layout automatically."
    },
    {
      question: "Can I export to PowerPoint or PDF?",
      answer: "Yes. You can download slides as either .pptx or .pdf. We're continuing to refine the export quality to match your preview exactly."
    },
    {
      question: "What kind of content should I paste in?",
      answer: "Bullet points, section titles, lesson outlines, or speaker notes work best. The cleaner the input, the sharper the output — but rough drafts are okay too."
    },
    {
      question: "How many slides can I create?",
      answer: "During our early access phase, you can create up to 3 presentations with unlimited slides in each. We'll be introducing paid plans with higher limits soon."
    },
    {
      question: "Can I customize the themes and layouts?",
      answer: "Yes! After the AI generates your initial slides, you can modify themes, layouts, and individual slide elements to match your preferences."
    },
    {
      question: "Is my content private and secure?",
      answer: "Absolutely. We don't store or share your content with third parties. Your data is processed securely and only used to generate your slides."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="block">Frequently Asked</span>
            <span className="block text-primary">Questions</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Everything you need to know about Sliding.io
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-2">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-lg px-6 py-4 hover:bg-gray-50 rounded-md">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            We're here to help. Contact us directly and we'll get back to you as soon as possible.
          </p>
          <a href="mailto:lyam@usesliding.com" className="text-primary hover:text-primary/80 font-medium">
            lyam@usesliding.com
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
