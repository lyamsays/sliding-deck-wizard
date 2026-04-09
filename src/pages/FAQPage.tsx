import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Do I need to sign up to try it?", a: "No. You can generate your first presentation without creating an account. Sign up only when you want to save your decks." },
  { q: "How does the AI generate the slides?", a: "You provide content (pasted text or an uploaded document) and set your audience and role. The AI structures your content into slides with titles, 3-4 evidence-based bullets per slide, and speaker notes with pedagogical cues — pauses, discussion questions, transitions." },
  { q: "What file types can I upload?", a: "PDF, Word (.docx), and plain text files, up to 20MB. A 100-page research paper PDF is typically 2-5MB, so 20MB covers virtually everything." },
  { q: "Can I edit slides after generating?", a: "Yes, fully. You can edit individual slide content directly, regenerate any single slide with specific instructions, reorder slides by dragging, add or delete slides, and switch themes without regenerating." },
  { q: "What export formats are available?", a: "PowerPoint (.pptx) with speaker notes embedded and editable in PowerPoint. PDF via screenshot for pixel-perfect output. Individual slide images as a ZIP file." },
  { q: "How is Sliding.io different from Gamma?", a: "Gamma is a great general-purpose AI presentation tool. Sliding.io is built specifically for educators — it understands audience types (undergrads vs PhD students), generates pedagogical speaker notes, accepts document uploads, and is priced for individual educators rather than teams." },
  { q: "What's included in the free tier?", a: "3 presentations per month, up to 8 slides per deck, all visual themes, PDF and image export, present mode. No credit card required." },
  { q: "What does Educator Pro include?", a: "Unlimited presentations, up to 15 slides per deck, document upload (PDF/Word), PowerPoint export with speaker notes, shareable deck links, and priority generation speed. $15/month." },
  { q: "Is my content private?", a: "Yes. Your uploaded documents and pasted content are used only to generate your slides and are not stored or shared with third parties. We do not train AI models on your content." },
  { q: "Can students view a deck I share?", a: "Yes. Every saved deck gets a shareable link at usesliding.com/deck/[id]. Anyone with the link can view the slides and speaker notes without logging in." },
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Frequently asked <span className="text-primary">questions</span>
          </h1>
          <p className="text-xl text-gray-500">Everything you need to know about Sliding.io</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-gray-50 last:border-0">
                <AccordionTrigger className="text-left font-medium px-6 py-4 hover:bg-gray-50 text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-3">Still have questions?</p>
          <a href="mailto:lyam@usesliding.com" className="text-primary font-medium hover:underline">
            lyam@usesliding.com
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
