
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Zap, Globe, Trophy, Users, BookOpen } from 'lucide-react';

const featureList = [
  {
    title: 'Expert Led Instruction',
    description: 'Learn from industry veterans who have built products for top global companies.',
    icon: Trophy,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Project Based Learning',
    description: 'Build real-world applications that you can actually show off in your portfolio.',
    icon: BookOpen,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    title: 'Global Community',
    description: 'Join a network of thousands of students from over 120 countries.',
    icon: Globe,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    title: 'Career Coaching',
    description: 'Personalized guidance to help you land your dream job in tech.',
    icon: Users,
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  {
    title: 'Direct Support',
    description: 'Get your questions answered fast with our dedicated student support team.',
    icon: ShieldCheck,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  },
  {
    title: 'Lifetime Access',
    description: 'Enroll once and get access to all future updates and course materials.',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  }
];

export function Features() {
  return (
    <section className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 relative">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Proven Methodology</span>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-primary mb-6 uppercase tracking-tight">
            The Freedom Framework
          </h2>
          <div className="h-2 w-24 bg-accent mx-auto mb-8 rounded-full"></div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            We don't just teach code. We provide the tools, mindset, and network required for long-term career success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, idx) => (
            <Card key={idx} className="border-none shadow-xl shadow-primary/5 hover:shadow-2xl transition-all duration-500 group rounded-[2rem]">
              <CardContent className="pt-10 pb-10 px-8">
                <div className={`${feature.bg} ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-headline font-black text-primary mb-4 uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
