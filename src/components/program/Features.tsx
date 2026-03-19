'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Zap, Globe, Trophy, Users, BookOpen, LucideIcon, Star, CheckCircle2 } from 'lucide-react';
import { Feature } from '@/lib/db';

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  BookOpen,
  Globe,
  Users,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2
};

export function Features({ features }: { features?: Feature[] }) {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-40 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 relative">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Proven Methodology</span>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-primary mb-6 uppercase tracking-tight">
            The Mastery Framework
          </h2>
          <div className="h-2 w-24 bg-accent mx-auto mb-8 rounded-full"></div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            We don't just teach code. We provide the tools, mindset, and network required for long-term career success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => {
            const Icon = iconMap[feature.iconName] || Star;
            return (
              <Card key={idx} className="border-none bg-white shadow-elevation hover:-translate-y-2 transition-all duration-500 group rounded-[2.5rem] overflow-hidden">
                <CardContent className="pt-12 pb-12 px-10">
                  <div className="bg-primary/5 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-headline font-black text-primary mb-4 uppercase tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
