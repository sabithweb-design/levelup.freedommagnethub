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

interface FeaturesProps {
  features?: Feature[];
  title?: string;
  subtitle?: string;
}

export function Features({ features, title = 'The Mastery Framework', subtitle = 'Engineered Methodology' }: FeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <section id="features" className="py-24 md:py-40 px-6 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 md:mb-24 relative">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Engineered Methodology</span>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-white mb-6 uppercase tracking-tight">
            {title}
          </h2>
          <div className="h-1.5 w-24 fiery-gradient mx-auto mb-8 rounded-full"></div>
          {subtitle && (
            <p className="text-foreground/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => {
            const Icon = iconMap[feature.iconName] || Star;
            return (
              <Card key={idx} className="glass-card group hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden border-white/5">
                <CardContent className="pt-12 pb-12 px-10">
                  <div className="bg-white/5 text-accent w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:fiery-gradient group-hover:text-white transition-all duration-500 group-hover:fiery-glow">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-headline font-black text-white mb-4 uppercase tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed font-medium">
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
