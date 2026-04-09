'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQItem } from '@/lib/db';

interface FAQProps {
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function FAQ({ faqs, title = 'Essential Inquiries', subtitle = 'Clarifications' }: FAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 md:py-40 px-6 relative overflow-hidden scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">{subtitle}</span>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-white uppercase tracking-tight">
            {title}
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-6">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-none glass-card rounded-[2rem] px-6 md:px-8 py-2 overflow-hidden border-white/5">
              <AccordionTrigger className="text-lg md:text-xl font-headline font-bold text-white hover:no-underline text-left py-6 hover:text-accent transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 text-base md:text-lg leading-relaxed font-medium pb-8 pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
