'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQItem } from '@/lib/db';

export function FAQ({ faqs }: { faqs?: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-40 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Common Inquiries</span>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-primary uppercase tracking-tight">
            Everything You Need To Know
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-6">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-none bg-white rounded-[2rem] px-8 py-4 shadow-elevation hover:shadow-elevation transition-all overflow-hidden">
              <AccordionTrigger className="text-xl font-headline font-bold text-primary hover:no-underline text-left py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-lg leading-relaxed font-medium pb-8 pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
