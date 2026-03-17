
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
