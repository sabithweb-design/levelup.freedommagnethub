
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need prior experience to join?",
    answer: "While some basic understanding is helpful, our program is designed to take you from foundational concepts to advanced architecture. We provide a 'Bridge Module' for those just starting out."
  },
  {
    question: "How long do I have access to the materials?",
    answer: "You get lifetime access! This includes all video lessons, project files, and any future updates we make to the course content as technologies evolve."
  },
  {
    question: "Is there a certification upon completion?",
    answer: "Yes, once you complete all modules and the capstone project, you will receive a verified Freedom Magnet Hub Certificate of Excellence that you can display on LinkedIn."
  },
  {
    question: "What if I get stuck during the course?",
    answer: "We have a dedicated Discord community and a support ticket system where our mentors and fellow students are active 24/7 to help you troubleshoot any issues."
  },
  {
    question: "Do you offer a refund policy?",
    answer: "We stand by our content. If you've completed less than 20% of the course and find it's not a fit within the first 14 days, we offer a full, no-questions-asked refund."
  }
];

export function FAQ() {
  return (
    <section className="py-32 px-6 bg-muted/20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Common Questions</span>
          <h2 className="text-4xl md:text-5xl font-headline font-black text-primary uppercase tracking-tight">
            Everything You Need To Know
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-none bg-white rounded-2xl px-6 py-2 shadow-sm shadow-primary/5 overflow-hidden">
              <AccordionTrigger className="text-lg font-headline font-bold text-primary hover:no-underline text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed font-medium pb-6 pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
